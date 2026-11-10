---
id: FEAT-0005
title: Requisitos transversais — peso, rede, determinismo, taxa de quadros, zebra e licença
feature: apresentacao-e-som
stage: fspec
status: validated
version: 1.0.0
sources: [NFR-0001, NFR-0002, NFR-0003, NFR-0004, NFR-0005, NFR-0006, NFR-0007, NFR-0008, NFR-0009, NFR-0010]
---

# FEAT-0005 — Requisitos transversais

## Resumo

O que a capa, o ícone, o som do motor e o som de pneu têm de respeitar em conjunto: cabem no download
inicial e num teto de peso, não pedem rede depois de o jogo abrir, não mudam a simulação nem o tempo, não
derrubam a taxa de quadros, não trazem dependência nova, não tocam no som da zebra, não trazem marca de
terceiros e só vão para produção depois de a licença estar confirmada.

## Canais

- `web-desktop` e `web-mobile`: os mesmos limites, salvo a taxa de quadros (60 fps no notebook de
  referência de RNF03; 30 fps no celular intermediário de referência de RNF03). Uma execução em desktop não
  vale como evidência para celular (I9). Em `web-mobile`, com sensor ausente ou permissão negada, o
  controle recai para toque com estado visível (I4) e os limites não mudam.
- Link compartilhado: alcançado pela inspeção das imagens (requisito 13) e pela licença (requisito 16).
- Verificação sem canal de jogo: saída de `npm test` e medida do build
  ([API-0003](../api/API-0003-registros-de-verificacao.md)).

## Requisitos

- REQ-FEAT-0005-01: O sistema SHALL manter o download inicial do jogo, com a capa, o ícone, o som do motor
  e o som de pneu incluídos, menor que 3 MB comprimidos, medido como a soma em bytes comprimidos de tudo o
  que o navegador baixa para o jogo abrir, no build que entrega a feature (NFR-0001).
- REQ-FEAT-0005-02: O sistema SHALL manter a soma dos bytes da capa, do ícone, do som do motor e do som de
  pneu, cada um na forma entregue ao navegador, em no máximo 300.000 bytes (NFR-0002).
- REQ-FEAT-0005-03: O sistema SHALL NOT fazer requisição de rede para buscar som ou imagem desta feature
  depois de o jogo abrir, até o fim de uma volta completa com o som ligado e ao menos um deslize, em cada
  canal (NFR-0003).
- REQ-FEAT-0005-04: O sistema SHALL entregar os 4 arquivos desta feature — capa, ícone, som do motor e som
  de pneu — dentro do download inicial (NFR-0003).
- REQ-FEAT-0005-05: O sistema SHALL, com a rede do aparelho desligada depois de o jogo abrir, tocar o som
  do motor e o som de pneu como com a rede ligada, numa volta completa com o som ligado e ao menos um
  deslize, em cada canal (NFR-0003).
- REQ-FEAT-0005-06: O sistema SHALL dar, para a mesma sequência de entradas a partir do mesmo estado
  inicial, o mesmo tempo total da volta com o som ligado e com o som desligado, com diferença de 0 ms
  (NFR-0004).
- REQ-FEAT-0005-07: O sistema SHALL dar, para a mesma sequência de entradas a partir do mesmo estado
  inicial, os mesmos tempos de setor com o som ligado e com o som desligado, com diferença de 0 ms em cada
  setor (NFR-0004).
- REQ-FEAT-0005-08: O sistema SHALL sustentar, em `web-desktop`, no notebook de referência de RNF03,
  60 fps durante uma volta completa com o som ligado, o som do motor tocando e ao menos um deslize com som
  de pneu, provado por teste registrado no aparelho nomeado (NFR-0005; I9).
- REQ-FEAT-0005-09: O sistema SHALL sustentar, em `web-mobile`, no celular intermediário de referência de
  RNF03, 30 fps durante uma volta completa com o som ligado, o som do motor tocando e ao menos um deslize
  com som de pneu, provado por teste registrado no aparelho nomeado, sem usar execução em desktop como
  evidência (NFR-0005; I9).
- REQ-FEAT-0005-10: O sistema SHALL NOT acrescentar dependência de execução ao jogo: a lista de
  dependências de execução declarada pelo projeto é a mesma antes e depois da feature (NFR-0006).
- REQ-FEAT-0005-11: O sistema SHALL continuar satisfazendo, com esta feature entregue, os critérios 09 a 12
  de US-0005 de `pista-kart-park` para o som da zebra, nos ensaios daquela feature em `npm test`
  (NFR-0007).
