# Questionário clínico premium — design

## Objetivo

Refatorar a interface do Questionário de Inflamação e Risco Mental para uma experiência clara, sofisticada e responsiva, preservando integralmente a lógica clínica existente: nomes atuais, perguntas, pontuações, faixas, envio e geração de PDF.

## Direção visual

O produto adotará uma estética clínica premium em modo claro. A base terá branco suave e azul muito claro; azul-marinho comunicará autoridade, azul-petróleo/verde indicará ações e sucesso, e dourado aparecerá apenas em detalhes de alto valor visual. Não haverá modo escuro neste escopo.

Glassmorphism será usado apenas em superfícies de contexto, como o cabeçalho, o contêiner de progresso e cards de resultado. Perguntas, campos de dados e controles de resposta permanecerão em superfícies opacas de alto contraste para preservar legibilidade, confiança e acessibilidade.

As interações serão feitas com CSS nativo: elevação e brilho sutis em botões, transições curtas entre etapas e seleção em formato pill para respostas. Não serão adicionadas bibliotecas de animação ou efeitos pesados de terceiros.

## Experiência

- O cabeçalho passa a apresentar marca textual do profissional e uma descrição breve do questionário.
- A navegação mostra as quatro etapas nomeadas: Dados, Inflamação, Risco Mental e Resultado.
- Em desktop, as perguntas serão apresentadas em cartões compactos; em telas pequenas, os controles terão tamanho confortável para toque e fluxo vertical.
- Os botões primários terão rótulo contextual: Continuar, Ver resultados e Enviar resultados. O botão de voltar continua visualmente secundário.
- Os resultados usarão cards de maior destaque visual, com cores coerentes com cada nível, sem alterar nomes ou limites dos níveis.
- Estados de foco, seleção, carregamento e erro terão feedback visível, sem depender apenas de cor.

## Arquitetura e refatoração

1. `src/logic.js` continuará sendo a fonte das perguntas e dos cálculos. A semântica dos itens, os nomes exportados e as faixas não serão alterados.
2. `src/dom.js` será dividido em responsabilidades explícitas: criação de campos, exibição de resultados e renderização da etapa atual. A renderização receberá o número total de etapas de forma confiável, corrigindo a navegação atual.
3. `src/main.js` ficará responsável por manter o estado da etapa, coordenar eventos e montar os dados para cálculo/envio. A coleta de respostas seguirá usando os índices atuais para não quebrar o PDF nem a planilha.
4. Estilos próprios serão separados do HTML para formar um pequeno sistema de design com tokens de cor, sombra, raio, espaçamento e transição. O Tailwind existente poderá continuar para utilitários de layout, sem nova dependência.
5. O endpoint e o formato enviados à planilha não serão modificados neste escopo.

## Comportamento preservado

- 72 respostas de inflamação, em escala 0–4, com os mesmos cálculos e classificações atuais.
- 31 itens de risco mental, em escala binária, com os mesmos cálculos e classificações atuais.
- Validação obrigatória de cada etapa, geração de PDF e envio por proxy.
- Conteúdo textual existente e a terminologia atualmente exibida.

## Testes e verificação

- Ampliar testes de cálculo para todos os valores de fronteira: 9/10, 49/50 e 99/100 para inflamação; 0/1, 9/10 e 20/21 para risco mental.
- Extrair e testar uma função pura que descreva o estado da navegação por etapa, garantindo que a última etapa esconda a navegação e que a etapa anterior exiba “Ver resultados”.
- Executar a suíte de testes e o build de produção após cada alteração relevante.
- Conferir manualmente o fluxo em tela pequena e grande durante a implementação.

## Fora de escopo

- Alterar regras clínicas, perguntas, pontuações ou unidades descritas no material da pós-graduação.
- Adicionar autenticação, alterar o Apps Script ou mudar o destino dos dados.
- Modo escuro, animações com JavaScript, vídeo de fundo ou bibliotecas externas de efeitos.
