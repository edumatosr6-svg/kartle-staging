# Domínio — dirigibilidade

Decisões fechadas pelo dono do produto. Prevalecem sobre os pontos em aberto correspondentes do `SEED.md`.

- 2026-10-21 — **Referência de sensação (Eduardo Matos):** Karting Superstars — direção direta e
  rápida, muita aderência em alta velocidade, traseira viva mas controlável (escorrega-e-segura).
  Sintomas relatados no acerto atual: sai de frente nas curvas; lento para responder ao volante; pouca
  sensação de velocidade e de risco.
- 2026-10-21 — **OPEN-01 fechado:** resposta do volante — a taxa de guinada atinge 90 % do regime em
  no máximo **250 ms** após esterço cheio a 50 km/h em reta; ao soltar, cai a 10 % em no máximo
  **300 ms**.
- 2026-10-21 — **OPEN-02 fechado:** velocidade de curva de referência no raio de 18 m: **45 km/h**.
- 2026-10-21 — **OPEN-03 fechado:** nessa curva, a telemetria não reporta `understeer` por mais de
  **200 ms** consecutivos.
- 2026-10-21 — **OPEN-04 fechado:** ao reduzir o esterço com a traseira solta, o kart volta a `grip`
  em no máximo **400 ms**.
- 2026-10-21 — **OPEN-05 fechado:** 0–60 km/h em no máximo **3,0 s** (piloto de 75 kg).
- 2026-10-21 — **OPEN-06 fechado:** velocidade estabilizada em reta de pelo menos **95 km/h**.
- 2026-10-21 — **OPEN-07 fechado:** o piloto de teste (`npm run bench:handling`) completa a volta
  sintética sem sair do asfalto em no máximo **27 s** (hoje ~31,4 s).
- 2026-10-21 — **OPEN-08 mantido como critério final:** uma rodada de teste do dono do produto na
  build antes de fechar a feature; os números acima são necessários, não suficientes.
- 2026-10-21 — **Resposta do volante só mede guinada (Eduardo Matos):** no ensaio em reta a 50 km/h com
  esterço cheio (OPEN-01), o critério é o tempo de resposta da taxa de guinada; `understeer` transitório
  reportado pela telemetria durante esse ensaio **é aceitável**. A aderência em curva é julgada apenas
  pelo ensaio de 45 km/h no raio de 18 m (OPEN-02/OPEN-03). AC-US-0001-05 fica restrito a isso.
- 2026-10-21 (revisão 2 do seed) — **Acerto agressivo (Eduardo Matos),** após testar o build atual
  ("não vira, não ganha velocidade"). Substitui os valores de OPEN-01, 02, 05, 06 e 07 fechados acima:
  - **OPEN-01:** guinada a 90 % do regime em **180 ms**; ao soltar, cai a 10 % em **250 ms**.
  - **OPEN-02:** curva de raio 18 m a **50 km/h** sem `understeer` por mais de 200 ms (OPEN-03 mantido).
  - **OPEN-05:** 0–60 km/h em no máximo **2,5 s**.
  - **OPEN-06:** velocidade estabilizada de pelo menos **105 km/h**.
  - **OPEN-07:** piloto de teste completa a volta sintética em no máximo **25 s**.
  OPEN-04 (400 ms) e a regra "resposta do volante só mede guinada" permanecem.
- 2026-10-21 — **Ciclo de teste (OPEN-08, Eduardo Matos):** cada rodada de código é publicada em
  staging; o dono testa e devolve feedback curto (vira? acelera? traseira?); os presets são iterados
  dentro do pipeline (nova rodada de código/testes) até a aprovação dele. Nenhum preset experimental
  extra no painel.
- 2026-10-21 (revisão 3 do seed) — **Correção de fato e método dos ensaios (redator, após FAIL SPEC
  do código; não muda nenhum limiar do dono):** a pista sintética **não tem** curva de 18 m (raios
  mínimos 24 m, 25 m e um grampo de 4 m). A "curva de raio 18 m" de OPEN-02/03 é um **ensaio em pista de
  teste**: arco de raio 18 m com faixa de `WIDTH`, sem paredes, ambiente de ensaio próprio (como o
  `TEST_PAD`), não um segmento da pista sintética. O ensaio de resposta do volante (OPEN-01) roda em
  reta com a **velocidade mantida em 50 km/h** pelo acelerador, e "regime" é o valor estabilizado
  nessa condição (janela curta e estacionária), não um valor que deriva com a desaceleração. O ensaio
  de volta do piloto de teste (OPEN-07) continua na pista sintética.
- 2026-10-22 — **Fim da varredura de início do subesterço (Eduardo Matos), após a parada do D-Spec:**
  no ensaio em que a velocidade sobe no arco de 18 m, **sair da faixa abaixo de 50 km/h reprova**
  (`OFF_ASPHALT`). **Sair da faixa acima de 50 km/h é o fim natural da varredura**: não reprova, desde
  que pelo menos **duas velocidades acima de 50 km/h** tenham sido medidas antes da saída. Assim o
  critério de que o subesterço não diminui tem dados. Se a saída ocorrer antes da segunda medição acima
  de 50 km/h, o ensaio reprova por falta de medida.
