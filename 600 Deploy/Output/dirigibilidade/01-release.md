---
title: Release — dirigibilidade do Arcade assistido (acerto arcade-assistido-v5)
feature: dirigibilidade
stage: deploy
status: validated
version: 1.0.0
sources: [DM-0001, DES-0001, DES-0003, DES-0006, DES-0007, DES-0008, NFR-0002, NFR-0004, NFR-0007, NFR-0008, NFR-0009, TEST-0007, TEST-0008, TEST-0010]
---

# 01 — Release

Candidato a release da feature `dirigibilidade`: o preset `ARCADE_ASSISTIDO_V5` (`src/physics.ts`) como acerto padrão da
página (`PUBLISHED_SETUPS.ARCADE_ASSISTIDO`, `setupVersion` `arcade-assistido-v5`, anterior `arcade-assistido-v4` intacta
como `previousConfig`), `setupId`/`setupVersion` copiados para o resultado da volta e exibidos no resultado e no texto
compartilhado, o HUD de velocidade e aderência lido pelo contrato de telemetria, os registros publicados
(`src/setupRecords.ts`; benches `npm run bench:handling` e `npm run bench:physics`) e a linha de base legível por máquina em
`docs/physics.md`. O que se entrega é o mesmo tipo de artefato da release anterior (`race-lap-validation`): um **artefato
estático** (`dist/`, HTML + JS + CSS) servido pelo **GitHub Pages** com HTTPS (D23); **não há servidor, banco, serviço,
migração de dado nem aplicativo nativo** nesta release, e nada é gravado no navegador.

## O que é entregue

| Item | Conteúdo | Fonte |
|---|---|---|
| Canais | `web-desktop` e `web-mobile` — a mesma página, com teclado no computador e inclinação ou toque no celular | diretivas do estágio; `REL-0004` |
| Arquivos de origem desta feature | `src/physics.ts` (`ARCADE_ASSISTIDO_V5`, `PUBLISHED_SETUPS`, `getHandlingTelemetry`, `testPadLane`, `testPadArc`, `classifyHandlingSteps`), `src/setupRecords.ts` (novo), `src/handlingMessages.ts` (novo), `src/lap.ts` (campos opcionais `setupId`/`setupVersion`, FB-01 de `race-lap-validation`), `src/main.ts` (acerto publicado, `#lap-result-setup`, `#lap-share`, HUD), `index.html` (`#lap-result-setup`, `#lap-share`), `scripts/handlingBench.ts` (novo), `scripts/keyboard-lap.ts`, `scripts/physics-bench.ts`, `docs/physics.md` (seção datada e bloco `handling-baseline`) | `400 Code/Output/dirigibilidade/01-implementation.md` 2.1.0 |
| Inalterados por esta feature | `src/track.ts`, `src/trackData.ts`, `src/lapTiming.ts`, `src/frameClock.ts`, `src/lapMessages.ts`, `src/maneuvers.ts`, `src/audio.ts`, `src/style.css`, `package.json`, `package-lock.json`, `tsconfig.json`, `.github/workflows/pages.yml`, `.nvmrc`; dependências: **nenhuma acrescentada** | idem; NFR-0005, NFR-0008 |
| Formato publicado que muda | o **acerto** passa a ser dado publicado com versão: `setupId` `ARCADE_ASSISTIDO` → `arcade-assistido-v5` (anterior `arcade-assistido-v4`) e `REALISTA_ALUGUEL_4T` → `realista-aluguel-4t-v4` (inalterado, NFR-0007); `ReplayRecord` versão 1 (`replayFormatVersion`, ausente lê-se como 1); ambos viajam dentro do bundle | DM-0001; `REL-0002` |
| Formato persistido que muda | **nenhum**: a feature não grava nada no navegador (0 `localStorage`/`sessionStorage`/`indexedDB` na aplicação, `CHK-TEST-0010-*`; `check_bundle.py` confirma 0 ocorrências textuais no `dist/`) | DM-0001 seção 1; DES-0008 |
| Feature flag | **nenhuma**, por decisão do projeto validado: "a escolha do acerto já existe (`#handling-preset`) e passa a apontar para o dado publicado; não há chave para a versão anterior" (DES-0007, *Feature flag*; ADR-0001). A reversão desta release é a republicação do artefato anterior (`runbook.md`) | DES-0007, ADR-0001 |
| Variáveis de ambiente | nenhuma lida pelo cliente; nenhuma no workflow | `REL-0001` |
| O que o jogador vê de novo | o acerto padrão responde como o v5 (resposta do volante, curva de referência, traseira controlável, aceleração e velocidade de RULE-0002); o resultado da volta mostra `arcade-assistido-v5` em `#lap-result-setup`; o botão "compartilhar" produz `Kartle · synthetic v2 · <tempo> · arcade-assistido-v5`; o melhor tempo mostra `—` ao trocar de acerto (nunca compara versões diferentes) | DES-0006, SCR-0002, RULE-0003 |

