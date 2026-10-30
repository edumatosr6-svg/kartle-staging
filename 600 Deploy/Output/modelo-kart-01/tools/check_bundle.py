"""Conferência limitada do bundle da release `modelo-kart-01` sobre um `dist/` local.

Uso (da raiz do repositório, depois de `npm run build`):
    python -I "600 Deploy/Output/modelo-kart-01/tools/check_bundle.py" dist
    python -I "600 Deploy/Output/modelo-kart-01/tools/check_bundle.py" dist docs/kart-01/device-log.md

Imprime uma linha por verificação (`ok`/`FAIL`/`warn`) e um resumo `checks=... failed=... js=index-<hash>.js`.
Verifica, sem executar nada (copiado e adaptado de `600 Deploy/Output/dirigibilidade/tools/check_bundle.py`):
  1. `dist/assets/` tem exatamente um JS e um CSS e nenhum outro arquivo — o Kart 01 é geometria por programa,
     sem textura, modelo ou fonte nova (NFR-0003);
  2. o JS carrega os marcadores do Kart 01 que a minificação preserva: o código de registro `kart01-decals` e
     `NO_2D_CONTEXT` (DES-0007), os nomes de grupo e de malha `paraChoqueTraseiro`, `rodaDianteiraEsq` e
     `placaTraseira` e a âncora `bumperPlate` (DES-0001), o `fillText` do número `01` da placa (AC-US-0001-16), os
     modos de câmera `TRACK_OVERVIEW`/`COUNTDOWN_DESCENT`/`RACE_CHASE`, as constantes da pose de corrida e do campo de
     visão `1.38`, `3.05`, `3.2`, `.3`, `62`, `60` (DES-0003) como literais `=<valor>,`, e a condição das marcas de pneu
     do seed rev 4 (`speedMps>6&&<x>.sideslipRad>.055`, DES-0005 1.4.0; `sideslipRad` é o módulo da deriva);
  3. nenhum símbolo do kart provisório (`helmet`, `boxGeo`; AC-US-0001-14) nem dos efeitos de turbo retirados no seed
     rev 3/4 (`exhaustOutlet`, `escapamentoSaida`, `turboFovDeltaDeg`, `baseVerticalFovDeg`; AC-US-0005-05,
     AC-US-0003-09 retirado) sobrevive no JS;
  4. o JS continua a carregar o que as releases contidas publicam (`arcade-assistido-v6`, `arcade-assistido-v4`,
     `realista-aluguel-4t-v4`, `Kartle · `);
  5. `dist/index.html` tem os elementos que o projeto nomeia: `#scene`, `#lap-countdown`, `#lap-result`, `#speed`,
     `#handling`, `#tilt`, `#preset-label`, `#handling-preset` com `arcade` selecionado (`#lap-result-setup` saiu do HTML
     com a `dirigibilidade`, `cfad3dc`);
  6. nenhum arquivo de `dist/` contém `localStorage`, `sessionStorage` ou `indexedDB` — verificação textual sobre o bundle
     inteiro (inclui a biblioteca three), por isso só avisa (`warn`): a prova de camada é `CHK-TEST-0004-*` em `npm test`;
  7. tamanho: o JS e o total de `dist/` abaixo de 3 145 728 bytes (NFR-0002, RNF02);
  8. (opcional, segundo argumento) `docs/kart-01/device-log.md` existe e tem os campos `fpsPerSecond` e `minFps`
     (DM-0001, seção 2); se nomeia o JS deste `dist/` só avisa (`warn`): o registro passa a nomeá-lo na primeira
     execução humana sobre este build (H1–H6 do `runbook.md`) — não julga as medidas, só a presença do registro.
Sai com 0 quando nenhuma verificação reprovou e com 1 quando alguma reprovou. Não lê nada fora dos caminhos dados.
"""
import re
import sys
from pathlib import Path

root = Path(sys.argv[1])
device_log = Path(sys.argv[2]) if len(sys.argv) > 2 else None
LIMIT = 3 * 1024 * 1024
failed = 0
checks = 0


def report(name: str, ok: bool, detail: str = "", level: str = "FAIL") -> None:
    global failed, checks
    checks += 1
    if not ok and level == "FAIL":
        failed += 1
    print(f"{'ok' if ok else level}: {name}{(' - ' + detail) if detail else ''}")


