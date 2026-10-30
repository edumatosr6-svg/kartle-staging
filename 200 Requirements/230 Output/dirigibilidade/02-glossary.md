---
title: Glossário — dirigibilidade do Arcade assistido
feature: dirigibilidade
stage: req
status: validated
version: 4.2.0
sources: [SEED, DOMAIN]
---

# Glossário

Os termos valem igualmente em `web-desktop` e `web-mobile`, salvo indicação.

| Termo | Definição | Canal |
|---|---|---|
| Jogador | Quem pilota o kart com teclado (`web-desktop`) ou com inclinação e toque (`web-mobile`) | ambos |
| Piloto de teste | Sequência determinística de comandos binários executada por `npm run bench:handling` na pista sintética; régua de regressão desta feature | nenhum (bench) |
| Acerto | Preset de kart (massa, pneu, motor) e conjunto de assistências usados numa volta (I8) | ambos |
| Arcade assistido | Acerto padrão do jogo, objeto desta feature; usa assistências de direção, frenagem e amortecimento de derrapagem | ambos |
| Acerto C | Acerto Arcade assistido escolhido pelo dono do produto em 2026-10-29 entre as prévias publicadas na staging, nomeado `arcade-assistido-v6` na decisão; é a nova versão do Arcade assistido que esta feature entrega (`DOMAIN/DEC-15`) | ambos |
| Realista — aluguel 4T | Acerto sem assistências arcade, referência física documentada; não muda nesta feature (`SEED/RE-03`) | ambos |
| Versão do acerto | Identificador declarado no dado publicado que distingue o acerto novo do anterior; tempos e replays de versões diferentes não são comparáveis (`SEED/IM-I3I5`) | ambos |
| Assistências | Regras do acerto Arcade que modulam o `Input` ou o estado dentro da simulação: direção proporcional à velocidade, frenagem equilibrada, amortecimento de derrapagem (`SEED.md`, Contexto) | ambos |
| `Input` | Entrada normalizada que todo adaptador de controle entrega à simulação; seu significado não muda (I8) | ambos |
| Esterço | Componente de direção do `Input`, de −1 a 1; esterço cheio é 1 (ou −1) em módulo | ambos |
| Entrada binária | Esterço e acelerador que só assumem 0 ou valor cheio; é o que o teclado produz e o que o piloto de teste usa | `web-desktop`; toque em `web-mobile` |
| Entrada proporcional | Esterço que assume qualquer valor entre −1 e 1; é o que a inclinação produz | `web-mobile` |
| Sensor de inclinação | Sensor do celular que alimenta o esterço proporcional; ausente ou com permissão negada, o controle recai para toque com estado visível (I4) | `web-mobile` |
| Tempo simulado | Tempo medido em passos de `STEP` no estado da simulação; nunca o relógio de parede (I8, I9) | ambos |
| `STEP` | Passo fixo da simulação, com solver de 480 Hz; não muda nesta feature (`SEED/RE-02`) | ambos |
| Ensaio | Sequência determinística de estado inicial, ambiente, `Input` por passo e medição, executada em `npm test` ou nos benches, com parâmetros e resultados registrados em `docs/physics.md` (I9) | nenhum (bench) |
| Pista de teste | Ambiente de ensaio próprio, separado da pista sintética e de qualquer pista publicada, sem faixa e sem paredes (pista de teste aberta), usada pela resposta do volante — com partida em reta —, pelo raio e giro em curva e pela recuperação da traseira. O Jogador não pilota nela (`SEED/RD-06`, `DOMAIN/REF-03`, `DOMAIN/DEC-15`) | nenhum (bench) |
| Pista de teste aberta | Pista de teste sem faixa e sem paredes: superfície de asfalto em toda a área do ensaio, de modo que o kart não sai do asfalto nem encontra parede (`SEED/US-2`, `SEED/US-3`) | nenhum (bench) |
| Pista sintética | Pista de teste atual do piloto de teste (`npm run bench:handling`); os seus raios mínimos de curva são 24 m e 25 m, com um grampo de 4 m. Só a volta do piloto de teste a usa: tempo de volta (US-0005) e condução normal (US-0003) (`SEED/RD-06`, `SEED/US-3`) | ambos |
| Linha de base | Valor medido pelo mesmo ensaio, no mesmo ambiente, com o acerto Arcade assistido anterior a esta feature, registrado em `docs/physics.md`; é o "hoje" do seed | nenhum (bench) |
| Taxa de guinada | Velocidade angular do kart em torno do eixo vertical, no estado da simulação, em rad/s | ambos |
| Velocidade mantida | Condição de ensaio em que a velocidade do kart é mantida num valor constante, em vez de decair com o esterço aplicado: em 50 km/h pelo acelerador durante todo o ensaio de resposta do volante (`DOMAIN/REF-03`). O modo de manter é parâmetro de ensaio registrado em `docs/physics.md` | nenhum (bench) |
| Regime da taxa de guinada | Valor estabilizado que a taxa de guinada atinge com esterço cheio mantido a partir de reta na pista de teste aberta, com a velocidade mantida em 50 km/h; é medido numa janela curta e estacionária (velocidade constante), nunca num valor que deriva com a desaceleração; o ensaio registra a janela usada (NFR-0004) | ambos |
| Resposta do volante | Tempo simulado entre a aplicação do esterço cheio e o instante em que a taxa de guinada atinge 90 % do regime; e, ao soltar, entre o esterço voltar a 0 e a taxa cair a 10 % do regime (`DOMAIN/DEC-01`) | ambos |
| Raio da trajetória | Raio de curvatura do caminho que o centro do kart percorre, em m, no estado da simulação: a velocidade dividida pela taxa de variação da direção do movimento. É medido num instante do ensaio, numa janela curta em torno dele cuja duração é parâmetro do ensaio registrado em `docs/physics.md` (NFR-0004) | ambos |
| Giro | Variação acumulada do rumo do kart (a direção para a qual o kart aponta, em torno do eixo vertical), em graus, no estado da simulação, contada a partir do passo da partida do ensaio; o giro de 180° deixa o kart apontando para o lado oposto ao da partida (`SEED/US-2`, `DOMAIN/DEC-16`) | ambos |
| Curva de referência | Ensaio de curva da pista de teste aberta: o kart parte em linha reta a 50 km/h ou a 70 km/h, com esterço cheio aplicado desde o primeiro passo e mantido; com acelerador cheio, o raio da trajetória é medido 3 s depois da partida; sem acelerador, partindo de 50 km/h, mede-se o giro em até 2 s (`SEED/US-2`, `DOMAIN/DEC-15`, `DOMAIN/DEC-16`). Não é segmento da pista sintética nem o antigo arco de raio 18 m | nenhum (bench) |
| Estado de aderência | Campo da telemetria da simulação com um de quatro valores: `grip`, `understeer`, `oversteer`, `sliding` | ambos |
| Telemetria | Campos do estado da simulação lidos por passo pelos ensaios e pelo HUD: velocidade, estado de aderência, derrapagem lateral, taxa de guinada | ambos |
| Subesterço (`understeer`) | O kart faz raio maior que o pedido pelo esterço: "sai de frente" | ambos |
| Sobre-esterço (`oversteer`) | A traseira perde aderência antes da frente: "traseira solta" | ambos |
| Derrapagem (`sliding`) | Os dois eixos sem aderência | ambos |
| Derrapagem lateral | Ângulo entre a direção do kart e a direção do seu movimento, em rad, no estado da simulação | ambos |
| Condição de forçar | Acelerador cheio e esterço cheio com velocidade acima de 50 km/h (`SEED/US-3`); é o que solta a traseira no ensaio de recuperação da pista de teste aberta | ambos |
| Recuperação | Os passos entre o passo em que o esterço é levado de 1 a 0 com a traseira solta sob a condição de forçar e o primeiro passo em que a telemetria volta a `grip`; dura no máximo 400 ms (`DOMAIN/DEC-04`, `SEED/US-3` segundo critério) | ambos |
| Condução normal | A condução que o seed manda observar na volta do piloto de teste na pista sintética (`SEED/US-3`, primeiro critério): todos os passos dessa volta | nenhum (bench) |
| Drift | Manobra de `requirements/11` — carga segurando a tecla de drift, mini-turbo, combo e pontuação — retirada por esta feature (`SEED/RD-01`, `DOMAIN/DEC-15`) | ambos |
| Turbo | Impulso de velocidade acima da velocidade estabilizada, como o mini-turbo do drift; não existe com esta feature (`SEED/US-3`, `DOMAIN/DEC-15`) | ambos |
| Comando de drift | A tecla de drift em `web-desktop`, ou o controle de drift que o adaptador de toque entregue em `web-mobile`; mantido ou não, não muda o estado da simulação (`SEED/US-3`) | ambos |
| Direção comum | Pilotar a volta com esterço, acelerador e freio, sem manobra especial; permanece fácil (`SEED/RD-01`) | ambos |
| Velocidade estabilizada | Velocidade em reta com acelerador cheio mantido, após deixar de crescer; medida no estado da simulação. É a velocidade máxima do kart, a mesma em qualquer situação (`SEED/US-3`, `SEED/US-4`) | ambos |
| Grama | Superfície fora do asfalto que reduz a velocidade do kart | ambos |
| Parede | Limite sólido da pista cujo contato reduz a velocidade do kart | ambos |
| Asfalto | Superfície da pista, ou a da pista de teste; "sair do asfalto" é qualquer passo em que o kart está fora dela | ambos |
| HUD | Elementos de tela que exibem a velocidade e o estado de aderência durante a volta; já existem e não regridem | ambos |
| `trackVersion` | Versão do dado de pista; o seed admite que a nova versão de acerto seja declarada por ela ou por versão própria de acerto (`SEED/US-5`) | ambos |
| Staging | Publicação de uma rodada de código para o teste do dono do produto no ciclo de fechamento humano (`DOMAIN/DEC-10`); não é critério de aceite desta etapa | ambos |
