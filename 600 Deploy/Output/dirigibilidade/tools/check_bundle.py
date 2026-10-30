"""Conferência limitada do bundle da release `dirigibilidade` (acerto `arcade-assistido-v6`) sobre um `dist/` local.

Uso (da raiz do repositório, depois de `npm run build`; o diretório de saída pode ser outro, por exemplo um temporário):
    python -I "600 Deploy/Output/dirigibilidade/tools/check_bundle.py" dist
    python -I "600 Deploy/Output/dirigibilidade/tools/check_bundle.py" dist docs/physics.md

Imprime uma linha por verificação (`ok`/`FAIL`/`warn`) e um resumo `checks=... failed=... js=index-<hash>.js`.
Verifica, sem executar nada:
  1. o único JS de `dist/assets/` declara `arcade-assistido-v6` como versão corrente do Arcade com
     `arcade-assistido-v4` como a anterior publicada (DM-0001, seção 1), carrega `realista-aluguel-4t-v4` e não carrega
     `arcade-assistido-v5` (rodada de staging substituída);
  2. o mesmo JS carrega o prefixo do texto compartilhado (`Kartle · `, DES-0006);
  3. `dist/index.html` tem `#speed`, `#handling`, `#lap-share`, `#handling-preset` com a opção `arcade` selecionada,
     `#preset-label` com `ARCADE ASSISTIDO`, e não tem `#lap-result-setup`;
  4. drift e turbo fora das telas (DES-0009, AC-US-0003-12..15): `index.html` e o CSS sem
     `drift|turbo|impulso|combo|Espaço` (sem distinguir maiúsculas) e sem `maneuver-guide`; a dica da barra é
     exatamente `Dirigir`; um único `.touch-controls` com exatamente `left`, `right`, `brake`, `throttle`;
  5. nenhum arquivo de `dist/` contém `localStorage`, `sessionStorage` ou `indexedDB` — verificação textual sobre o
     bundle inteiro (inclui a biblioteca three), por isso só avisa (`warn`), nunca reprova: a prova de camada é
     `CHK-TEST-0010-*` em `npm test`;
  6. (opcional, segundo argumento) o bloco ```json handling-baseline de `docs/physics.md` tem as entradas
     `arcade-assistido-v4`, `realista-aluguel-4t-v4` e `arcade-assistido-v6` (esta com `measuredAtUtc`), e mantém a
     `arcade-assistido-v5` como registro da rodada substituída.
Sai com 0 quando nenhuma verificação reprovou e com 1 quando alguma reprovou. Não lê nada fora dos caminhos dados.
"""
import json
import re
import sys
from pathlib import Path

root = Path(sys.argv[1])
baseline = Path(sys.argv[2]) if len(sys.argv) > 2 else None
DRIFT_PATTERN = re.compile(r"drift|turbo|impulso|combo|Espaço", re.IGNORECASE)
CURRENT = re.compile(r"setupVersion:\s*[`'\"]arcade-assistido-v6[`'\"]\s*,\s*previousSetupVersion:\s*[`'\"]arcade-assistido-v4[`'\"]")
failed = 0
checks = 0


def report(name: str, ok: bool, detail: str = "", level: str = "FAIL") -> None:
    global failed, checks
    checks += 1
    if not ok and level == "FAIL":
        failed += 1
    print(f"{'ok' if ok else level}: {name}{(' - ' + detail) if detail else ''}")


assets = root / "assets"
js_files = sorted(assets.glob("index-*.js")) if assets.is_dir() else []
css_files = sorted(assets.glob("index-*.css")) if assets.is_dir() else []
report("um único JS em dist/assets", len(js_files) == 1, ", ".join(p.name for p in js_files) or "nenhum")
js_text = js_files[0].read_text(encoding="utf-8", errors="replace") if js_files else ""
report("JS declara `arcade-assistido-v6` corrente e `arcade-assistido-v4` anterior", CURRENT.search(js_text) is not None)
report("identificador `realista-aluguel-4t-v4` no JS", "realista-aluguel-4t-v4" in js_text)
report("`arcade-assistido-v5` ausente do JS", "arcade-assistido-v5" not in js_text)
report("prefixo do texto compartilhado `Kartle · ` no JS", "Kartle · " in js_text)

html_path = root / "index.html"
html = html_path.read_text(encoding="utf-8", errors="replace") if html_path.is_file() else ""
report("dist/index.html existe", bool(html))
for el in ("speed", "handling", "lap-share", "handling-preset", "preset-label"):
    report(f"elemento `#{el}` em index.html", f'id="{el}"' in html)
report("opção `arcade` selecionada por padrão", '<option value="arcade" selected>' in html)
report("rótulo inicial `ARCADE ASSISTIDO`", "ARCADE ASSISTIDO" in html)
report("`#lap-result-setup` ausente", 'id="lap-result-setup"' not in html)

css = "".join(p.read_text(encoding="utf-8", errors="replace") for p in css_files)
hits = sorted(set(m.group(0).lower() for m in DRIFT_PATTERN.finditer(html + css)))
report("index.html e CSS sem drift, turbo, impulso, combo nem Espaço", not hits, ", ".join(hits))
report("sem guia de manobras (`maneuver-guide`)", "maneuver-guide" not in html + css)
hint = re.findall(r'<span class="control-hint">([^<]*)</span>', html)
report("dica da barra é exatamente `Dirigir`", hint == ["Dirigir"], " | ".join(hint) or "nenhuma")
controls = re.findall(r'data-control="([^"]*)"', html)
report("controle de toque: um `.touch-controls` com left, right, brake, throttle",
       html.count('class="touch-controls"') == 1 and sorted(controls) == ["brake", "left", "right", "throttle"],
       ", ".join(controls) or "nenhum")

for store in ("localStorage", "sessionStorage", "indexedDB"):
    found = [p.name for p in root.rglob("*") if p.is_file() and store in p.read_text(encoding="utf-8", errors="replace")]
    report(f"`{store}` ausente do bundle (textual; inclui three)", not found, ", ".join(found), level="warn")

if baseline is not None:
    text = baseline.read_text(encoding="utf-8", errors="replace") if baseline.is_file() else ""
    m = re.search(r"```json handling-baseline\s*\n(.*?)\n```", text, re.DOTALL)
    report("bloco `handling-baseline` presente", m is not None)
    if m:
        try:
            data = json.loads(m.group(1))
            entries = data if isinstance(data, list) else data.get("entries", [])
            by_version = {e.get("setupVersion", ""): e for e in entries if isinstance(e, dict)}
            report("entradas v4, Realista e v6 no bloco",
                   {"arcade-assistido-v4", "realista-aluguel-4t-v4", "arcade-assistido-v6"} <= set(by_version), ", ".join(sorted(by_version)))
            v6 = by_version.get("arcade-assistido-v6")
            report("entrada v6 com `measuredAtUtc`", bool(v6) and bool(v6.get("measuredAtUtc")), str(v6.get("measuredAtUtc")) if v6 else "")
            v5 = by_version.get("arcade-assistido-v5")
            report("entrada v5 mantida como registro da rodada substituída", bool(v5), str(v5.get("measuredAtUtc")) if v5 else "")
        except (ValueError, AttributeError) as exc:
            report("bloco `handling-baseline` legível como JSON", False, type(exc).__name__)

print()
print(f"checks={checks} failed={failed} js={js_files[0].name if js_files else '-'}")
sys.exit(0 if failed == 0 else 1)
