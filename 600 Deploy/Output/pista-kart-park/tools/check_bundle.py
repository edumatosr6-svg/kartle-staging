"""Conferência limitada do bundle da release `pista-kart-park` sobre um `dist/` local.

Uso (da raiz do repositório, depois de `npm run build`):
    python -I "600 Deploy/Output/pista-kart-park/tools/check_bundle.py" dist tracks/registry.json
    python -I "600 Deploy/Output/pista-kart-park/tools/check_bundle.py" dist tracks/registry.json docs/kart-park-device-log.md

Imprime uma linha por verificação (`ok`/`FAIL`/`warn`) e um resumo
`checks=... failed=... js=index-<hash>.js js_bytes=... total_bytes=... track_bytes=... track_sha256=...`.
Verifica, sem executar nada (copiado e adaptado de `600 Deploy/Output/modelo-kart-01/tools/check_bundle.py`):
  1. `dist/assets/` tem exatamente um JS e um CSS e nenhum outro arquivo — o arquivo da Kart Park entra no JS como
     literal (`import ... from './tracks/kart-park-v1.json?raw'`, ADR-0002), não como recurso servido (NFR-0010);
  2. o arquivo de pista está no JS **uma vez**, começa em `{"schemaVersion":3,"trackId":"kart-park"`, é JSON legível e,
     acrescido do `\n` final que o arquivo de origem tem, dá o **mesmo SHA-256 e os mesmos bytes** que a entrada
     `kart-park` 1 de `tracks/registry.json` (NFR-0006, DM-0002: o bundle serve a versão publicada, byte a byte);
     a entrada está em `STAGING` (ADR-0005: `PRODUCTION` exige `esriDecisionRef`); o literal mede menos de
     200 000 bytes (NFR-0001); as chaves são exatamente as de DM-0001 (nenhum campo de recorde — V18); as contagens são
     as da release (684 pontos, 38 marcadores, 34 zebras, 3 limites, 1 barreira de 382 vértices, `COUNTER_CLOCKWISE`);
  3. os textos do seletor e do crédito que a minificação preserva: o nome da Kart Park, `displayLengthM:687`,
     `Pista sintética`, `© colaboradores do OpenStreetMap`, `licença ODbL`, `https://openstreetmap.org/copyright`,
     `noopener noreferrer`, `_blank`, `trackId:` seguido de `kart-park` (DES-0005, DES-0007, DES-0012; AC-US-0006-01..08);
  4. o retorno da zebra e a barreira: `vibrate(20)` (20 ms, DES-0009), `lowpassHz:160` e a fonte `noise` do som da
     zebra, `curbWheelCount`, `barrierContact`/`barrierTouching` (DES-0003, DES-0009);
  5. as malhas da cena da Kart Park por nome: `asphalt`, `curbs`, `barriers`, `start-line` (DES-0008);
  6. nenhum texto proibido: `esri` (sem distinção de caixa; o crédito da Esri só entra depois da decisão — NFR-0012),
     `41.45`, `41,45`, `41450`, `KARTPLAN`, `recorde` (AC-US-0006-09), `Circuito Aurora`, nem os símbolos do kart
     provisório `helmet`/`boxGeo`; `XMLHttpRequest`/`sendBeacon` ausentes; `fetch(` só avisa (o polyfill de
     `modulepreload` do Vite o contém; os módulos da feature são provados por CHK-TEST-0011-02);
  7. as releases anteriores continuam no JS (`kart01-decals`, `=1.38,`, `arcade-assistido-v5`, `arcade-assistido-v4`,
     `realista-aluguel-4t-v4`, `Kartle · `, `synthetic`);
  8. `dist/index.html` tem os elementos desta feature (`#track-name`, `#track-selector`, `#track-credit`,
     `#lap-result-credit`) e os herdados (`#scene`, `#track-status`, `#lap-offer`, `#lap-result`, `#lap-result-setup`,
     `#preset-label`, `#handling-preset` com `arcade` selecionado); `Circuito Aurora` e `esri` ausentes do HTML e do CSS;
     o CSS tem `.track-selector` e `.track-credit`;
  9. nenhum arquivo de `dist/` contém `localStorage`, `sessionStorage` ou `indexedDB` — textual sobre o bundle inteiro
     (inclui a biblioteca three), por isso só avisa (`warn`): a prova de camada é CHK-TEST-0011-02;
 10. tamanho: o JS e o total de `dist/` abaixo de 3 145 728 bytes (RNF02);
 11. (opcional, terceiro argumento) `docs/kart-park-device-log.md` existe, nomeia o JS deste `dist/` e tem os
     identificadores `E2E-01` a `E2E-08` e os campos `fpsPerSecond` e `minFps` — não julga as medidas, só a presença.
Sai com 0 quando nenhuma verificação reprovou e com 1 quando alguma reprovou. Não lê nada fora dos caminhos dados.
"""
import hashlib
import json
import re
import sys
from pathlib import Path