## Proveniência — o commit que a release nomeia

| Fato | Estado em 2026-10-27 |
|---|---|
| Veredito de testes | `SUCCESS` — `500 Tests/Output/dirigibilidade/reports/test-validation/test-validation-20261027-1902.md` (237 verificações coletadas, 237 aprovadas, 0 reprovadas, 0 puladas: 65 `CHK-TEST-00nn-nn` desta feature + 172 de `physics`, `maneuvers` e `race-lap-validation-*`; execução de 2026-10-27 15:57:03−03:00, posterior à última edição de `src/`, `scripts/`, `docs/physics.md` e `tests/`; `fresh: true`) |
| Commit verificado | **`b86b200d14f950baa1a902f56b6f6fbfff5082ba`** (curto `b86b200`), ramo `master`, mensagem "dirigibilidade: testes validados (65 checks, suíte 237/237)" — a ponta de `master` neste momento (lida em `.git/refs/heads/master`; nenhum comando `git` executado por esta rodada). Os commits imediatamente anteriores, `25063ff` (código validado, rodada 4), `03e137a` (req, F-Spec e D-Spec revalidados), `4ea95d3` (`race-lap-validation` revalidada após o drift de `src/lap.ts`), são os da cadeia desta feature; a árvore de `src/`, `scripts/`, `tests/`, `index.html`, `docs/physics.md` e do lockfile que o veredito verificou é a de `b86b200` |
| Build local da mesma árvore | `dist/` de 2026-10-27 13:27 (posterior à última edição de `src/`, 12:55, e anterior a qualquer edição de outra feature): `assets/index-BiFxJ0FY.js` 579 462 bytes, `assets/index-dgojskay.css` 11 407, `index.html` 7 159; total **598 028 bytes** (154 400 gzip), `within_limit=True` (`measure_dist.py`, tabela abaixo); `check_bundle.py dist docs/physics.md`: 20 verificações, 0 reprovadas |
| Staging | **publicado**: `https://edumatosr6-svg.github.io/kartle-staging/` responde **200 em HTTPS** (`Last-Modified: Tue, 27 Oct 2026 19:11:49 GMT`, `Cache-Control: max-age=600`) e serve `index.html` (7 189 bytes, base `/kartle-staging/`) que referencia **`assets/index-BiFxJ0FY.js`** (579 462 bytes servidos — o mesmo `<hash>` e o mesmo tamanho do build local da árvore de `b86b200`) e `assets/index-dgojskay.css`; `check_served.py`: 18 verificações, 0 reprovadas (três identificadores de acerto e o prefixo do texto compartilhado presentes no JS servido; elementos `#speed`, `#handling`, `#lap-result-setup`, `#lap-share`, `#handling-preset` com `arcade` selecionado e `#preset-label` presentes). A execução do workflow `pages` em `edumatosr6-svg/kartle-staging` que o publicou é a do push de `b86b200` ao ramo `staging` de hoje (`build` e `deploy` concluídos, segundo o condutor do loop); **o número da execução é lido na aba Actions** e entra no relatório de validação, não neste registro (regra herdada de `race-lap-validation`: os números em vigor são os da aba Actions) |
| Produção | o site Pages de `edumatosr6-svg/kartle`, `https://edumatosr6-svg.github.io/kartle/`, com o ambiente `github-pages` protegido por **revisor obrigatório** (`edumatosr6-svg`); o clique de aprovação é a promoção (D-DP-06). **Nada foi promovido**: a release anterior (`race-lap-validation`, árvore `c41c6c3`) ficou com o `deploy` de produção em *Waiting* e nunca foi aprovada (`600 Deploy/Output/race-lap-validation/01-release.md`), de modo que produção **ainda não serviu nenhum `dist/`**. Esta release, se promovida, será a primeira a ser servida em produção — e leva consigo a de `race-lap-validation`, cuja árvore está contida em `b86b200` |
| Tag de release | não existe; a release é identificada pelo hash acima e pela execução do workflow que a publicar |
| Sistema de CI | **GitHub Actions**, `.github/workflows/pages.yml` (inalterado por esta feature): `npm ci` → `npm test` (**237** aprovados) → `npm run build -- --base=/<repo>/` → `measure_dist.py` (RNF02) → `upload-pages-artifact` → `deploy-pages`; etapas em `REL-0003` |
| Release anterior e alvo de reversão | `race-lap-validation`: árvore `c41c6c3`; em staging, a última execução verde anterior a esta é a **39631099098** (commit `2bee672`, `assets/index-Cqfgl3da.js`) — alvo do caminho B de `runbook.md` em staging; em produção não há execução verde anterior (caminho A, ou aprovação de uma execução da árvore anterior se ainda estiver à espera — `runbook.md`) |

