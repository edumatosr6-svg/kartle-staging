# Backlog de escopo — dirigibilidade

- 2026-10-27 (dspec-loop rodada 8, proposta ao autor): `UNDERSTEER_ONSET` — que V0 vale quando a linha de
  base nunca sai de frente até sair da faixa? Hoje a linha de base medida (`ARCADE_KART`, 808 ms de
  `understeer` a 50 km/h) sai de frente, então o caso não ocorre e o ensaio devolve `BASELINE_MISSING` se
  ocorrer. Decidir só quando um acerto futuro virar linha de base sem subesterço: usar a velocidade do
  patamar interrompido também para V0, ou manter `BASELINE_MISSING`.
- 2026-10-27 (idem): a biblioteca lança (sem veredito) em dois casos que RULE-0002 não decide — saída da
  faixa exatamente a 50 km/h e varredura que termina sem saída da faixa. Decidir se ganham veredito.
