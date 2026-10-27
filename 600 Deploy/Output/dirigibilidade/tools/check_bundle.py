"""Conferência limitada do bundle da release `dirigibilidade` sobre um `dist/` local.

Uso (da raiz do repositório, depois de `npm run build`):
    python -I "600 Deploy/Output/dirigibilidade/tools/check_bundle.py" dist
    python -I "600 Deploy/Output/dirigibilidade/tools/check_bundle.py" dist docs/physics.md

Imprime uma linha por verificação (`ok`/`FAIL`) e um resumo `checks=... failed=... js=index-<hash>.js`.
Verifica, sem executar nada:
  1. o único JS de `dist/assets/` carrega os três identificadores de acerto publicados (DM-0001, seção 1):
     `arcade-assistido-v5`, `arcade-assistido-v4`, `realista-aluguel-4t-v4`;
  2. o mesmo JS carrega o prefixo do texto compartilhado (`Kartle · `) e o separador ` · ` (DES-0006);
  3. `dist/index.html` tem os elementos que o projeto nomeia: `#speed`, `#handling`, `#lap-result-setup`,
     `#lap-share`, `#handling-preset` com a opção `arcade` selecionada e `#preset-label`;
  4. nenhum arquivo de `dist/` contém `localStorage`, `sessionStorage` ou `indexedDB` escritos pela aplicação —
     a verificação é textual sobre o bundle inteiro (inclui a biblioteca three), por isso só avisa (`warn`),
     nunca reprova: a prova de camada é `CHK-TEST-0010-*` em `npm test`;
  5. (opcional, segundo argumento) o bloco ```json handling-baseline de `docs/physics.md` tem as três entradas.
Sai com 0 quando nenhuma verificação reprovou e com 1 quando alguma reprovou. Não lê nada fora dos caminhos dados.
"""
import json
import re
import sys
from pathlib import Path

root = Path(sys.argv[1])
baseline = Path(sys.argv[2]) if len(sys.argv) > 2 else None
failed = 0
checks = 0


def report(name: str, ok: bool, detail: str = "", level: str = "FAIL") -> None:
    global failed, checks
    checks += 1
    if not ok and level == "FAIL":
        failed += 1
    print(f"{'ok' if ok else level}: {name}{(' - ' + detail) if detail else ''}")


js_files = sorted((root / "assets").glob("index-*.js")) if (root / "assets").is_dir() else []
report("um único JS em dist/assets", len(js_files) == 1, ", ".join(p.name for p in js_files) or "nenhum")
js_text = js_files[0].read_text(encoding="utf-8", errors="replace") if js_files else ""
for ident in ("arcade-assistido-v5", "arcade-assistido-v4", "realista-aluguel-4t-v4"):
    report(f"identificador de acerto `{ident}` no JS", ident in js_text)
report("prefixo do texto compartilhado `Kartle · ` no JS", "Kartle · " in js_text)

html_path = root / "index.html"
html = html_path.read_text(encoding="utf-8", errors="replace") if html_path.is_file() else ""
report("dist/index.html existe", bool(html))
for el in ("speed", "handling", "lap-result-setup", "lap-share", "handling-preset", "preset-label"):
    report(f"elemento `#{el}` em index.html", f'id="{el}"' in html)
report("opção `arcade` selecionada por padrão", bool(re.search(r'<option value="arcade" selected>', html)))
report("rótulo inicial `ARCADE ASSISTIDO`", "ARCADE ASSISTIDO" in html)

for store in ("localStorage", "sessionStorage", "indexedDB"):
    hits = [p.name for p in root.rglob("*") if p.is_file() and store in p.read_text(encoding="utf-8", errors="replace")]
    report(f"`{store}` ausente do bundle (textual; inclui three)", not hits, ", ".join(hits), level="warn")

if baseline is not None:
    text = baseline.read_text(encoding="utf-8", errors="replace") if baseline.is_file() else ""
    m = re.search(r"```json handling-baseline\s*\n(.*?)\n```", text, re.DOTALL)
    report("bloco `handling-baseline` presente", m is not None)
    if m:
        try:
            data = json.loads(m.group(1))
            entries = data if isinstance(data, list) else data.get("entries", data)
            versions = sorted(e.get("setupVersion", "") for e in entries) if isinstance(entries, list) else sorted(entries.keys())
            report("três entradas no bloco", set(versions) >= {"arcade-assistido-v5", "arcade-assistido-v4", "realista-aluguel-4t-v4"}, ", ".join(versions))
            v5 = next((e for e in entries if isinstance(e, dict) and e.get("setupVersion") == "arcade-assistido-v5"), None) if isinstance(entries, list) else entries.get("arcade-assistido-v5")
            report("entrada v5 com `measuredAtUtc`", bool(v5) and bool(v5.get("measuredAtUtc")), str(v5.get("measuredAtUtc")) if v5 else "")
        except (ValueError, AttributeError) as exc:
            report("bloco `handling-baseline` legível como JSON", False, type(exc).__name__)

print()
print(f"checks={checks} failed={failed} js={js_files[0].name if js_files else '-'}")
sys.exit(0 if failed == 0 else 1)
