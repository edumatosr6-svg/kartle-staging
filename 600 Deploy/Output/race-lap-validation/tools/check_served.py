"""Conferência limitada da página servida (staging ou produção) para a release `race-lap-validation` (seed rev 3).

Uso (só leitura; três GET em HTTPS, nenhum outro efeito):
    python -I "600 Deploy/Output/race-lap-validation/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/
    python -I "600 Deploy/Output/race-lap-validation/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/ index-BwruE9Pq.js

Imprime uma linha por verificação (`ok`/`FAIL`) e um resumo
`status=... js=index-<hash>.js js_bytes=... css_bytes=... cache_control=... last_modified=... checks=... failed=...`
(molde de `600 Deploy/Output/modelo-kart-01/tools/check_served.py`):
  1. a URL responde 200 em HTTPS (`http://` é recusado antes de qualquer pedido);
  2. o `index.html` servido referencia exatamente um `assets/index-<hash>.js` e um `.css` sob a base da URL;
  3. (opcional, segundo argumento) o `<hash>` do JS é o esperado — o impresso no passo *Build* da execução;
  4. os elementos da volta e do treino de voltas seguidas no HTML servido: `#track-status`, `#lap-offer`,
     `#lap-countdown`, `#lap-state`, `#lap-paused`, `#lap-sectors`, `#lap-best-valid`, `#lap-result`, `#pause`;
     o painel `#lap-training-result` com `role="status"` e `aria-live="polite"`; o botão `#lap-end-training` com o
     texto `encerrar treino`, oculto fora do treino (`class="hidden"`);
  5. o JS servido responde 200 e carrega a tabela de mensagens com as **24 chaves** de `src/lapMessages.ts`, cada
     uma com o texto pt e o en exatos (a minificação preserva nomes de propriedade e literais);
  6. o JS servido carrega os códigos do treino que a minificação preserva: `TRAINING`, `PAUSE_BUTTON`,
     `NOT_TRAINING`, `LAP_ENDED`, `ALREADY_PAUSED` e os campos `lapSequenceCount`, `trainingLapMs`, `bestValidLapMs`;
  7. o CSS servido responde 200;
  8. tamanho do JS servido e da soma JS + CSS + HTML contra o limite de 3 145 728 bytes (RNF02).
Não substitui o `smoke.md` nem o roteiro da execução 3 do `runbook.md`: não executa a página, não mede ritmo, não
pilota voltas. Sai com 0 sem reprovação, 1 com.
"""
import re
import sys
import urllib.request

url = sys.argv[1]
expected_js = sys.argv[2] if len(sys.argv) > 2 else None
LIMIT = 3 * 1024 * 1024
failed = 0
checks = 0

# As 24 chaves de `src/lapMessages.ts` (seed rev 3; DES-0008 1.1.0), na ordem do arquivo: (chave, pt, en).
MESSAGES = [
    ("lapStateValidInProgress", "válida em andamento", "valid, in progress"),
    ("lapStateInvalid", "inválida", "invalid"),
    ("reasonMissedMarker", "marcador pulado", "missed marker"),
    ("reasonCut", "corte", "cut"),
    ("reasonReposition", "reposicionamento", "repositioning"),
    ("lapUnofficial", "não oficial", "unofficial"),
    ("countdownGreenSignal", "VERDE", "GREEN"),
    ("lapResultValid", "válida", "valid"),
    ("lapPaused", "volta pausada", "lap paused"),
    ("pauseAction", "pausar", "pause"),
    ("endTrainingAction", "encerrar treino", "end training"),
    ("bestValidLap", "melhor volta válida", "best valid lap"),
    ("sectorNoTime", "—", "—"),
    ("loadingTrack", "carregando a pista", "loading track"),
    ("noTrackAvailable", "nenhuma pista disponível", "no track available"),
    ("trackDataError", "dado da pista indisponível", "track data unavailable"),
    ("controlFallbackTouch", "controle por toque (sensor de inclinação indisponível)", "touch control (tilt sensor unavailable)"),
    ("sectorLabel", "setor", "sector"),
    ("totalLabel", "tempo total", "total time"),
    ("startTraining", "treino", "training"),
    ("startOfficial", "volta oficial", "official lap"),
    ("startRecon", "volta de reconhecimento", "recon lap"),
    ("resumeLap", "continuar", "resume"),
    ("newLap", "nova volta", "new lap"),
]


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


if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
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

for el in ("track-status", "lap-offer", "lap-countdown", "lap-state", "lap-paused", "lap-sectors", "lap-best-valid",
           "lap-result", "pause"):
    report(f"elemento `#{el}` no HTML servido", f'id="{el}"' in html)
panel = re.search(r'<div id="lap-training-result"([^>]*)>', html)
report("painel `#lap-training-result` com role=status e aria-live=polite",
       bool(panel) and 'role="status"' in panel.group(1) and 'aria-live="polite"' in panel.group(1))
end_btn = re.search(r'<button id="lap-end-training"([^>]*)>([^<]*)<', html)
report("botão `#lap-end-training` com o texto `encerrar treino`", bool(end_btn) and end_btn.group(2).strip() == "encerrar treino",
       end_btn.group(2).strip() if end_btn else "ausente")
report("botão `#lap-end-training` oculto fora do treino", bool(end_btn) and 'class="hidden"' in end_btn.group(1))


def fetch_asset(ref: str):
    global failed
    try:
        return get(url + ref)
    except Exception as exc:  # noqa: BLE001
        print(f"FAIL: GET {url + ref} - {type(exc).__name__}: {exc}")
        failed += 1
        return 0, {}, b""


js_status, _, js_body = fetch_asset(js_refs[0]) if js_refs else (0, {}, b"")
js_text = js_body.decode("utf-8", errors="replace")
report("JS servido responde 200", js_status == 200, str(js_status))
Q = r'[`"\']'
for key, pt, en in MESSAGES:
    pattern = rf'{key}:\{{pt:{Q}{re.escape(pt)}{Q},en:{Q}{re.escape(en)}{Q}\}}'
    report(f"mensagem `{key}` pt/en no JS servido", bool(re.search(pattern, js_text)))
for code in ("TRAINING", "PAUSE_BUTTON", "NOT_TRAINING", "LAP_ENDED", "ALREADY_PAUSED"):
    report(f"código `{code}` no JS servido", bool(re.search(rf'{Q}{code}{Q}', js_text)))
for field in ("lapSequenceCount", "trainingLapMs", "bestValidLapMs"):
    report(f"campo `{field}` no JS servido", field in js_text)

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
