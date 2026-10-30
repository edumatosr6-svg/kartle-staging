# Domínio — modelo-kart-01

Decisões fechadas pelo dono do produto. Prevalecem sobre os pontos em aberto correspondentes do `SEED.md`.

- 2026-10-22 — **Fonte do modelo (Eduardo Matos):** o código do Cowork, salvo sem alteração em
  `docs/kart-01/kart.js`. A ficha "Kart 01 — Kartle" é a referência para conferir.
- 2026-10-22 — **OPEN-01 fechado:** as 124 malhas são **agrupadas por material**, para no máximo
  **30 chamadas de desenho** do kart com o piloto, sem mudar a forma. Rodas, volante e braços continuam
  animáveis.
- 2026-10-22 — **OPEN-02 fechado:** as medidas da física **não** são alinhadas ao modelo nesta feature.
  Fica para depois da `dirigibilidade`.
- 2026-10-22 — **OPEN-03 fechado:** em retrato, o campo de visão **horizontal** é de pelo menos **60°**,
  então o vertical cresce em retrato. Em paisagem, o vertical é de 62°, como na ficha.
- 2026-10-22 — **OPEN-04 fechado:** antes da largada, a câmera mostra a pista do alto e **desce para trás
  do piloto durante a contagem regressiva**. No sinal verde, ela já está na posição de corrida.
- 2026-10-22 — **OPEN-05 fechado:** o kart **projeta sombra** no chão.
- 2026-10-22 — **Câmera depois do fim da volta (Eduardo Matos),** após parada do F-Spec: quando a volta
  termina, válida ou invalidada (inclusive por reposicionamento), e o painel de resultado aparece, a
  câmera **continua atrás do piloto**, na pose de corrida, e o kart continua pilotável. A visão geral do
  alto existe **só antes da contagem regressiva**. "Em corrida", para a câmera, vai do sinal verde até a
  próxima visão geral, sem terminar em `ENDED`.
- 2026-10-22 — **Correção da decisão da câmera (Eduardo Matos),** após feedback do D-Spec: a frase "o
  kart continua pilotável" **não vale**. Quando a volta termina (`ENDED`) e o painel de resultado aparece,
  a simulação para e o kart **congela, como hoje** (invariante INV-1 de `race-lap-validation`). A decisão
  descreve **só a câmera**: ela continua atrás do piloto, na pose de corrida, com o kart parado, até a
  próxima visão geral (antes da contagem da volta seguinte). Nada muda em `race-lap-validation`.
- 2026-10-29 — **Treino contínuo e fim do drift e do turbo (Eduardo Matos):** no treino as voltas passam a
  ser seguidas (`race-lap-validation` rev 3, US-10), então o kart **não congela** ao fim de uma volta de
  treino: ele continua pilotável e a câmera continua atrás do piloto. A decisão de 2026-10-22 ("o kart
  congela, como hoje") passa a valer só para a volta oficial. O drift e o turbo saíram do jogo
  (`dirigibilidade` rev 4), então a indicação de drift e a fumaça do escapamento ligada ao turbo deixam de
  existir; as marcas de pneu continuam.
- 2026-10-29 — **Sem efeito de turbo na câmera (condutor, consequência da decisão acima):** com o turbo
  retirado, o critério de US-3 "o efeito de campo de visão do turbo continua funcionando" sai do seed
  (rev 3). A câmera de corrida tem só o campo de visão base (62°, e a regra de retrato).
