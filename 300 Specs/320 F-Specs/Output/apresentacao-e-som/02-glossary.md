---
title: Glossário — apresentação e som
feature: apresentacao-e-som
stage: fspec
status: validated
version: 1.0.1
sources: []
---

# Glossário

Os termos valem igualmente em `web-desktop` e `web-mobile`, salvo indicação. Os termos de domínio vêm do
glossário dos requisitos; os acrescentados aqui estão marcados "(F-Spec)"; as linhas de enum e de campo são
as dos contratos de `api/` e das regras de `rules/`.

## Termos de domínio

| Termo | Definição |
|---|---|
| Jogador | Quem abre o jogo, liga o som e pilota o kart |
| Visitante | Quem vê a prévia de um link do jogo antes de abri-lo |
| Ícone | A imagem de `docs/art/icon.png`, sem texto, que identifica o Kartle na aba do navegador e no atalho da tela de início |
| Capa | A imagem de `docs/art/cover.png`, sem texto dentro da imagem, que a página declara como imagem de prévia de link; nenhuma tela do jogo a mostra |
| Prévia de link | O cartão com imagem, título e descrição que um aplicativo ou site monta ao receber um link, a partir do que a página declara |
| Página do jogo | O documento que o navegador recebe ao abrir o endereço do Kartle; é onde o ícone, a capa, o título e a descrição são declarados |
| Atalho da tela de início | O atalho que o navegador do celular cria quando o Jogador usa "adicionar à tela de início" (`web-mobile`) |
| Som ligado, som desligado | Os dois únicos estados do som do jogo; o jogo abre com o som desligado e só o Jogador o liga. Não há controle de volume |
| Controle de som | O controle que o jogo já tem para ligar e desligar o som; esta feature não o cria nem o move |
| Som do motor | O som contínuo do motor do kart: a gravação `docs/sfx/engine-loop.mp3`, no lugar do tom sintetizado |
| Som de pneu | O som do pneu cantando: a gravação `docs/sfx/tire-screech.mp3`, que toca enquanto o kart deixa marca de pneu no asfalto |
| Som da zebra | O ruído curto e grave que se repete com roda na zebra, de `pista-kart-park`; não pertence a esta feature e não muda |
| Marca de pneu | O rastro que o jogo já desenha no asfalto quando o kart desliza; é a situação que dispara o som de pneu |
| Situação de marca de pneu | A condição em que a cena desenha um trecho novo de marca de pneu, definida em `modelo-kart-01`; nomeada aqui e não redefinida |
| Volta em andamento | Estado em que o Jogador está pilotando uma volta. A volta deixa de estar em andamento na pausa, no resultado e no reposicionamento |
| Reposicionamento | Recolocação do kart na pista, durante a qual a volta não está em andamento; pedido por `repositionKart`, de `race-lap-validation` |
| Acelerador pressionado, acelerador solto | Os dois estados do comando de aceleração usados para comparar a intensidade do motor na mesma velocidade |
| Download inicial | Tudo o que o navegador baixa para o jogo abrir, medido em bytes comprimidos; em 2026-11-06 somava 186.291 bytes |
| Arquivos desta feature | A capa, o ícone, o som do motor e o som de pneu na forma em que são entregues ao navegador |
| Depois de o jogo abrir | O período que começa quando o download inicial termina e a tela inicial do jogo aparece |
| Arquivos gerados por IA | A capa, o ícone, o som do motor e o som de pneu, gerados no Higgsfield em 2026-11-10; a licença deles condiciona a promoção para produção |
| Staging, produção | Os dois ambientes em que o jogo é publicado; a licença bloqueia só a promoção para produção |
| Apresentação | A camada de tela e áudio do jogo; fica fora da simulação e não muda nenhum dado dela (I2) |

## Termos acrescentados (F-Spec)

| Termo | Definição |
|---|---|
| Forma entregue | O arquivo que o navegador recebe, derivado do arquivo de origem só por redimensionamento, conversão de formato ou compressão (F-Spec) |
| Declaração | O que o documento da página do jogo informa ao navegador e aos serviços de prévia: ícone, imagem de prévia, título e descrição; a marcação que carrega cada uma é do D-Spec (F-Spec) |
| Silêncio | Ganho pedido à saída de áudio igual a 0 para o som em questão (`engineGainNorm` ou `tireGainNorm`) (F-Spec) |
| Som tocando | Som disponível e ganho pedido maior que 0 (F-Spec) |
| Passo avançado | Um passo de `STEP` concluído pela simulação; identificado por `simStepCount` (F-Spec) |
| Kart marcando o asfalto | O último passo avançado está na situação de marca de pneu, no asfalto, e a simulação não está suspensa (`lapPhase` `PAUSED`) nem parada (`lapPhase` `ENDED`); um quadro sem passo novo não muda a situação (F-Spec) |

## Enums

| Enum | Valores | Onde |
|---|---|---|
| `engineSoundState` | `ENGINE_SILENT`, `ENGINE_PLAYING` | [API-0002](api/API-0002-estado-e-comando-do-som.md), [RULE-0001](rules/RULE-0001-estado-do-som-e-som-do-motor.md) |
| `tireSoundState` | `TIRE_SILENT`, `TIRE_PLAYING` | [API-0002](api/API-0002-estado-e-comando-do-som.md), [RULE-0002](rules/RULE-0002-som-de-pneu.md) |
| `assetRole` | `ICON_IMAGE`, `COVER_IMAGE`, `ENGINE_LOOP`, `TIRE_SCREECH` | [API-0003](api/API-0003-registros-de-verificacao.md), [RULE-0003](rules/RULE-0003-arquivos-da-feature-peso-e-licenca.md) |
| `checkId` | `SOUND_DETERMINISM`, `ASSETS_NEUTRAL`, `SIM_STATE_UNCHANGED`, `ASSET_BUDGET` | [API-0003](api/API-0003-registros-de-verificacao.md) |
| `verdict` | `PASS`, `FAIL` | [API-0003](api/API-0003-registros-de-verificacao.md) |
| `licenseStatus` | `LICENSE_PENDING`, `LICENSE_CONFIRMED` | [RULE-0003](rules/RULE-0003-arquivos-da-feature-peso-e-licenca.md) |
