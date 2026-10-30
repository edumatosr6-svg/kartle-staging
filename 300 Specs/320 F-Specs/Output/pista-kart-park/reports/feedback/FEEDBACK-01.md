---
origin: pista-kart-park
target: pista-kart-park
origin-stage: dspec
target-stage: fspec
generated: 2026-10-30T13:40:00Z
origin-report: "300 Specs/330 D-Specs/Output/pista-kart-park/97-changelog.md (rodada de 2026-10-30, Mode C)"
---

# FEEDBACK-01 — D-Spec de pista-kart-park para o F-Spec de pista-kart-park

Pergunta ao autor do F-Spec. Nenhum `REQ-*` precisa mudar e nada é alterado por este documento: o D-Spec realiza os
requisitos sob o contrato revalidado de `race-lap-validation` e registra a leitura em ADR-0007 do D-Spec. O que fica
desatualizado é o texto de tela, de regra e de comportamento que ainda descreve a volta de treino terminando em
`ENDED`.

### FB-01

- severidade: scope
- verificação: coerência do F-Spec com a dependência que ele nomeia "sem mudança" (`race-lap-validation`)
- arquivo de origem: `300 Specs/330 D-Specs/Output/pista-kart-park/adr/ADR-0007-credito-no-painel-do-resultado-da-volta-do-treino.md` 1.0.0; `web/DES-0007` 1.3.0; `core/DES-0004` 1.1.0
- localização no F-Spec: `screens/SCR-0002` 1.0.1 ("Pontos de entrada: Fim da volta (`ENDED`)"; estado "Carregando: `ENDED` ocorreu"; estado "Erro: resultado ausente com a volta `ENDED`"; ação "Sair da tela"; "Navegação: entrada pela tela de corrida ao `ENDED`"); `rules/RULE-0003`, linha "uma volta já `ENDED` já teve o seu resultado exibido pela tela de resultado"; `features/FEAT-0003`, tabela, linha "Kart a mais de 3 m da borda ... a volta termina no passo" e linha "Volta completa ... na tela de resultado"; `features/FEAT-0001`, tabela, "o seletor só é alcançado sem volta em andamento (ao abrir e depois da tela de resultado)"; `01-overview.md`, linha da dependência "as telas de início de volta, de corrida e de resultado ... usados sem mudança"
- achado: o F-Spec revalidado de `race-lap-validation` (seed `revision: 3`; FEAT-0010, RULE-0002 1.1.1, SCR-0001 1.1.0, SCR-0003 1.2.1, API-0001 1.2.0, API-0002 1.2.1) aposenta a volta `TRAINING` única: o treino é uma sequência de voltas numa sessão, cada volta termina no cruzamento da chegada sem parar o jogo e o seu resultado aparece no painel "Resultado da volta do treino" da tela de corrida; o corte invalida sem encerrar; a tela de resultado da volta (SCR-0003 daquela feature) passa a ser só da volta oficial e da de reconhecimento; o treino termina só por "encerrar treino", que volta à tela de início. Toda volta da sessão desta feature é `TRAINING` (REQ-FEAT-0001-11). Os trechos acima ainda descrevem a volta de treino terminando em `ENDED`, com a tela de resultado e a saída dela.
- leitura adotada pelo D-Spec, sem mudar requisito: a "tela de resultado" de `race-lap-validation` que SCR-0002 nomeia e não redefine é, para uma volta de treino, o painel do resultado da volta do treino; a linha de crédito OSM fica dentro dele (REQ-FEAT-0006-04 a -06), que mostra o tempo total e os 4 setores (REQ-FEAT-0003-14); as regras de chegada, corte e contramão são as do treino de `race-lap-validation` (REQ-FEAT-0003-15); o seletor é alcançado na abertura e depois de "encerrar treino".
- esperado: na próxima rodada do F-Spec desta feature, alinhar o texto dos trechos acima ao treino de voltas seguidas, sem mudar os `REQ-*`, ou recusar com motivo no changelog do F-Spec; se o autor quiser outra localização para o crédito do resultado, a decisão volta ao D-Spec.