assets = root / "assets"
all_assets = sorted(p for p in assets.iterdir() if p.is_file()) if assets.is_dir() else []
js_files = [p for p in all_assets if re.fullmatch(r"index-[A-Za-z0-9_-]+\.js", p.name)]
css_files = [p for p in all_assets if re.fullmatch(r"index-[A-Za-z0-9_-]+\.css", p.name)]
others = [p for p in all_assets if p not in js_files and p not in css_files]
report("um único JS em dist/assets", len(js_files) == 1, ", ".join(p.name for p in js_files) or "nenhum")
report("um único CSS em dist/assets", len(css_files) == 1, ", ".join(p.name for p in css_files) or "nenhum")
report("nenhum outro arquivo em dist/assets (sem textura, modelo ou fonte nova)", not others, ", ".join(p.name for p in others))
js_text = js_files[0].read_text(encoding="utf-8", errors="replace") if js_files else ""

for marker in ("kart01-decals", "NO_2D_CONTEXT", "paraChoqueTraseiro", "rodaDianteiraEsq", "placaTraseira",
               "bumperPlate", "TRACK_OVERVIEW", "COUNTDOWN_DESCENT", "RACE_CHASE"):
    report(f"marcador `{marker}` no JS", marker in js_text)
report("`fillText` do número `01` da placa no JS", bool(re.search(r"fillText\(\s*[`'\"]01[`'\"]", js_text)))
report("condição das marcas de pneu (> 6 m/s e |deriva| > 0,055 rad) no JS",
       bool(re.search(r"speedMps>6&&[A-Za-z_$][\w$]*\.sideslipRad>\.055", js_text)))
for const in ("1.38", "3.05", "3.2", ".3", "62", "60"):
    report(f"constante de câmera `={const},` no JS", f"={const}," in js_text)
for ghost in ("helmet", "boxGeo"):
    report(f"símbolo do kart provisório `{ghost}` ausente do JS", ghost not in js_text)
for gone in ("exhaustOutlet", "escapamentoSaida", "turboFovDeltaDeg", "baseVerticalFovDeg"):
    report(f"efeito de turbo retirado: `{gone}` ausente do JS", gone not in js_text)
for ident in ("arcade-assistido-v6", "arcade-assistido-v4", "realista-aluguel-4t-v4", "Kartle · "):
    report(f"release contida: `{ident}` no JS", ident in js_text)

html_path = root / "index.html"
html = html_path.read_text(encoding="utf-8", errors="replace") if html_path.is_file() else ""
report("dist/index.html existe", bool(html))
for el in ("scene", "lap-countdown", "lap-result", "speed", "handling", "tilt", "preset-label", "handling-preset"):
    report(f"elemento `#{el}` em index.html", f'id="{el}"' in html)
report("opção `arcade` selecionada por padrão", '<option value="arcade" selected>' in html)

for store in ("localStorage", "sessionStorage", "indexedDB"):
    hits = [p.name for p in root.rglob("*") if p.is_file() and store in p.read_text(encoding="utf-8", errors="replace")]
    report(f"`{store}` ausente do bundle (textual; inclui three)", not hits, ", ".join(hits), level="warn")

js_bytes = js_files[0].stat().st_size if js_files else 0
total = sum(p.stat().st_size for p in root.rglob("*") if p.is_file())
report("JS abaixo de 3 145 728 bytes", 0 < js_bytes < LIMIT, f"{js_bytes} bytes")
report("dist/ inteiro abaixo de 3 145 728 bytes", 0 < total < LIMIT, f"{total} bytes")

if device_log is not None:
    text = device_log.read_text(encoding="utf-8", errors="replace") if device_log.is_file() else ""
    report("registro em tela existe", bool(text), str(device_log))
    report("registro em tela nomeia o JS deste dist/", bool(js_files) and js_files[0].name in text,
           "a primeira execução humana sobre este build o nomeia", level="warn")
    report("registro em tela tem os campos `fpsPerSecond` e `minFps`", "fpsPerSecond" in text and "minFps" in text)

print()
print(f"checks={checks} failed={failed} js={js_files[0].name if js_files else '-'} js_bytes={js_bytes} total_bytes={total}")
sys.exit(0 if failed == 0 else 1)