- REQ-FEAT-0005-12: O sistema SHALL NOT entregar ao navegador arquivo de som da zebra: o som da zebra
  continua sintetizado (NFR-0007).
- REQ-FEAT-0005-13: O sistema SHALL NOT entregar capa ou ícone com marca, logotipo ou texto de terceiros,
  conferido por inspeção visual das 2 imagens na forma entregue, registrada com a data e o nome de quem
  inspecionou (NFR-0008).
- REQ-FEAT-0005-14: O sistema SHALL dar, para a mesma sequência de entradas, o mesmo tempo total da volta e
  os mesmos tempos de setor com os sons e as imagens desta feature indisponíveis e com eles disponíveis,
  com diferença de 0 ms no total e em cada setor (NFR-0009).
- REQ-FEAT-0005-15: O sistema SHALL NOT acrescentar, retirar nem alterar campo do estado da simulação: o
  estado depois da mesma sequência de entradas, avançada por `STEP`, é idêntico campo a campo antes e
  depois da feature (NFR-0009).
- REQ-FEAT-0005-16: O sistema SHALL NOT ser promovido para produção com algum dos 4 arquivos gerados por IA
  — capa, ícone, som do motor, som de pneu — antes de a confirmação da licença pelo dono do produto estar
  registrada em `DOMAIN.md`; a entrega em staging não depende dessa confirmação (NFR-0010).

## Comportamento

Regras: [RULE-0003](../rules/RULE-0003-arquivos-da-feature-peso-e-licenca.md) (arquivos, peso, entrega e
licença); [RULE-0001](../rules/RULE-0001-estado-do-som-e-som-do-motor.md) e
[RULE-0002](../rules/RULE-0002-som-de-pneu.md) (a apresentação só lê). Fluxos:
[FLOW-0001](../flows/FLOW-0001-abertura-da-pagina-e-entrega-dos-arquivos.md) e
[FLOW-0003](../flows/FLOW-0003-verificacao-da-feature.md). Registros:
[API-0003](../api/API-0003-registros-de-verificacao.md).

| Situação | Comportamento |
|---|---|
| Download inicial de 3 MB ou mais | O requisito 01 não é atendido; reduz-se o peso dos arquivos, nunca o limite |
| Soma dos 4 arquivos acima de 300.000 bytes | `ASSET_BUDGET` dá `FAIL` com `BUDGET_EXCEEDED`; a forma entregue é reduzida (redimensionar, converter, comprimir), nunca o limite |
| Algum dos 4 arquivos fora do download inicial | `ASSET_BUDGET` dá `FAIL` com `ASSET_NOT_IN_INITIAL_DOWNLOAD` |
| Requisição de som ou imagem desta feature depois de o jogo abrir | O requisito 03 não é atendido; não há carregamento sob demanda nem nova tentativa pela rede |
| Rede desligada depois de o jogo abrir | Motor e pneu tocam igual; ícone já está na aba (D-FS-08) |
| Rede desligada antes de o jogo abrir | O jogo não abre; nenhum requisito desta feature muda esse comportamento |
| Tempo total ou setor diferente com o som ligado e desligado | `SOUND_DETERMINISM` dá `FAIL` com `TIME_DIFFERS`; o som deixa de ler o que muda a simulação, nunca o contrário (I2, D-FS-05) |
| Sons e imagens indisponíveis | Mesmos tempos; `ASSETS_NEUTRAL` dá `PASS`; os sons não tocam e as imagens não aparecem |
| Campo do estado da simulação diferente da linha de base | `SIM_STATE_UNCHANGED` dá `FAIL` com `STATE_DIFFERS` |
| Taxa abaixo do limite no aparelho de referência com os sons tocando | O requisito 08 ou 09 não é atendido; reduz-se o custo do som, nunca o limite |
| Execução só em desktop para o limite de celular | Não vale como evidência (I9) |
| Aparelho abaixo do de referência | Nenhum requisito de taxa de quadros se aplica |
| Arquivo de som da zebra entre os arquivos entregues | `ASSET_BUDGET` dá `FAIL` com `CURB_SOUND_FILE_PRESENT` |
| Marca, logotipo ou texto de terceiros achado na inspeção | O requisito 13 não é atendido; a imagem é trocada na origem e inspecionada de novo |
| Licença ainda não confirmada | Staging pode usar os arquivos; a promoção para produção espera (`LICENSE_PENDING`) |
| Termos do plano que não permitem o uso num jogo publicado | Os requisitos não dizem o que muda; a promoção para produção continua bloqueada e a decisão é do dono do produto |
| Verificação repetida | Os registros são função do build e da sequência de entradas; repetir dá o mesmo resultado |

