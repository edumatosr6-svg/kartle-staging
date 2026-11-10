# Domínio — apresentacao-e-som

Decisões fechadas pelo dono do produto. Prevalecem sobre os pontos em aberto correspondentes do `SEED.md`.

- 2026-11-10 — **OPEN-01 fechado (Eduardo Matos):** a capa aparece **só na prévia do link**. Nenhuma tela
  do jogo mostra a capa.
- 2026-11-10 — **OPEN-02 fechado (Eduardo Matos):** os dois sons foram ouvidos e **servem** como estão:
  `docs/sfx/engine-loop.mp3` e `docs/sfx/tire-screech.mp3`.
- 2026-11-10 — **Rota de entrega dos sons (Eduardo Matos):** as duas gravações vão **embutidas no pacote
  JavaScript** do download inicial, sem `fetch`. Nenhum teste de camadas de outra feature é migrado por
  causa da rota (decisão sobre o FAIL SPEC do estágio de código).
- 2026-11-10 — **Migração de CHK-TEST-0008-07 aprovada (Eduardo Matos):** o teste validado de
  `pista-kart-park` (`tests/pista-kart-park-feedback.test.ts`) passa a afirmar o **motor gravado**, sob o
  mesmo identificador, mantendo as afirmações sobre a zebra e a recompensa.
- 2026-11-10 — **OPEN-03 (licença dos arquivos gerados por IA) (Eduardo Matos):** o dono do produto
  confirma nos termos do plano do Higgsfield **antes da promoção para produção**. O ponto **bloqueia só a
  produção**: especificação, código e staging seguem.
