"""Conferência limitada da página servida (staging ou produção) para a release `modelo-kart-01`.

Uso (só leitura; três GET em HTTPS, nenhum outro efeito):
    python -I "600 Deploy/Output/modelo-kart-01/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/
    python -I "600 Deploy/Output/modelo-kart-01/tools/check_served.py" https://edumatosr6-svg.github.io/kartle/ index-D0RarhFV.js

Imprime uma linha por verificação (`ok`/`FAIL`) e um resumo
`status=... js=index-<hash>.js js_bytes=... css_bytes=... cache_control=... last_modified=... checks=... failed=...`
(copiado e adaptado de `600 Deploy/Output/dirigibilidade/tools/check_served.py`):
  1. a URL responde 200 em HTTPS (a URL tem de começar por `https://`; `http://` é recusado antes de qualquer pedido);
  2. o `index.html` servido referencia exatamente um `assets/index-<hash>.js` e um `.css` sob a base da URL;
  3. (opcional, segundo argumento) o `<hash>` do JS é o esperado — o impresso no passo *Build* da execução aprovada;
  4. os elementos `#scene`, `#lap-countdown`, `#lap-result`, `#lap-result-setup`, `#speed`, `#handling`, `#tilt`,
     `#preset-label` e `#handling-preset` (opção `arcade` selecionada) estão no HTML servido (inalterado por esta feature);
  5. o JS servido responde 200 e carrega os marcadores do Kart 01 que a minificação preserva (`kart01-decals`,
     `paraChoqueTraseiro`, `placaTraseira`, `bumperPlate`, `exhaustOutlet`, o `fillText` do número `01`, os três modos
     de câmera e as constantes `=1.38,`, `=3.05,`, `=62,`), nenhum símbolo do kart provisório (`helmet`, `boxGeo`) e os
     identificadores das releases anteriores (`arcade-assistido-v5`, `arcade-assistido-v4`, `realista-aluguel-4t-v4`,
     `Kartle · `);
  6. o CSS servido responde 200;
  7. tamanho do JS servido e da soma JS + CSS + HTML contra o limite de 3 145 728 bytes (NFR-0002, RNF02).
Não substitui o `smoke.md`: não executa a página, não mede ritmo nem lê o console. Sai com 0 sem reprovação, 1 com.
"""
import re
import sys
import urllib.request

url = sys.argv[1]
expected_js = sys.argv[2] if len(sys.argv) > 2 else None
LIMIT = 3 * 1024 * 1024
failed = 0
checks = 0


def report(name: str, ok: bool, detail: str = "") -> None:
    global failed, checks
    checks += 1
    if not ok:
        failed += 1
    print(f"{'ok' if ok else 'FAIL'}: {name}{(' - ' + detail) if detail else ''}")


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

for el in ("scene", "lap-countdown", "lap-result", "lap-result-setup", "speed", "handling", "tilt", "preset-label", "handling-preset"):
    report(f"elemento `#{el}` no HTML servido", f'id="{el}"' in html)
report("opção `arcade` selecionada por padrão", '<option value="arcade" selected>' in html)


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
for marker in ("kart01-decals", "paraChoqueTraseiro", "placaTraseira", "bumperPlate", "exhaustOutlet",
               "TRACK_OVERVIEW", "COUNTDOWN_DESCENT", "RACE_CHASE"):
    report(f"marcador `{marker}` no JS servido", marker in js_text)
report("`fillText` do número `01` no JS servido", bool(re.search(r"fillText\(\s*[`'\"]01[`'\"]", js_text)))
for const in ("1.38", "3.05", "62"):
    report(f"constante de câmera `={const},` no JS servido", f"={const}," in js_text)
for ghost in ("helmet", "boxGeo"):
    report(f"símbolo do kart provisório `{ghost}` ausente do JS servido", ghost not in js_text)
for ident in ("arcade-assistido-v5", "arcade-assistido-v4", "realista-aluguel-4t-v4", "Kartle · "):
    report(f"release anterior: `{ident}` no JS servido", ident in js_text)

css_status, _, css_body = fetch_asset(css_refs[0]) if css_refs else (0, {}, b"")
report("CSS servido responde 200", css_status == 200, str(css_status))
total = len(body) + len(js_body) + len(css_body)
report("JS servido abaixo do limite de 3 145 728 bytes", 0 < len(js_body) < LIMIT, f"{len(js_body)} bytes")
report("HTML + JS + CSS servidos abaixo do limite", 0 < total < LIMIT, f"{total} bytes")

print()
print(f"status={status} js={js_name or '-'} js_bytes={len(js_body)} css_bytes={len(css_body)} "
      f"cache_control={headers.get('Cache-Control', '-')!r} last_modified={headers.get('Last-Modified', '-')!r} "
      f"checks={checks} failed={failed}")
sys.exit(0 if failed == 0 else 1)
