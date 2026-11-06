---
id: ADR-0008
title: Kart Park versão 2 a partir da réplica — arquivo novo ao lado da versão 1, conferência de versão no catálogo e versão 1 fora do pacote
feature: pista-kart-park
stage: dspec
status: validated
version: 1.0.0
sources: [API-0001, API-0002, RULE-0002, RULE-0003, RULE-0005, FLOW-0003, FEAT-0001, FEAT-0002, REQ-FEAT-0001-15, REQ-FEAT-0001-16, REQ-FEAT-0002-07, REQ-FEAT-0002-10, REQ-FEAT-0002-18, REQ-FEAT-0002-19, REQ-FEAT-0002-20, REQ-FEAT-0002-21]
---

# ADR-0008 — Kart Park versão 2 a partir da réplica

## Contexto

A revisão 3 do seed troca o traçado da Kart Park pela réplica não oficial (`replica/kart-park-replica.json`:
retas e arcos, 691 pontos, 7,0 m fixos, 22 zebras) e o F-Spec 2.0.0 fixa: arquivo novo `kart-park`
`trackVersion` 2 no mesmo esquema 3; o arquivo da versão 1 continua publicado, byte a byte igual, e sai do
seletor; a linha central é a da réplica nos eixos do jogo com a origem dela, sem nova suavização, a no máximo
0,10 m; a entrada do catálogo declara a versão que carrega e a seleção a confere (`TRACK_VERSION_MISMATCH`). O
F-Spec deixa ao projeto duas lacunas: como os pontos da réplica chegam à `centerline` e se o arquivo da versão 1 é
entregue ao navegador. A decisão muda o arquivo de pista que o jogo carrega e o conjunto de arquivos publicados,
o que é caro de reverter (D-DS-05).

## Decisão

1. **Pontos.** A `centerline` da versão 2 tem exatamente os pontos da réplica, na ordem dela, convertidos
   `(x, y)` → `(xM, zM) = (x, −y)` e arredondados a 0,001 m: sem suavizar, sem reamostrar, sem deslocar a origem.
   O ponto 0 gerado é o ponto 0 da réplica e cada ponto gerado fica a no máximo cerca de 0,0007 m do seu ponto da
   réplica (`prep.maxReplicaOffsetM`). As distâncias de volta da réplica (zebras, elementos) são lidas na
   `centerline` sem conversão ([DES-0010](../pipeline/DES-0010-preparo-offline-do-arquivo-da-kart-park.md)).
2. **Dois arquivos publicados.** `src/tracks/kart-park-v2.json` é acrescentado ao lado de
   `src/tracks/kart-park-v1.json`, que não é editado, renomeado nem apagado; o registro ganha a entrada 2 e a 1
   não muda ([DM-0001](../data/DM-0001-arquivo-de-pista-versao-de-esquema-3.md),
   [DM-0002](../data/DM-0002-registro-de-publicacao-e-estado-em-memoria.md)). Os dois arquivos e as duas origens
   ficam sob as regras `-text` de `.gitattributes` que já existem.
3. **Conferência no catálogo.** A entrada `kart-park` de `TRAINING_TRACKS` declara `trackVersion` 2;
   `selectTrainingTrack` só abre `READY` com um arquivo que declara o `trackId` pedido e esse `trackVersion`;
   senão `FAILED` com `TRACK_VERSION_MISMATCH` ([DES-0005](../core/DES-0005-sessao-de-treino-catalogo-e-selecao-de-pista.md)).
4. **Versão 1 fora do pacote.** A aplicação importa só `kart-park-v2.json` como texto; o arquivo da versão 1 fica
   no repositório e não é empacotado ([DES-0007](../web/DES-0007-tela-inicial-seletor-credito-e-resultado.md)).
5. **Preparo da versão 1 congelado.** O código que gerou a versão 1 (suavização, [ADR-0006](ADR-0006-lacunas-do-f-spec-resolvidas-no-projeto.md))
   fica em `scripts/trackPrep.ts` sem mudança e só sustenta a prova de reprodução da versão 1; o programa recusa
   `prepare`, `verify` e `publish` para `kart-park` 1.

## Alternativas consideradas

| Alternativa | Por que não |
|---|---|
| Reamostrar a réplica a passo fixo (por exemplo, 1,0 m exato) | os pontos da réplica já estão a 0,949 m a 1,012 m; reamostrar acrescenta um erro de corda nos arcos sem ganho, e o ponto 0 e a régua das distâncias passariam a depender do método |
| Suavizar a réplica com a regra da versão 1 | o F-Spec proíbe ("sem nova suavização"), e a janela de 12 m encurtaria os arcos de 8,8 m |
| Editar `kart-park-v1.json` no lugar com o traçado novo | proibido por REQ-FEAT-0002-18 e REQ-FEAT-0002-21 (I3) |
| Empacotar os dois arquivos e escolher pela versão do catálogo | a versão 1 iria ao navegador sem uso (cerca de 43 kB a mais), e uma opção que a carregasse ficaria a uma linha de código; fora do pacote, nenhuma opção pode carregá-la (REQ-FEAT-0001-16) |
| Não conferir a versão e confiar no arquivo importado | um erro de empacotamento abriria a pista errada em silêncio; a conferência a torna visível (I4) e é o que API-0002 pede |
| Apagar o preparo da versão 1 | o código validado sustenta uma prova a mais de que a versão 1 não mudou; apagá-lo é mudança maior que mantê-lo e retiraria uma verificação planejada (conventions §17) |

## Consequências

- A versão 2 é a única Kart Park jogável; a versão 1 é histórico verificável pelo resumo `04ce5e51…f057b1`.
- A volta na Kart Park de antes (versão 1) e a de agora não são comparáveis; como nenhum resultado é gravado, não
  há resultado antigo a migrar, e todo `LapResult` já carrega o `trackVersion` da sessão.
- A origem das coordenadas da versão 2 é a linha de largada, não o centro da pista: a câmera e a sombra já
  seguem o kart (`src/main.ts:46`), o minimapa e a visão geral usam a caixa da geometria (`:246`, `:411`) e a
  grama de 2.000 × 2.000 m cobre a pista com folga, de modo que nenhum desenho precisa de caso especial.
- Uma terceira versão seguirá o mesmo caminho: arquivo novo, entrada nova, catálogo com o `trackVersion` novo e a
  importação trocada; as anteriores ficam.

## Status

Proposta deste conjunto (revisão 3 do seed), a validar.