### Precondições humanas que restam, em ordem

1. **Criar e preencher `docs/handling-device-log.md`** com a execução humana do roteiro de aparelho (E2E-01 a E2E-03 de
   `300 Specs/330 D-Specs/Output/dirigibilidade/test-strategy.md`) sobre a URL de staging, no notebook e no celular de
   referência: as **cinco linhas humanas** H1–H5 do `runbook.md` (HUD por quadro, resultado e compartilhar no aparelho,
   inclinação no celular, taxa de quadros, custo por passo). O arquivo **ainda não existe** (a estratégia o atribui à
   etapa de código, no molde de `docs/lap-validation-device-log.md`; este estágio não o cria — cerca de escrita, §14);
   5 critérios do veredito de testes (AC-US-0004-06, AC-US-0005-05, NFR-0002, NFR-0003, NFR-0004) têm a metade de tela,
   aparelho ou relógio de parede `unverified` até esse registro (`500 Tests/Output/dirigibilidade/98-divergences.md`).
   É a mesma forma da "execução 3" que `race-lap-validation` espera em `docs/lap-validation-device-log.md`, e a rodada
   de teste do dono do produto que o domínio exige antes de fechar a feature (o oitavo ponto do
   `200 Requirements/220 Input/dirigibilidade/DOMAIN.md`, "mantido como critério final") cabe na mesma sessão.
2. **Validação de staging pelo validador** (`reports/deploy-validation/`), que confirma o número da execução de staging e
   o `<hash>` servido.
3. **A pergunta de promoção** (D-DP-06): só depois de 1 e 2.

Cumpridas: o commit da árvore verificada (`b86b200`); o veredito de testes `SUCCESS`; o build reproduzido pelo pipeline em
staging e servido em HTTPS com o mesmo `<hash>` do build local; a reversão R1/R2 ensaiada no mesmo site de staging em
2026-10-21 (`race-lap-validation`, *Ensaio de reversão R4* em `docs/lap-validation-device-log.md`), cujo procedimento esta
release reutiliza sem alteração; o Node fixado (`.nvmrc` = `24`); os dois repositórios configurados (D23); a decisão de
monitoramento (vigilância manual, nenhum monitor externo — `200 Requirements/220 Input/race-lap-validation/DOMAIN.md`,
2026-10-21), que esta release mantém.

## Reprodução do build

O workflow executa estes passos a cada push; à mão, da raiz do repositório, com caminhos entre aspas:

| Passo | Comando | Resultado esperado |
|---|---|---|
| 1 | `npm ci` | saída 0; `package-lock.json` inalterado |
| 2 | `npm test` | saída 0; **237** aprovados, 0 reprovados, 0 pulados |
| 3 | `npm run build` (no workflow, `-- --base=/kartle/` ou `/kartle-staging/`) | saída 0 (`tsc --noEmit` e depois `vite build`); `dist/index.html`, `dist/assets/index-<hash>.js`, `dist/assets/index-<hash>.css` |
| 4 | `python -I "600 Deploy/Output/race-lap-validation/tools/measure_dist.py" dist` | tabela de tamanhos; `within_limit=True`; saída 0 (ferramenta da release anterior, reutilizada por referência — é a que o workflow chama) |
| 5 | `python -I "600 Deploy/Output/dirigibilidade/tools/check_bundle.py" dist docs/physics.md` | `checks=20 failed=0`: três identificadores de acerto no JS, elementos do HUD e do resultado no HTML, `arcade` selecionado, bloco `handling-baseline` com três entradas e `measuredAtUtc` da v5 |
| 6 | `npm run bench:handling` (opcional; só na máquina de referência conta para NFR-0002) | saída 0; 46 registros `PASS` (15/15 ensaios nos dois modos); `STEP_COST` ≤ 1,10 × linha de base |
| 7 | `npm run preview` | `http://127.0.0.1:4173` serve o bundle; `#preset-label` mostra `ARCADE ASSISTIDO · TREINO LIVRE`; uma volta termina com `#lap-result-setup` = `arcade-assistido-v5` |

