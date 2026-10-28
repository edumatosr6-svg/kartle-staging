"""Conferência limitada da página servida (staging ou produção) para a release `pista-kart-park`.

Uso (só leitura; três GET em HTTPS, nenhum outro efeito):
    python -I "600 Deploy/Output/pista-kart-park/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/
    python -I "600 Deploy/Output/pista-kart-park/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/ index-DYFBop8t.js

Imprime uma linha por verificação (`ok`/`FAIL`/`warn`) e um resumo
`status=... js=index-<hash>.js js_bytes=... css_bytes=... cache_control=... last_modified=... track_sha256=... checks=... failed=...`
(copiado e adaptado de `600 Deploy/Output/modelo-kart-01/tools/check_served.py`):
  1. a URL responde 200 em HTTPS (a URL tem de começar por `https://`; `http://` é recusado antes de qualquer pedido);
  2. o `index.html` servido referencia exatamente um `assets/index-<hash>.js` e um `.css` sob a base da URL;
  3. (opcional, segundo argumento) o `<hash>` do JS é o esperado — o impresso no passo *Build* da execução aprovada;
  4. o HTML servido tem os elementos desta feature (`#track-name`, `#track-selector`, `#track-credit`,
     `#lap-result-credit`) e os herdados (`#scene`, `#track-status`, `#lap-offer`, `#lap-result`, `#lap-result-setup`,
     `#preset-label`, `#handling-preset` com `arcade` selecionado); `Circuito Aurora` e `esri` ausentes;
  5. o JS servido responde 200 e carrega o arquivo da Kart Park **uma vez** (`{"schemaVersion":3,"trackId":"kart-park"`),
     JSON legível cujo SHA-256 (com o `\n` final do arquivo) é o da entrada `kart-park` 1 do registro na árvore desta
     release (`KART_PARK_V1_SHA256`, `tracks/registry.json` em `d9139a2`) — a página serve a versão publicada, byte a
     byte (NFR-0006); o literal mede menos de 200 000 bytes (NFR-0001); 38 marcadores, 34 zebras, 684 pontos, 1 barreira;
  6. os textos do seletor e do crédito, o retorno da zebra (`vibrate(20)`, `lowpassHz:160`), a barreira
     (`barrierContact`), as malhas da cena, nenhum texto proibido (`esri`, `41.45`, `41,45`, `41450`, `KARTPLAN`,
     `recorde`, `Circuito Aurora`, `helmet`, `boxGeo`) e os identificadores das releases anteriores;
  7. o CSS servido responde 200 e tem `.track-selector` e `.track-credit`;
  8. tamanho do JS servido e da soma JS + CSS + HTML contra o limite de 3 145 728 bytes (RNF02).
Não substitui o `smoke.md`: não executa a página, não mede ritmo, não lê o console nem sente a vibração.
Sai com 0 sem reprovação, 1 com.
"""
import hashlib
import json
import re
import sys
import urllib.request

url = sys.argv[1]
expected_js = sys.argv[2] if len(sys.argv) > 2 else None
LIMIT = 3 * 1024 * 1024
TRACK_LITERAL_LIMIT = 200_000
TRACK_HEAD = '{"schemaVersion":3,"trackId":"kart-park"'
# tracks/registry.json, entrada kart-park 1 (STAGING), árvore de d9139a2 — 43 013 bytes com o LF final.
KART_PARK_V1_SHA256 = "04ce5e510410e297764c047739422b07d46290c70eade1c1fb5bb7d120f057b1"
failed = 0
checks = 0


def report(name: str, ok: bool, detail: str = "", level: str = "FAIL") -> None:
    global failed, checks
    checks += 1
    if not ok and level == "FAIL":
        failed += 1
    print(f"{'ok' if ok else level}: {name}{(' - ' + detail) if detail else ''}")