root = Path(sys.argv[1])
registry_path = Path(sys.argv[2]) if len(sys.argv) > 2 else None
device_log = Path(sys.argv[3]) if len(sys.argv) > 3 else None
LIMIT = 3 * 1024 * 1024
TRACK_LITERAL_LIMIT = 200_000
TRACK_HEAD = '{"schemaVersion":3,"trackId":"kart-park"'
DM_0001_KEYS = {"schemaVersion", "trackId", "trackVersion", "osmDerived", "direction", "startPosition", "finishLine",
                "sectorLimits", "markers", "centerline", "curbs", "barriers"}
failed = 0
checks = 0


def report(name: str, ok: bool, detail: str = "", level: str = "FAIL") -> None:
    global failed, checks
    checks += 1
    if not ok and level == "FAIL":
        failed += 1
    print(f"{'ok' if ok else level}: {name}{(' - ' + detail) if detail else ''}")


# 1. assets
assets = root / "assets"
all_assets = sorted(p for p in assets.iterdir() if p.is_file()) if assets.is_dir() else []
js_files = [p for p in all_assets if re.fullmatch(r"index-[A-Za-z0-9_-]+\.js", p.name)]
css_files = [p for p in all_assets if re.fullmatch(r"index-[A-Za-z0-9_-]+\.css", p.name)]
others = [p for p in all_assets if p not in js_files and p not in css_files]
report("um único JS em dist/assets", len(js_files) == 1, ", ".join(p.name for p in js_files) or "nenhum")
report("um único CSS em dist/assets", len(css_files) == 1, ", ".join(p.name for p in css_files) or "nenhum")
report("nenhum outro arquivo em dist/assets (o arquivo da pista vai dentro do JS)", not others, ", ".join(p.name for p in others))
js_text = js_files[0].read_text(encoding="utf-8", errors="replace") if js_files else ""
css_text = css_files[0].read_text(encoding="utf-8", errors="replace") if css_files else ""

# 2. the published track file inside the JS
track_text = ""
track_obj = None
track_sha = "-"
starts = [m.start() for m in re.finditer(re.escape(TRACK_HEAD), js_text)]
report("arquivo da Kart Park presente uma vez no JS", len(starts) == 1, f"{len(starts)} ocorrência(s) de `{TRACK_HEAD}`")
if len(starts) == 1:
    try:
        track_obj, end = json.JSONDecoder().raw_decode(js_text, starts[0])
        track_text = js_text[starts[0]:end]
    except ValueError as exc:
        report("arquivo da Kart Park é JSON legível no JS", False, f"{type(exc).__name__}: {exc}")
    if track_obj is not None:
        report("arquivo da Kart Park é JSON legível no JS", isinstance(track_obj, dict))
        track_bytes = track_text.encode("utf-8")
        track_sha = hashlib.sha256(track_bytes + b"\n").hexdigest()
        report("literal da pista abaixo de 200 000 bytes (NFR-0001)", len(track_bytes) < TRACK_LITERAL_LIMIT, f"{len(track_bytes)} bytes")
        report("chaves do arquivo exatamente as de DM-0001 (nenhum campo de recorde)", set(track_obj.keys()) == DM_0001_KEYS,
               ", ".join(sorted(set(track_obj.keys()) ^ DM_0001_KEYS)) or "iguais")
        report("`schemaVersion` 3, `trackId` kart-park, `trackVersion` 1, `osmDerived` true",
               track_obj.get("schemaVersion") == 3 and track_obj.get("trackId") == "kart-park"
               and track_obj.get("trackVersion") == 1 and track_obj.get("osmDerived") is True)
        report("`direction` COUNTER_CLOCKWISE", track_obj.get("direction") == "COUNTER_CLOCKWISE")
        counts = {"centerline": 684, "markers": 38, "curbs": 34, "sectorLimits": 3, "barriers": 1}
        for key, expected in counts.items():
            got = len(track_obj.get(key, []))
            report(f"`{key}` com {expected} elementos", got == expected, str(got))
        barriers = track_obj.get("barriers") or [{}]
        report("barreira com 382 vértices", len(barriers[0].get("points", [])) == 382, str(len(barriers[0].get("points", []))))
        if registry_path is not None:
            try:
                registry = json.loads(registry_path.read_text(encoding="utf-8"))
            except (OSError, ValueError) as exc:
                registry = {}
                report("tracks/registry.json legível", False, f"{type(exc).__name__}: {exc}")
            entries = [e for e in registry.get("entries", []) if e.get("trackId") == "kart-park" and e.get("trackVersion") == 1]
            report("entrada `kart-park` 1 no registro", len(entries) == 1, str(len(entries)))
            if len(entries) == 1:
                e = entries[0]
                report("SHA-256 do literal + LF igual ao registrado (NFR-0006; o bundle serve a versão publicada)",
                       e.get("sha256") == track_sha, f"bundle {track_sha[:16]}…, registro {str(e.get('sha256'))[:16]}…")
                report("bytes do literal + LF iguais a `fileBytes` do registro", e.get("fileBytes") == len(track_bytes) + 1,
                       f"{len(track_bytes) + 1} vs {e.get('fileBytes')}")
                state = e.get("publicationState")
                report("estado de publicação STAGING ou PRODUCTION com `esriDecisionRef` (ADR-0005)",
                       state == "STAGING" or (state == "PRODUCTION" and bool(e.get("esriDecisionRef"))), str(state))
                report("registro em STAGING — a Kart Park não está promovida (NFR-0012)", state == "STAGING", str(state), level="warn")