### Medida real do artefato (build local de 2026-10-27, árvore de `b86b200`, base `/`)

| Arquivo | bytes | gzip bytes |
|---|---:|---:|
| `assets/index-BiFxJ0FY.js` | 579 462 | 148 294 |
| `assets/index-dgojskay.css` | 11 407 | 3 244 |
| `index.html` | 7 159 | 2 862 |
| **total** | **598 028** | **154 400** |

- Limite de RNF02 (download inicial abaixo de 3 145 728 bytes): **598 028 bytes brutos (19,0 % do limite)**; 154 400
  comprimidos. Contra a release anterior (593 256 bytes): **+4 772 bytes** (0,8 %), o custo dos registros publicados, do
  texto compartilhado e dos campos de acerto.
- O JS servido em staging tem exatamente 579 462 bytes, o mesmo do build local: o pipeline reproduziu a árvore.
- O Vite avisa que o chunk principal passa de 500 kB minificado (Three.js); aviso de ferramenta, não violação de limiar.
- Os nomes dos *assets* carregam hash de conteúdo: o `index.html` publicado é o que aponta para a versão em vigor
  (`REL-0003`, regra de cache). O CSS não mudou (`dgojskay`, o mesmo da release anterior).

## O que o pipeline faz (`.github/workflows/pages.yml`)

Inalterado por esta feature. Em ordem, com saída observável na execução do Actions: checkout do commit → Node da `.nvmrc`
(24) com cache do npm → `npm ci` → `npm test` (237 aprovados) → `npm run build -- --base=/kartle/` (ou
`/kartle-staging/`) → `measure_dist.py dist` (saída 0) → `configure-pages` → `upload-pages-artifact` de `dist/` →
trabalho `deploy` no ambiente `github-pages`. Em produção o `deploy` **espera a aprovação do revisor obrigatório**
(D-DP-06); em staging publica de imediato, desde que a política de ramos do ambiente admita o ramo `staging` (liberada em
2026-10-21; volta a ser restrita a cada despublicação — `REL-0003`). Permissões mínimas, nenhum segredo (I6). O passo
*Measure dist* continua a chamar a ferramenta da release anterior por caminho; a ferramenta desta release
(`tools/check_bundle.py`, `tools/check_served.py`) é executada por quem valida e pelo runbook, não pelo workflow —
acrescentá-la ao workflow é mudança de `.github/`, fora da cerca de escrita deste estágio, e fica como item do
`98-divergences.md`.

## Limitações conhecidas — divergências aceitas e herdadas

- As divergências aceitas pelo dono do produto em 2026-10-21 para a release anterior continuam válidas, porque o
  `index.html` e o `src/style.css` não mudaram nesses pontos: o `href="/"` da marca sai de `/kartle/` no GitHub Pages e a
  página faz uma requisição a `fonts.googleapis.com` no carregamento (não durante a volta). Ambas `waived` em
  `600 Deploy/Output/race-lap-validation/98-divergences.md` (DIV-DP-12, DIV-DP-14), com a correção no
  `SCOPE-BACKLOG.md` daquela feature; recitadas em `98-divergences.md` desta.
- O crédito OpenStreetMap e o aviso ODbL continuam não exigidos (pista sintética, 0 dado OSM; D-DP-04 ratificado em
  2026-10-21). Esta feature não acrescenta dado de pista.
- O `setupVersion` só aparece na tela **depois** de uma volta (`#lap-result-setup`, SCR-0002); ao carregar, o que a
  página mostra é o rótulo `ARCADE ASSISTIDO · TREINO LIVRE` e a opção `arcade` selecionada — é isso que o projeto
  prescreve, e é o que a linha D4 do `smoke.md` observa.
