---
id: SCR-0003
title: Tela inicial, dica da barra de ferramentas e guia de manobras sem drift nem turbo
feature: dirigibilidade
stage: fspec
status: validated
version: 1.0.0
sources: [US-0003, NFR-0005, AC-US-0003-12, AC-US-0003-13, AC-US-0003-14]
---

# SCR-0003 — Tela inicial, dica da barra de ferramentas e guia de manobras sem drift nem turbo

## Propósito

O que esta feature muda em três telas que ensinavam o drift: a tela inicial (AC-US-0003-12), a dica da
barra de ferramentas (AC-US-0003-13) e o guia de manobras (AC-US-0003-14). Em nenhuma delas, nos dois
canais, aparece texto, ícone ou controle que mencione ou ofereça o drift ou o turbo: nem o comando de
drift (a tecla de drift ou um controle de drift), nem carga de drift, turbo, mini-turbo ou impulso, nem
combo ou pontuação de drift. Com o fim do drift e do turbo (`DOMAIN/DEC-15`), nada pode ensinar um comando
que não faz mais nada (`SEED/RE-01`, `DOMAIN/DEC-17`). É só remoção de exibição, sem regra nova na
renderização (NFR-0005): nenhuma regra de pilotagem é decidida aqui (I2). As três telas já existem e não
são redefinidas; este arquivo especifica apenas a retirada, sem elemento nem texto novo de tela (RNF11;
`01-context.md` dos requisitos). A retirada não depende do acerto selecionado: a restrição do seed não a
condiciona a um acerto (US-0003, Pré-condições).

## Canal

Ambos, sem diferença. Nenhuma das três telas chama contrato deste conjunto: não leem telemetria
([API-0001](../api/API-0001-telemetria-de-dirigibilidade.md)) nem versão do acerto
([API-0002](../api/API-0002-versao-do-acerto.md)).

| Aspecto | `web-desktop` | `web-mobile` |
|---|---|---|
| Tela inicial | sem texto, ícone ou controle de drift ou de turbo; não ensina a tecla de drift | a mesma retirada; não ensina nem oferece um controle de drift |
| Dica da barra de ferramentas | idem | idem |
| Guia de manobras | idem | idem; também não ensina o botão "Drift", que o controle de toque não exibe mais ([SCR-0001](SCR-0001-hud-de-velocidade-e-aderencia.md)) |
| Estado offline | igual (sem rede, tudo funciona) | igual |

## Pontos de entrada

- Tela inicial: ao abrir o jogo, antes da volta.
- Dica da barra de ferramentas: quando exibida junto à barra de ferramentas do jogo.
- Guia de manobras: quando o Jogador o abre.

Os meios de entrada são os das telas existentes, inalterados por esta feature.

## Estados

| Estado | Condição | Chamadas | O que a tela mostra | Fonte |
|---|---|---|---|---|
| Carregando | A tela, a dica ou o guia ainda não foi exibido | nenhuma deste conjunto | Nada desta retirada a observar; nenhum conteúdo provisório menciona ou oferece o drift ou o turbo | AC-US-0003-12, AC-US-0003-13, AC-US-0003-14 |
| Populado | Tela inicial exibida; dica da barra de ferramentas exibida; guia de manobras aberto | nenhuma deste conjunto | O conteúdo que cada tela já mostra, sem nenhum texto, ícone ou controle que mencione ou ofereça o drift ou o turbo: nem a tecla de drift ou um controle de drift, nem carga de drift, turbo, mini-turbo ou impulso, nem combo ou pontuação de drift | AC-US-0003-12, AC-US-0003-13, AC-US-0003-14 |
| Vazio | Dica ou guia (ou parte da tela inicial) cujo conteúdo era só o drift ou o turbo | nenhuma deste conjunto | O conteúdo de drift ou de turbo sai sem texto novo no lugar; os requisitos não exigem nem proíbem que a dica ou o guia continue existindo; se continuar, vale o estado Populado | US-0003, caso anormal "Tela inicial, dica ou guia cujo conteúdo era só o drift ou o turbo" |
| Erro | A tela, a dica ou o guia não pode ser exibido, por qualquer causa | nenhuma deste conjunto | Nenhum estado de erro próprio desta feature: o tratamento é o da tela existente, inalterado; nenhuma mensagem exibida menciona ou oferece o drift ou o turbo | AC-US-0003-12, AC-US-0003-13, AC-US-0003-14 |
| Offline | Sem rede | nenhuma chamada de rede | Nenhuma diferença: o conteúdo é local; nenhum aviso de rede | RNF08, D-FS-08 |
| Permissão negada | `web-mobile` com sensor ausente ou permissão negada | nenhuma | Não se aplica às três telas: não usam o sensor; a retirada vale igual | US-0003, Canais |
| Permissão negada em `web-desktop` | Não se aplica | — | O canal não pede sensor | US-0003, Canais |

Em cada idioma que a interface oferece, os mesmos estados, com a mesma retirada (RNF11; US-0003, caso
anormal "Idioma da interface").

## Ações do Jogador

| Ação | Canal | Resultado |
|---|---|---|
| Abrir o jogo | ambos | Tela inicial no estado Populado: nada menciona ou oferece o drift ou o turbo |
| Ver a dica da barra de ferramentas | ambos | Dica sem drift nem turbo; se o seu conteúdo era só o drift, estado Vazio |
| Abrir o guia de manobras | ambos | Guia sem drift nem turbo: não ensina a tecla de drift, um controle de drift nem o botão "Drift"; o que mais ele ensina não é redefinido aqui |
| Pressionar a tecla de drift (`web-desktop`) | `web-desktop` | Nenhum efeito no estado da simulação ([RULE-0001](../rules/RULE-0001-estado-de-aderencia-e-condicao-de-forcar.md)); nenhuma destas telas a ensina |

## Navegação

Nenhuma navegação nova: as entradas e as saídas das três telas são as existentes, inalteradas. Da tela
inicial, o Jogador segue para a volta, cujo HUD e controle de toque estão em
[SCR-0001](SCR-0001-hud-de-velocidade-e-aderencia.md).
