# Notas — apresentacao-e-som

Rascunho preparado com o Claude em 2026-11-10, a pedido do dono do produto. Não é lido pelo pipeline.

## Medições (2026-11-10)

Download inicial do build `dist/` de 2026-11-06, com `gzip -9`:

| Arquivo | Bruto | Comprimido |
|---|---|---|
| `assets/index-DszUW7WJ.js` | 690.598 B | 180.636 B |
| `assets/index-q-biCwua.css` | 10.850 B | 3.064 B |
| `index.html` | 6.562 B | 2.591 B |
| **Total** | | **186.291 B** |

Arquivos de origem e peso em tamanho de jogo (convertidos com ffmpeg só para medir; nada foi salvo no
repositório):

| Origem | Medida da origem | Versão de jogo medida | Peso |
|---|---|---|---|
| `docs/art/cover.png` | 2752×1536 PNG, 6,2 MB | 1600 px de largura, WebP q80 | 59.348 B |
| `docs/art/icon.png` | 2048×2048 PNG, 5,2 MB | 192×192 PNG | 42.535 B |
| `docs/sfx/engine-loop.mp3` | 4,017 s, 56 kbps, mono, 44,1 kHz | como está | 70.998 B |
| `docs/sfx/tire-screech.mp3` | 3,019 s, 56 kbps, mono, 44,1 kHz | como está | 44.389 B |
| **Soma** | | | **217.270 B** |

O limite de 300.000 bytes do seed vem dessa soma, com folga.

## Fatos conferidos no código

- `index.html` não declara ícone nem imagem de prévia; o título é "Kartle — Entre na pista".
- O motor é um oscilador sintetizado em `src/audio.ts`; nenhuma história de `230 Output/` o especifica.
- A marca de pneu aparece com velocidade acima de 6 m/s e deslizamento lateral acima de 0,055 rad
  (`src/main.ts`).
- Os testes de camadas de `pista-kart-park` e `race-lap-validation` proíbem `fetch` e afins em
  `src/audio.ts` e `src/main.ts`: os arquivos têm de vir embutidos no pacote.

## Não conferido

- Ninguém ouviu os dois sons ainda (OPEN-02).
- A capa foi vista; o ícone não foi aberto para revisão.
