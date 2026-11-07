# Domínio — pista-kart-park

Decisões fechadas pelo dono do produto. Prevalecem sobre os pontos em aberto correspondentes do `SEED.md`.

- 2026-10-22 — **Entrada da pista (Eduardo Matos):** a Kart Park entra **ao lado** da pista sintética,
  com um seletor de pista.
- 2026-10-22 — **Licença (Eduardo Matos):** usar os dados agora e mostrar o crédito OSM/ODbL. A dúvida
  sobre os dados derivados da Esri World Imagery é um item aberto que **bloqueia só a promoção para
  produção**. Staging pode usar a pista.
- 2026-10-22 — **Atalho entre trechos quase encostados (Eduardo Matos):** **barreira física** entre os
  trechos (como na pista real). O kart bate e não passa.
- 2026-10-22 — **Fidelidade (Eduardo Matos):** **suavizar** a linha central, com janela de cerca de 12 m,
  e apresentar como "Kart Park — São José dos Pinhais (traçado aproximado)", com o comprimento medido de
  687 m. O recorde real de 41,45 s **não** aparece.
- 2026-10-22 — **Zebras (Eduardo Matos):** contam como pista **e têm efeito**: cada pneu sobre a zebra
  tem **85 %** da aderência do asfalto (a grama tem ≈ 40 %). No celular, vibração de **20 ms a cada
  0,25 s** enquanto houver roda na zebra. No teclado, só o som.
- 2026-10-22 — **Seletor (Eduardo Matos):** **só para treino** até o desafio diário existir. O jogo abre
  na **Kart Park**. A sintética fica selecionável e continua sendo a pista dos ensaios automáticos.
- 2026-10-22 — **Crédito (Eduardo Matos):** "© colaboradores do OpenStreetMap", menção à ODbL e link para
  `openstreetmap.org/copyright` numa linha discreta **no seletor de pista e na tela de resultado**
  sempre que a pista for a Kart Park. O crédito da Esri entra junto se a licença for liberada.
- 2026-10-22 — **OPEN-01 (Esri):** o dono do produto decide **antes da promoção para produção**, com base
  nos termos de uso da Esri. Até lá, a Kart Park fica **só em staging**.
- 2026-10-22 — **OPEN-02 fechado:** a linha central suavizada fica a **até 0,30 m** da original em todo
  ponto.
- 2026-10-22 — **OPEN-03 fechado:** para os atalhos pela grama de 12 a 26 m, os **marcadores a cada 25 m
  bastam**. Barreira só nos trechos com 6 m de grama ou menos (US-4).
- 2026-10-22 — **OPEN-04 fechado:** som da zebra no teclado: um **ruído curto e grave que se repete**
  enquanto houver roda na zebra, com o som ligado.
- 2026-11-03 — **OPEN-01 continua aberto (Eduardo Matos):** a Kart Park **segue só em staging**; nenhuma
  liberação, nem remedição sem Esri, por enquanto. A produção espera a decisão (opção 1 dos runbooks).
- 2026-11-06 — **Traçado da revisão 3 (Eduardo Matos):** aprovada a **réplica não oficial**
  (`replica/kart-park-replica.json`): retas e arcos de raio constante com transições de 5 m, largura
  fixa de **7 m**, zebras por regra (por dentro das curvas de raio < 30 m e por fora na saída das de raio
  < 16 m). Ela substitui o traçado da versão 1 no seletor como `kart-park` **versão 2**, com o nome
  "Kart Park — São José dos Pinhais (réplica não oficial)". A licença Esri (OPEN-01) continua valendo
  para ela, por ser derivada da versão 1.
- 2026-11-06 — O dono do produto aprovou a retirada de CHK-TEST-0005-06 (a volta pelo atalho da curva 4
  da versão 1), junto com AC-US-0003-09 e REQ-FEAT-0003-12: o atalho não existe na réplica.