## Estado

| Estado | Valores | O que dirige a transição |
|---|---|---|
| `licenseStatus` | `LICENSE_PENDING`, `LICENSE_CONFIRMED` | A confirmação do dono do produto registrada em `DOMAIN.md` leva de `LICENSE_PENDING` a `LICENSE_CONFIRMED` ([RULE-0003](../rules/RULE-0003-arquivos-da-feature-peso-e-licenca.md)) |

Não muda estado de simulação, de tentativa nem de resultado.

## Configuração

Nenhuma. Não há ajuste de qualidade de som, de carregamento sob demanda nem de ambiente exposto por esta
feature; `licenseStatus` não é configuração do jogo, é fato registrado em `DOMAIN.md` e conferido na
liberação. Nenhuma configuração existe para forçar um evento, injetar um estado ou habilitar um caminho de
depuração.

## Critérios de aceite

- Medida do build que entrega a feature: `initialDownloadBytes` abaixo de 3 MB comprimidos (satisfaz o
  NFR-0001; cobre o requisito 01).
- `ASSET_BUDGET`: `featureAssetBytes` de no máximo 300.000, com os 4 arquivos somados (satisfaz o NFR-0002;
  cobre o requisito 02).
- Registro das requisições de rede do navegador, do momento em que o jogo abre até o fim de uma volta
  completa com o som ligado e ao menos um deslize, em `web-desktop` e em `web-mobile`: 0 requisições para
  som ou imagem desta feature (satisfaz o NFR-0003; cobre o requisito 03).
- `ASSET_BUDGET`: `assetsInInitialDownloadCount` igual a 4 de 4 (satisfaz o NFR-0003; cobre o requisito
  04).
- Com a rede do aparelho desligada depois de o jogo abrir, numa volta completa com o som ligado e ao menos
  um deslize, em cada canal, o motor e o pneu tocam: 0 sons desta feature em falta (satisfaz o NFR-0003;
  cobre o requisito 05).
- `SOUND_DETERMINISM` com `verdict` `PASS`: `lapDeltaMs` igual a 0 e `maxSectorDeltaMs` igual a 0 entre a
  execução com o som ligado e a execução com o som desligado (satisfaz o NFR-0004; cobre os requisitos 06 e
  07).
- Teste registrado no notebook de referência nomeado: 60 fps sustentados numa volta completa com o som
  ligado, o motor tocando e ao menos um deslize com som de pneu (satisfaz o NFR-0005; cobre o requisito
  08).
- Teste registrado no celular intermediário de referência nomeado: 30 fps sustentados nas mesmas condições;
  nenhuma execução em desktop usada como evidência (satisfaz o NFR-0005; cobre o requisito 09).
- `ASSET_BUDGET`: `newRuntimeDependencyCount` igual a 0 (satisfaz o NFR-0006; cobre o requisito 10).
- Saída de `npm test` com esta feature entregue: os ensaios de `pista-kart-park` para os critérios 09 a 12
  de US-0005 daquele conjunto passam, 4 de 4 (satisfaz o NFR-0007; cobre o requisito 11).
- `ASSET_BUDGET`: `curbSoundFileCount` igual a 0 (satisfaz o NFR-0007; cobre o requisito 12).
- Registro de inspeção visual da capa e do ícone na forma entregue, com data e nome de quem inspecionou:
  0 marcas, 0 logotipos e 0 textos de terceiros nas 2 imagens (satisfaz o NFR-0008; cobre o requisito 13).
- `ASSETS_NEUTRAL` com `verdict` `PASS`: `lapDeltaMs` e `maxSectorDeltaMs` iguais a 0 entre a execução com
  e a execução sem os sons e as imagens disponíveis (satisfaz o NFR-0009; cobre o requisito 14).
- `SIM_STATE_UNCHANGED` com `verdict` `PASS`: `differingFieldCount` igual a 0 (satisfaz o NFR-0009; cobre o
  requisito 15).
- Registro de liberação da etapa de deploy comparado com a data da confirmação em `DOMAIN.md`: 0 promoções
  para produção com algum dos 4 arquivos antes da confirmação (satisfaz o NFR-0010; cobre o requisito 16).

## Pontos em aberto

Nenhum.