def get(u: str):
    req = urllib.request.Request(u, headers={"User-Agent": "kartle-deploy-check/1", "Cache-Control": "no-cache"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.status, dict(resp.headers), resp.read()


if not url.startswith("https://"):
    print("FAIL: a URL tem de ser https:// (RNF06); nenhum pedido feito")
    sys.exit(1)
if not url.endswith("/"):
    url += "/"

try:
    status, headers, body = get(url)
except Exception as exc:  # noqa: BLE001 - só o tipo e a mensagem, sem corpo
    print(f"FAIL: GET {url} - {type(exc).__name__}: {exc}")
    sys.exit(1)
html = body.decode("utf-8", errors="replace")
report("index.html responde 200 em HTTPS", status == 200, str(status))

js_refs = sorted(set(re.findall(r'(assets/index-[A-Za-z0-9_-]+\.js)', html)))
css_refs = sorted(set(re.findall(r'(assets/index-[A-Za-z0-9_-]+\.css)', html)))
report("exatamente um JS referenciado", len(js_refs) == 1, ", ".join(js_refs) or "nenhum")
report("exatamente um CSS referenciado", len(css_refs) == 1, ", ".join(css_refs) or "nenhum")
base_path = "/" + url.split("/", 3)[3] if url.count("/") >= 3 else "/"
report(f"assets referenciados sob a base `{base_path}`", f'src="{base_path}assets/' in html, "o build precisa de --base=<repo>")
js_name = js_refs[0].split("/")[-1] if js_refs else ""
if expected_js:
    report("hash do JS é o esperado", js_name == expected_js, f"servido {js_name}, esperado {expected_js}")

for el in ("track-name", "track-selector", "track-credit", "lap-result-credit", "scene", "track-status", "lap-offer",
           "lap-result", "lap-result-setup", "preset-label", "handling-preset"):
    report(f"elemento `#{el}` no HTML servido", f'id="{el}"' in html)
report("opção `arcade` selecionada por padrão", '<option value="arcade" selected>' in html)
report("`Circuito Aurora` ausente do HTML servido", "Circuito Aurora" not in html)
report("`esri` ausente do HTML servido", "esri" not in html.lower())


def fetch_asset(ref: str):
    global failed
    try:
        return get(url + ref)
    except Exception as exc:  # noqa: BLE001
        print(f"FAIL: GET {url + ref} - {type(exc).__name__}: {exc}")
        failed += 1
        return 0, {}, b""


js_status, js_headers, js_body = fetch_asset(js_refs[0]) if js_refs else (0, {}, b"")
js_text = js_body.decode("utf-8", errors="replace")
report("JS servido responde 200", js_status == 200, str(js_status))

track_sha = "-"
starts = [m.start() for m in re.finditer(re.escape(TRACK_HEAD), js_text)]
report("arquivo da Kart Park presente uma vez no JS servido", len(starts) == 1, f"{len(starts)} ocorrência(s)")
if len(starts) == 1:
    try:
        track_obj, end = json.JSONDecoder().raw_decode(js_text, starts[0])
    except ValueError as exc:
        track_obj, end = None, starts[0]
        report("arquivo da Kart Park é JSON legível no JS servido", False, f"{type(exc).__name__}: {exc}")
    if isinstance(track_obj, dict):
        track_bytes = js_text[starts[0]:end].encode("utf-8")
        track_sha = hashlib.sha256(track_bytes + b"\n").hexdigest()
        report("arquivo da Kart Park é JSON legível no JS servido", True)
        report("SHA-256 do literal + LF igual ao registrado em tracks/registry.json (NFR-0006)", track_sha == KART_PARK_V1_SHA256,
               f"servido {track_sha[:16]}…, esperado {KART_PARK_V1_SHA256[:16]}…")
        report("literal da pista abaixo de 200 000 bytes (NFR-0001)", len(track_bytes) < TRACK_LITERAL_LIMIT, f"{len(track_bytes)} bytes")
        for key, expected in {"centerline": 684, "markers": 38, "curbs": 34, "sectorLimits": 3, "barriers": 1}.items():
            report(f"`{key}` com {expected} elementos", len(track_obj.get(key, [])) == expected, str(len(track_obj.get(key, []))))

for marker in ("Kart Park — São José dos Pinhais (traçado aproximado)", "displayLengthM:687", "Pista sintética",
               "© colaboradores do OpenStreetMap", "licença ODbL", "https://openstreetmap.org/copyright",
               "noopener noreferrer", "_blank", "selectedTrackId", "TRAINING", "curbWheelCount", "barrierContact",
               "barrierTouching", "lowpassHz:160"):
    report(f"texto `{marker}` no JS servido", marker in js_text)
report("`trackId:`kart-park`` no catálogo do JS servido", bool(re.search(r"trackId:[`'\"]kart-park[`'\"]", js_text)))
report("`vibrate(20)` no JS servido", bool(re.search(r"vibrate\(\s*20\s*\)", js_text)))
report("fonte `noise` do som da zebra no JS servido", bool(re.search(r"source:[`'\"]noise[`'\"]", js_text)))
for mesh in ("asphalt", "curbs", "barriers", "start-line"):
    report(f"malha `{mesh}` nomeada no JS servido", bool(re.search(rf"name=[`'\"]{re.escape(mesh)}[`'\"]", js_text)))
js_lower = js_text.lower()
for ghost in ("esri", "41.45", "41,45", "41450", "kartplan", "recorde", "circuito aurora"):
    report(f"texto `{ghost}` ausente do JS servido (sem distinção de caixa)", ghost not in js_lower)
for ghost in ("helmet", "boxGeo", "XMLHttpRequest", "sendBeacon"):
    report(f"símbolo `{ghost}` ausente do JS servido", ghost not in js_text)
for ident in ("kart01-decals", "=1.38,", "arcade-assistido-v5", "arcade-assistido-v4", "realista-aluguel-4t-v4", "Kartle · ", "synthetic"):
    report(f"release anterior: `{ident}` no JS servido", ident in js_text)

css_status, _, css_body = fetch_asset(css_refs[0]) if css_refs else (0, {}, b"")
css_text = css_body.decode("utf-8", errors="replace")
report("CSS servido responde 200", css_status == 200, str(css_status))
for cls in (".track-selector", ".track-credit"):
    report(f"classe `{cls}` no CSS servido", cls in css_text)
report("`esri` ausente do CSS servido", "esri" not in css_text.lower())
total = len(body) + len(js_body) + len(css_body)
report("JS servido abaixo do limite de 3 145 728 bytes", 0 < len(js_body) < LIMIT, f"{len(js_body)} bytes")
report("HTML + JS + CSS servidos abaixo do limite", 0 < total < LIMIT, f"{total} bytes")

print()
print(f"status={status} js={js_name or '-'} js_bytes={len(js_body)} css_bytes={len(css_body)} "
      f"cache_control={headers.get('Cache-Control', '-')!r} last_modified={headers.get('Last-Modified', '-')!r} "
      f"track_sha256={track_sha} checks={checks} failed={failed}")
sys.exit(0 if failed == 0 else 1)
