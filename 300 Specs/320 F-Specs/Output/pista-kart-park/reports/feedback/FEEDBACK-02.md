---
origin: pista-kart-park
target: pista-kart-park
origin-stage: dspec
target-stage: fspec
generated: 2026-11-03T20:00:00Z
origin-report: "300 Specs/330 D-Specs/Output/pista-kart-park/97-changelog.md (rodada de 2026-11-03, Mode A)"
---

# FEEDBACK-02 — D-Spec de pista-kart-park para o F-Spec de pista-kart-park

Pedido de alinhamento de texto. Nenhum `REQ-*` precisa mudar e este documento não altera nada: o D-Spec realiza
REQ-FEAT-0008-14 e AC-US-0007-11 como estão e registra a leitura em `web/DES-0008` 2.0.0 ("Face de colisão").

### FB-01

- severidade: wording
- verificação: coerência de RULE-0006 com a colisão da barreira que o F-Spec nomeia "sem mudança"
- arquivo de origem: `300 Specs/330 D-Specs/Output/pista-kart-park/web/DES-0008-desenho-da-kart-park-na-tela-de-corrida.md` 2.0.0; `adr/ADR-0003-colisao-com-a-barreira.md` 1.1.0
- localização no F-Spec: `rules/RULE-0006` 1.0.0, tabela "Geometria desenhada", linha "Face dos pneus": "A face de colisão é a poligonal da barreira (...), em que o kart para dos dois lados; logo a fileira desenhada (...) ocupa no máximo 0,05 m de cada lado dela"; `features/FEAT-0008` 1.0.0, critério de aceite "a face dos pneus fica a no máximo 0,05 m da poligonal da barreira de cada lado"
- achado: no projeto validado e no código em execução, o kart não para na poligonal: ele para na superfície de contato a `BARRIER_HALF_WIDTH_M` = 0,1 m de cada lado dela (ADR-0003 do D-Spec, `src/trackGeometry.ts:17`). Com a fileira a no máximo 0,05 m da poligonal, como a frase deduz, o kart parado na barreira ficaria 0,05 m a 0,1 m antes dos pneus vistos, contra o que a mesma linha e a tabela "o acabamento na simulação" pedem ("a no máximo 0,05 m dos pneus vistos"). A premissa da frase não vale para o projeto; o requisito (face dos pneus a no máximo 0,05 m da face de colisão) vale.
- leitura adotada pelo D-Spec, sem mudar requisito nem constante da simulação: a face de colisão é a superfície de contato a 0,1 m de cada lado da poligonal; a face desenhada dos pneus fica, de cada lado, entre 0,073 m e 0,12 m da poligonal, a no máximo 0,027 m da face de colisão; largura total desenhada entre 0,146 m e 0,24 m. `BARRIER_HALF_WIDTH_M` não muda (NFR-0013, NFR-0014). A folga até o asfalto (0,51 m) e até a zebra (5,04 m), medida no seed (`NOTES.md`, 2026-11-03), mantém todo pneu na grama.
- esperado: na próxima rodada do F-Spec desta feature, trocar em RULE-0006 e no critério de FEAT-0008 "a poligonal da barreira" por "a superfície de contato da barreira, onde o kart para dos dois lados", sem mudar os `REQ-*`, ou recusar com motivo no changelog do F-Spec. Se o autor quiser a fileira medida contra a poligonal, isso pede mudar a superfície de contato da simulação, o que NFR-0013 proíbe, e a decisão volta ao autor do seed.