- 2026-10-22 — **Esclarecimento de método da varredura (redator, sem mudar a decisão acima):** a
  varredura de início do subesterço mede em **patamares de velocidade mantida** no arco de 18 m. Uma
  "velocidade medida" é um patamar completo. Em cada patamar, compara-se a **maior sequência de
  `understeer` consecutivo dentro dele**, e não um máximo acumulado ao longo da varredura. O tamanho do
  patamar em km/h e a duração de cada um são parâmetros do ensaio, registrados em `docs/physics.md`
  (NFR-0004), não limiares de domínio.
- 2026-10-22 — **Início do subesterço num acerto que não sai de frente (Eduardo Matos), após FAIL SPEC do
  código:** quando a varredura em patamares no arco de 18 m termina pela saída da faixa acima de 50 km/h
  sem a telemetria ter reportado `understeer` em nenhum patamar, **a velocidade de início do subesterço
  (V1) é a velocidade mantida do patamar interrompido pela saída** e o critério "V1 ≥ 1,15 × V0" é
  avaliado com esse valor. Nunca sair de frente até sair da faixa **cumpre** o critério. O rótulo
  `understeer` da telemetria não muda.
- 2026-10-22 — **Curva de referência com acelerador zero (Eduardo Matos):** no ensaio do arco de 18 m
  entrando a 50 km/h **com acelerador zero**, o único critério é "sem `understeer` por mais de 200 ms
  consecutivos"; **permanecer na faixa enquanto desacelera não é exigido**. A variante com acelerador
  cheio continua exigindo permanência na faixa e ausência de `understeer`/`oversteer`.
- 2026-10-22 — **Leitura de "sem subesterço" (redator, coerente com OPEN-03; o dono pode reverter):**
  em todos os ensaios desta feature, "sem `understeer`" e "nenhum patamar reporta `understeer`"
  significam **nenhuma sequência de `understeer` com mais de 200 ms consecutivos** (o limiar de
  OPEN-03), e não tolerância zero. Assim, um patamar com `understeer` de até 200 ms seguido da saída da
  faixa acima de 50 km/h conta como "sem início de subesterço", e V1 é a velocidade mantida desse patamar.
- 2026-10-27 — **Onde o subesterço é medido na curva com acelerador zero (Eduardo Matos), após FAIL SPEC
  da rodada 3 de código:** no ensaio do arco de 18 m entrando a 50 km/h com acelerador zero, o
  `understeer` conta **só no asfalto, até a primeira saída da faixa**; passos na grama depois da saída
  não entram na medição (escorregar na grama não é "sair de frente"). O limiar continua 200 ms. O mesmo
  vale para qualquer ensaio em que a permanência na faixa não é exigida.
- 2026-10-29 — **Acerto C e fim do drift e do turbo (Eduardo Matos):** testando a staging, o dono do produto
  disse que "o kart simplesmente não vira". Medido: o acerto v5 limita o esterço ao que 1,48 g permite e
  chega a 110 km/h, então com acelerador e esterço cheios o menor raio é de 17 a 25 m (os grampos da Kart
  Park têm 6 m). Duas prévias foram publicadas na staging (`?acerto=c`, `?acerto=d`) e ele escolheu a **C**.
  O acerto Arcade passa a ser `arcade-assistido-v6`, que é o v5 com estes valores: `governorSpeed` 19,5 m/s,
  `assistLateralG` 2,4, `maxSteer` 0,5, `friction` 2,1, `frontStiffness` 26. Medido em 2026-10-29: velocidade
  estabilizada 69,3 km/h; 0–60 km/h em 2,21 s; acelerador e esterço cheios a partir de 50 km/h dão raio
  ≈ 11,7 m; piloto de teste completa a volta sintética em 23,05 s sem sair do asfalto. No mesmo pedido:
  **tirar o turbo e o drift** (a manobra de `requirements/11`: carga segurando a tecla, mini-turbo,
  combo e pontuação). Substitui o OPEN-06 de 105 km/h (agora 65 a 72 km/h) e os ensaios de esterço cheio
  no arco de 18 m (OPEN-02/OPEN-03 e o início do subesterço), que não valem para um kart que faz curva
  mais fechada que o arco: a curva passa a ser julgada pelo raio na pista de teste aberta (US-2). OPEN-01,
  OPEN-04, OPEN-05 e OPEN-07 permanecem.
- 2026-10-30 — **Curva sem acelerador e onde a retirada do drift acontece (condutor, rev 5):** medido com o
  acerto C, sem acelerador a partir de 50 km/h com esterço cheio, o kart gira 82° no 1.º segundo e 208° em
  2 s, e aos 3 s já está a 4 km/h; um raio medido aos 3 s não mede nada. O critério passa a ser o giro:
  pelo menos 180° em até 2 s (rev 5, US-2). A retirada do drift e do turbo pedida pelo dono do produto
  inclui a exibição deles (HUD, resultado, texto compartilhado); a restrição de I2 vale para regras de
  pilotagem, não para essa remoção.
- 2026-10-30 — **Drift fora de todas as telas (Eduardo Matos, "aproveita tira o turbo + drift"):** a validação de
  testes encontrou o drift ainda ensinado em `index.html` (tela inicial, dica da barra, guia de manobras) e o
  botão "Drift" no controle de toque. O pedido do dono do produto foi tirar o drift do jogo; a rev 6 nomeia
  essas telas na restrição de exibição, para que nada ofereça um comando que não faz mais nada.
