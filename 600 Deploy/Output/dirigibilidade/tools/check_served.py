"""Conferência limitada da página servida (staging ou produção) para a release `dirigibilidade` (acerto `arcade-assistido-v6`).

Uso (só leitura; dois GET em HTTPS, nenhum outro efeito):
    python -I "600 Deploy/Output/dirigibilidade/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/
    python -I "600 Deploy/Output/dirigibilidade/tools/check_served.py" https://edumatosr6-svg.github.io/kartle-staging/ index-BwruE9Pq.js

Imprime uma linha por verificação (`ok`/`FAIL`) e um resumo
`status=... js=index-<hash>.js js_bytes=... cache_control=... last_modified=... checks=... failed=...`:
  1. a URL responde 200 em HTTPS (a URL tem de começar por `https://`; `http://` é recusado antes de qualquer pedido);
  2. o `index.html` servido referencia exatamente um `assets/index-<hash>.js` e um `.css` sob a base da URL;
  3. (opcional, segundo argumento) o `<hash>` do JS é o esperado — o impresso no passo *Build* da execução aprovada;
  4. os elementos `#speed`, `#handling`, `#lap-share`, `#handling-preset` (opção `arcade` selecionada) e `#preset-label`
     estão no HTML servido, e `#lap-result-setup` **não** está (a versão do acerto saiu da tela, DES-0006);
  5. o HTML servido não contém drift nem turbo (DES-0009, AC-US-0003-12..15): nenhum casamento de
     `drift|turbo|impulso|combo|Espaço` (sem distinguir maiúsculas), nenhum `maneuver-guide`, a dica da barra é
     exatamente `Dirigir`, e o controle de toque é um único `.touch-controls` com exatamente `left`, `right`, `brake`,
     `throttle` (sem botão "Drift");
  6. o JS servido responde 200, declara `arcade-assistido-v6` como versão corrente com `arcade-assistido-v4` como a
     anterior publicada, carrega `realista-aluguel-4t-v4` e o prefixo do texto compartilhado `Kartle · `, e não carrega
     `arcade-assistido-v5` (rodada de staging substituída: fica só como registro em `docs/physics.md`);
  7. tamanho do JS servido contra o limite de RNF02 (3 145 728 bytes) — o `index.html` e o CSS somam poucos KB.
O JS lê ainda o campo `drift` de `Input` (contrato de passo, I8; o comando não tem efeito, `DRIFT_INERT`): por isso o
padrão de drift é verificado só no HTML. Não substitui o `smoke.md`: não executa a página, não mede ritmo nem lê o
console. Sai com 0 sem reprovação, 1 com.
"""
import re
import sys
import urllib.request

url = sys.argv[1]
expected_js = sys.argv[2] if len(sys.argv) > 2 else None
LIMIT = 3 * 1024 * 1024
DRIFT_PATTERN = re.compile(r"drift|turbo|impulso|combo|Espaço", re.IGNORECASE)
CURRENT = re.compile(r"setupVersion:\s*[`'\"]arcade-assistido-v6[`'\"]\s*,\s*previousSetupVersion:\s*[`'\"]arcade-assistido-v4[`'\"]")
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

for el in ("speed", "handling", "lap-share", "handling-preset", "preset-label"):
    report(f"elemento `#{el}` no HTML servido", f'id="{el}"' in html)
report("opção `arcade` selecionada por padrão", '<option value="arcade" selected>' in html)
report("`#lap-result-setup` ausente (versão do acerto fora da tela)", 'id="lap-result-setup"' not in html)

hits = sorted(set(m.group(0).lower() for m in DRIFT_PATTERN.finditer(html)))
report("HTML sem drift, turbo, impulso, combo nem Espaço", not hits, ", ".join(hits))
report("HTML sem guia de manobras (`maneuver-guide`)", "maneuver-guide" not in html)
hint = re.findall(r'<span class="control-hint">([^<]*)</span>', html)
report("dica da barra é exatamente `Dirigir`", hint == ["Dirigir"], " | ".join(hint) or "nenhuma")
pads = html.count('class="touch-controls"')
controls = re.findall(r'data-control="([^"]*)"', html)
report("controle de toque: um `.touch-controls` com left, right, brake, throttle",
       pads == 1 and sorted(controls) == ["brake", "left", "right", "throttle"], f"{pads} pad(s): {', '.join(controls) or 'nenhum'}")

js_status, js_body = 0, b""
if js_refs:
    try:
        js_status, _js_headers, js_body = get(url + js_refs[0])
    except Exception as exc:  # noqa: BLE001
        print(f"FAIL: GET {url + js_refs[0]} - {type(exc).__name__}: {exc}")
        failed += 1
js_text = js_body.decode("utf-8", errors="replace")
report("JS servido responde 200", js_status == 200, str(js_status))
report("JS declara `arcade-assistido-v6` corrente e `arcade-assistido-v4` anterior", CURRENT.search(js_text) is not None)
report("identificador `realista-aluguel-4t-v4` no JS servido", "realista-aluguel-4t-v4" in js_text)
report("`arcade-assistido-v5` ausente do JS servido", "arcade-assistido-v5" not in js_text, f"{js_text.count('arcade-assistido-v5')} ocorrência(s)")
report("prefixo `Kartle · ` no JS servido", "Kartle · " in js_text)
report("JS servido abaixo do limite de RNF02", 0 < len(js_body) < LIMIT, f"{len(js_body)} bytes de {LIMIT}")

print()
print(f"status={status} js={js_name or '-'} js_bytes={len(js_body)} cache_control={headers.get('Cache-Control', '-')!r} "
      f"last_modified={headers.get('Last-Modified', '-')!r} checks={checks} failed={failed}")
sys.exit(0 if failed == 0 else 1)