# 3. selector and credit texts
for marker in ("Kart Park — São José dos Pinhais (traçado aproximado)", "displayLengthM:687", "Pista sintética",
               "© colaboradores do OpenStreetMap", "licença ODbL", "https://openstreetmap.org/copyright",
               "noopener noreferrer", "_blank", "selectedTrackId", "NO_SESSION", "TRAINING"):
    report(f"texto `{marker}` no JS", marker in js_text)
report("`trackId:`kart-park`` no catálogo do JS", bool(re.search(r"trackId:[`'\"]kart-park[`'\"]", js_text)))

# 4. curb feedback, sound and barrier
report("`vibrate(20)` no JS (pulso de 20 ms)", bool(re.search(r"vibrate\(\s*20\s*\)", js_text)))
report("`lowpassHz:160` no JS (som da zebra)", "lowpassHz:160" in js_text)
report("fonte `noise` do som da zebra no JS", bool(re.search(r"source:[`'\"]noise[`'\"]", js_text)))
for marker in ("curbWheelCount", "barrierContact", "barrierTouching"):
    report(f"marcador `{marker}` no JS", marker in js_text)

# 5. scene meshes
for mesh in ("asphalt", "curbs", "barriers", "start-line"):
    report(f"malha `{mesh}` nomeada no JS", bool(re.search(rf"name=[`'\"]{re.escape(mesh)}[`'\"]", js_text)))

# 6. forbidden texts
js_lower = js_text.lower()
for ghost in ("esri", "41.45", "41,45", "41450", "kartplan", "recorde", "circuito aurora"):
    report(f"texto `{ghost}` ausente do JS (sem distinção de caixa)", ghost not in js_lower)
for ghost in ("helmet", "boxGeo", "XMLHttpRequest", "sendBeacon"):
    report(f"símbolo `{ghost}` ausente do JS", ghost not in js_text)
report("`fetch(` ausente do JS (textual; o polyfill de modulepreload do Vite o contém)", "fetch(" not in js_text,
       f"{js_text.count('fetch(')} ocorrência(s)", level="warn")

# 7. previous releases
for ident in ("kart01-decals", "=1.38,", "arcade-assistido-v5", "arcade-assistido-v4", "realista-aluguel-4t-v4", "Kartle · ", "synthetic"):
    report(f"release anterior: `{ident}` no JS", ident in js_text)

# 8. html and css
html_path = root / "index.html"
html = html_path.read_text(encoding="utf-8", errors="replace") if html_path.is_file() else ""
report("dist/index.html existe", bool(html))
for el in ("track-name", "track-selector", "track-credit", "lap-result-credit", "scene", "track-status", "lap-offer",
           "lap-result", "lap-result-setup", "preset-label", "handling-preset"):
    report(f"elemento `#{el}` em index.html", f'id="{el}"' in html)
report("opção `arcade` selecionada por padrão", '<option value="arcade" selected>' in html)
report("`Circuito Aurora` ausente de index.html", "Circuito Aurora" not in html)
report("`esri` ausente de index.html e do CSS", "esri" not in html.lower() and "esri" not in css_text.lower())
for cls in (".track-selector", ".track-credit"):
    report(f"classe `{cls}` no CSS", cls in css_text)

# 9. storage
for store in ("localStorage", "sessionStorage", "indexedDB"):
    hits = [p.name for p in root.rglob("*") if p.is_file() and store in p.read_text(encoding="utf-8", errors="replace")]
    report(f"`{store}` ausente do bundle (textual; inclui three)", not hits, ", ".join(hits), level="warn")

# 10. sizes
js_bytes = js_files[0].stat().st_size if js_files else 0
total = sum(p.stat().st_size for p in root.rglob("*") if p.is_file())
report("JS abaixo de 3 145 728 bytes", 0 < js_bytes < LIMIT, f"{js_bytes} bytes")
report("dist/ inteiro abaixo de 3 145 728 bytes", 0 < total < LIMIT, f"{total} bytes")

# 11. device log
if device_log is not None:
    text = device_log.read_text(encoding="utf-8", errors="replace") if device_log.is_file() else ""
    report("registro em tela existe", bool(text), str(device_log))
    report("registro em tela nomeia o JS deste dist/", bool(js_files) and js_files[0].name in text)
    report("registro em tela tem E2E-01 a E2E-08", all(f"E2E-0{n}" in text for n in range(1, 9)))
    report("registro em tela tem os campos `fpsPerSecond` e `minFps`", "fpsPerSecond" in text and "minFps" in text)

print()
print(f"checks={checks} failed={failed} js={js_files[0].name if js_files else '-'} js_bytes={js_bytes} total_bytes={total} "
      f"track_bytes={len(track_text.encode('utf-8')) if track_text else 0} track_sha256={track_sha}")
sys.exit(0 if failed == 0 else 1)
