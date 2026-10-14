# Prompt original da página (versão para o Lovable)

Este é o prompt da Fase 17 que especificou a página. O código deste repositório implementa o
mesmo pedido; para mudar textos aqui, edite `src/conteudo.ts` e `src/config.ts`.

Ele continua útil se você preferir gerar a página num gerador com IA como o Lovable: crie o
projeto Supabase, rode `supabase/schema.sql`, conecte o seu Supabase no Lovable (recuse o Lovable
Cloud), troque os campos entre colchetes e cole o bloco abaixo inteiro numa única mensagem.

Diferença em relação ao prompt: o código grava direto na API REST do Supabase com `fetch`, sem a
biblioteca supabase-js, e carrega as fontes junto do site em vez de buscá-las no Google Fonts.

```text
Crie uma página de validação em português do Brasil para testar o interesse de sellers num serviço chamado Raio-X de Margem. A marca tem o nome provisório Margem Real. É uma página única e rolável, mais uma página de privacidade. Não é o produto: não crie login, painel, área do cliente nem pagamentos.

OBJETIVO
1. Descobrir qual de três posicionamentos leva mais sellers a pedir o Raio-X.
2. Captar contatos de sellers do perfil para diagnósticos gratuitos feitos à mão.
Quem visita: donos de lojas no Mercado Livre e na Shopee que faturam de R$ 50 mil a R$ 1 milhão por mês e investem em anúncios. A maioria chega pelo celular, vinda de grupos de WhatsApp, do Instagram e de comunidades de sellers.

REGRAS DE CONTEÚDO (obrigatórias)
- Use exatamente os textos deste pedido. Pode ajustar quebras de linha, nunca o sentido.
- Não crie depoimentos, avaliações, notas, logotipos de clientes ou parceiros, contadores de usuários, selos, estatísticas, porcentagens de resultado, prazos ou preços que não estejam aqui.
- Não prometa aumento de lucro, economia nem recuperação de dinheiro.
- Não use logotipos nem cores de marca do Mercado Livre, da Shopee ou da Amazon. Cite os nomes só em texto.
- Sem fotos de banco de imagens, ilustrações de pessoas, emojis ou ícones decorativos.
- Se sobrar algum texto entre colchetes, deixe-o visível com fundo amarelo para eu corrigir.

TRÊS VERSÕES DO TOPO
Se a URL tiver ?v=a, ?v=b ou ?v=c, use essa versão. Sem o parâmetro, use a letra guardada no localStorage (chave mr_variante) ou, se não houver, sorteie uma das três com chances iguais. Guarde a letra usada no localStorage, sempre com try/catch, para o visitante ver sempre a mesma versão. Só o título e o subtítulo mudam; o resto da página é igual nas três.

Versão a
Título: Veja quanto sobra de cada venda depois dos anúncios
Subtítulo: O Raio-X de Margem junta comissão, frete, imposto e o gasto com Mercado Ads ou Shopee Ads de cada produto e mostra o lucro que fica por SKU.

Versão b
Título: Saiba que preço cobrar e quais produtos pausar
Subtítulo: O Raio-X de Margem transforma os relatórios que você já exporta em decisões por produto: preço mínimo, SKUs no prejuízo e onde a verba de anúncio rende mais.

Versão c
Título: Confira se o marketplace cobrou o valor certo
Subtítulo: O Raio-X de Margem compara as tarifas, o frete e a armazenagem cobrados com os seus pedidos e lista as diferenças para você conferir.

SEÇÕES, NESTA ORDEM
1. Cabeçalho: "Margem Real" escrito em texto, sem logotipo desenhado; links "Como funciona" e "Perguntas"; botão "Pedir Raio-X", que rola até o formulário.

2. Topo: título e subtítulo da versão; botão "Pedir meu Raio-X gratuito"; abaixo dele, em texto pequeno: "Sem senha e sem instalar nada. Cada Raio-X é feito à mão, por isso fazemos poucos por semana." Ao lado do texto (abaixo dele, no celular), o raio-x do preço descrito em VISUAL.

3. O problema
Título: O painel do marketplace mostra quanto você vendeu, não quanto sobrou
Três itens:
- Comissão, frete, imposto, devoluções e armazenagem mudam de pedido para pedido.
- O gasto com anúncios fica num relatório separado do lucro de cada produto.
- Um produto que vende muito pode estar dando prejuízo há meses sem ninguém perceber.

4. Como funciona (é uma sequência; pode numerar 1, 2 e 3)
1) Peça o Raio-X. Preencha o formulário em 1 minuto. As perguntas servem para saber se o diagnóstico faz sentido para a sua loja.
2) Exporte os relatórios. Mandamos por WhatsApp o passo a passo para baixar os relatórios de vendas, tarifas e anúncios. Você não passa senha e apaga antes as colunas com dados dos compradores.
3) Receba o resultado. Em até [PRAZO DO RAIO-X] você recebe uma planilha com a margem de cada produto, e conversamos por até 30 minutos sobre o que ela mostra.

5. O que você recebe
- Margem de cada SKU depois de custo, comissão, frete, imposto, devoluções e anúncios
- Quanto de anúncio cada produto consome por venda
- Os produtos e as campanhas que estão dando prejuízo
- Diferenças de tarifa e frete para você conferir com o marketplace
Abaixo da lista, uma tabela pequena com a legenda "Exemplo ilustrativo com números fictícios":
Produto | Vendas no mês | Sobra por venda | Margem
Garrafa térmica 1 L | 412 | −R$ 2,10 | −2,3%
Kit 3 potes herméticos | 268 | R$ 9,85 | 14,1%
Suporte de celular | 530 | R$ 4,40 | 11,8%
Luminária de mesa | 97 | −R$ 6,30 | −5,2%
Valores negativos na cor Prejuízo e positivos na cor Lucro, alinhados à direita.

6. Para quem é (duas colunas no desktop, uma abaixo da outra no celular)
É para você se:
- vende no Mercado Livre ou na Shopee com CNPJ;
- fatura de R$ 50 mil a R$ 1 milhão por mês;
- investe em anúncios todo mês;
- você ou seu sócio decidem preço e verba de anúncio.
Ainda não é para você se:
- está começando e fatura menos de R$ 50 mil por mês;
- sua empresa já tem controller ou BI cuidando da margem.

7. Por que é gratuito?
Estamos construindo uma ferramenta de margem para sellers e queremos aprender com lojas reais antes de programar. Por isso os primeiros Raio-X são feitos à mão e sem custo. Em troca, pedimos 20 minutos da sua opinião sincera sobre o resultado. Não pedimos cartão.

8. Formulário, com a âncora #pedir (detalhes em FORMULÁRIO).

9. Perguntas, em acordeão acessível:
- Preciso passar minha senha do Mercado Livre ou da Shopee? Não. Você mesmo exporta os relatórios e nos envia.
- Quais dados vocês recebem? Só os relatórios de vendas, tarifas e anúncios da sua loja. Antes de enviar, você apaga as colunas com nome, endereço e documento dos compradores. Os arquivos são apagados ao fim do diagnóstico.
- Quanto custa? Nada. Nesta fase, o Raio-X é gratuito.
- Vocês são do Mercado Livre ou da Shopee? Não. Somos um projeto independente, sem vínculo com Mercado Livre, Shopee ou Amazon.
- Funciona para a Amazon? Por enquanto, o Raio-X cobre Mercado Livre e Shopee.
- Quem está por trás? [SEU NOME], [UMA FRASE SOBRE SUA EXPERIÊNCIA].
- E se a minha loja não estiver no perfil? Você pode deixar o contato mesmo assim. Avisamos quando abrirmos para outros perfis.

10. Rodapé, em três linhas:
Margem Real é um nome provisório. Projeto independente em fase de testes, sem vínculo com Mercado Livre, Shopee ou Amazon.
Contato: [E-MAIL DE CONTATO]
Política de privacidade (link para /privacidade)

FORMULÁRIO
Título: Peça seu Raio-X de Margem
Texto: Leva 1 minuto. Respondemos pelo WhatsApp em até [PRAZO DE RESPOSTA].
Campos, cada um com rótulo visível acima:
- Nome (obrigatório)
- E-mail (obrigatório)
- WhatsApp com DDD (obrigatório; máscara (11) 91234-5678, que aceita só DDD e número)
- Onde você vende? (obrigatório): Mercado Livre | Shopee | Mercado Livre e Shopee | Só Amazon | Só loja própria ou outros
- Faturamento mensal da loja (obrigatório): Menos de R$ 50 mil | R$ 50 a 200 mil | R$ 200 a 500 mil | R$ 500 mil a 1 milhão | Mais de R$ 1 milhão
- Você investe em anúncios no marketplace todo mês? (obrigatório): Sim | Não
- Onde você controla vendas e custos hoje? (opcional): Planilha | Bling | UpSeller | Tiny (Olist) | Base | Outro ERP | Nenhuma
- O que mais pesa hoje? (opcional): Custo de anúncio por produto | Saber que preço cobrar e o que pausar | Cobranças erradas do marketplace | Impostos e reforma tributária | Outro
- Caixa de consentimento, desmarcada e obrigatória: "Aceito receber contato por WhatsApp e e-mail sobre o Raio-X e li a Política de privacidade." (com link para /privacidade)
- Campo-armadilha para robôs, chamado armadilha: fora da tela, com aria-hidden, tabindex -1 e autocomplete off. Pessoas nunca o veem.
Botão: Pedir meu Raio-X gratuito
Abaixo do botão: "Usamos seus dados só para falar com você sobre o Raio-X. Você pode pedir a exclusão quando quiser."
Erros, junto do campo:
- Nome: Informe seu nome.
- E-mail: Informe um e-mail válido, como nome@empresa.com.br.
- WhatsApp: Informe o WhatsApp com DDD, como (11) 91234-5678.
- Listas: Escolha uma opção.
- Consentimento: Marque a caixa para podermos falar com você.
Durante o envio, desative o botão e mostre "Enviando…". Se o envio falhar, mantenha o que foi digitado e mostre: "Não foi possível enviar seu pedido. Confira sua conexão e tente de novo. Se continuar, escreva para [E-MAIL DE CONTATO]."
Depois do envio, troque o formulário pela confirmação:
- Para quem vende no Mercado Livre, na Shopee ou nos dois, fatura de R$ 50 mil a R$ 1 milhão e anuncia todo mês: "Pedido recebido. Vamos chamar você no WhatsApp em até [PRAZO DE RESPOSTA] para combinar os relatórios."
- Para os demais: "Pedido recebido. Por enquanto, o Raio-X atende sellers do Mercado Livre e da Shopee que faturam de R$ 50 mil a R$ 1 milhão por mês e anunciam todo mês. Guardamos seu contato e avisamos quando abrirmos para o seu perfil."
Use aria-live para que leitores de tela anunciem os erros e a confirmação.

PÁGINA /privacidade (texto exato)
Título: Política de privacidade
Última atualização: [DATA DE PUBLICAÇÃO]
Quem cuida dos seus dados: [SEU NOME COMPLETO], responsável pelo projeto Margem Real (nome provisório). Para qualquer pedido sobre seus dados, escreva para [E-MAIL DE CONTATO].
O que coletamos: no formulário, nome, e-mail, WhatsApp, onde você vende, faixa de faturamento, se anuncia e, se você quiser, a ferramenta que usa e o que mais pesa hoje. Também contamos visitas e cliques nesta página sem identificar ninguém, junto com a versão do texto exibida e a origem do link. Não usamos cookies de rastreamento ou de publicidade e não gravamos seu endereço IP nas nossas tabelas; os provedores de hospedagem podem manter registros técnicos de acesso.
Para que usamos: para falar com você sobre o Raio-X de Margem, combinar o envio dos relatórios e saber, no total, quais textos desta página funcionam melhor. Não vendemos nem alugamos seus dados.
Base legal: o seu consentimento, dado no formulário. Você pode retirá-lo quando quiser.
Com quem compartilhamos: só com os serviços que fazem a página funcionar, que são a hospedagem do site e o banco de dados (Supabase), com servidores na região de São Paulo.
Relatórios do Raio-X: os relatórios que você enviar não passam por este site. Combinamos o envio por WhatsApp ou e-mail, usamos os arquivos só no diagnóstico e os apagamos ao final.
Por quanto tempo: guardamos os dados do formulário até 31/03/2027 ou até você pedir a exclusão, o que vier primeiro.
Seus direitos: você pode pedir acesso, correção ou exclusão dos seus dados e retirar o consentimento escrevendo para [E-MAIL DE CONTATO]. Respondemos em até 15 dias.
Mudanças: se esta política mudar, a data acima será atualizada.
No fim, o link "Voltar para a página inicial".

VISUAL
Conceito: um laudo técnico bem diagramado, sóbrio e direto, e não um anúncio. Todo o texto alinhado à esquerda.
Cores (use só estas):
- Papel #F6F8F9, fundo
- Tinta #13212C, texto e botões
- Filme #DDE7ED, painéis
- Grade #C3D1DA, bordas e divisões
- Prejuízo #B42318, só valores negativos
- Lucro #1E6B50, valores positivos e contorno de foco
Tipografia (Google Fonts): Archivo 600 e 700 nos títulos e números; Atkinson Hyperlegible 400 e 700 no texto. Números sempre com algarismos tabulares (font-variant-numeric: tabular-nums). Tamanhos: título principal com 40 px no celular e 56 px no desktop; títulos de seção com 28 e 36 px; texto com 17 e 18 px e entrelinha 1,55; legendas com 14 px. Linhas de texto com até 66 caracteres.
Layout: largura máxima de 1.120 px. No desktop, o topo tem duas colunas: texto à esquerda (55%) e o raio-x à direita (45%). No celular, uma coluna. Seções separadas por espaço generoso, sem grades de cards.
O raio-x do preço é o único elemento ousado da página: um painel com fundo Filme e borda Grade sobre um produto fictício.
- No alto do painel: "Garrafa térmica 1 L" e "Preço de venda R$ 89,90".
- Uma barra horizontal representa o preço (100%), com 90% da largura do painel para caber o excedente. Ela é dividida em segmentos com 2 px de espaço entre eles: Custo do produto 42,3%; Comissão 13,0%; Frete 22,1%; Imposto 8,0%; Anúncio 16,9%. A soma dá 102,3%: o trecho depois de uma linha vertical marcada "preço de venda" fica na cor Prejuízo.
- Segmentos em tons de Tinta com opacidades diferentes, do mais claro ao mais escuro.
- Abaixo da barra, uma linha por custo, com uma amostra da cor do segmento e o valor alinhado à direita: Custo do produto −R$ 38,00; Comissão −R$ 11,69; Frete −R$ 19,90; Imposto −R$ 7,19; Anúncio por venda −R$ 15,22. Depois de uma linha divisória: "Sobra por venda −R$ 2,10", na cor Prejuízo. Embaixo, menor: "Sem o anúncio, sobrariam R$ 13,12."
- Legenda fixa no painel: "Exemplo ilustrativo com números fictícios."
- A página tem uma única animação: ao carregar, os segmentos crescem da esquerda para a direita em cerca de 1,2 s, e o trecho vermelho aparece por último. Com prefers-reduced-motion, mostre tudo parado.
Detalhes:
- Botões com fundo Tinta, texto branco, altura mínima de 48 px e cantos de 6 px. Foco visível com contorno de 3 px na cor Lucro.
- Bordas de 1 px na cor Grade e cantos de 6 px em painéis e campos. Sem sombras e sem gradientes.
- Não use rótulos em caixa alta, uma palavra do título em outra cor, setas nos botões, pontos médios separando textos nem animações de entrada nas seções.
- No celular, depois que o topo sair da tela, mostre uma barra fixa no rodapé com o botão "Pedir meu Raio-X gratuito". Esconda a barra quando o formulário estiver visível.
- Contraste mínimo AA, navegação completa por teclado e nenhuma rolagem horizontal a partir de 360 px de largura.

DADOS (Supabase já conectado; não use o Lovable Cloud)
As tabelas já existem. Não crie migrações nem altere tabelas, colunas ou políticas. Se faltar algo no banco, pare e me diga o que é.
Use o cliente supabase-js com a chave pública do projeto. Nunca coloque no código a chave secreta (service_role).
O visitante só tem permissão para inserir. Por isso, faça o insert sem .select() e sem pedir o registro de volta; com .select(), o envio falha.
Tabela public.leads. Colunas que o site envia:
- variante: 'a', 'b' ou 'c'
- nome: sem espaços nas pontas, de 2 a 120 caracteres
- email: em minúsculas, sem espaços, até 160 caracteres
- whatsapp: só dígitos, com 55 antes do DDD (ex.: 5511912345678)
- marketplace, faturamento e anuncios: exatamente o texto da opção escolhida
- ferramenta e maior_dor: o texto da opção, ou null se ficar em branco (nunca texto vazio)
- consentimento: true
- utm_source, utm_medium e utm_campaign: os valores da URL, ou null
- referencia: só o domínio de document.referrer quando vier de outro site, ou null
- armadilha: o valor do campo-armadilha (vazio para pessoas)
Não envie id, criado_em nem perfil_provavel; o banco preenche essas colunas.
Tabela public.eventos. Colunas: tipo ('visita', 'clique_cta' ou 'inicio_formulario'), variante, utm_source, utm_medium, utm_campaign e referencia.
- 'visita': uma vez por sessão do navegador, ao abrir a página.
- 'clique_cta': uma vez por sessão, no primeiro clique num botão que leva ao formulário.
- 'inicio_formulario': uma vez por sessão, quando a pessoa entra no primeiro campo.
Controle o "uma vez por sessão" com sessionStorage (com try/catch). Guarde os parâmetros utm da primeira página da sessão no sessionStorage e reaproveite-os no envio do formulário. Não registre eventos se navigator.webdriver for verdadeiro ou se o user agent indicar robô (bot, crawler, spider). Os eventos não podem atrasar nem travar a página; ignore as falhas deles.
Não adicione Google Analytics, Meta Pixel, chat, cookies nem outros scripts de terceiros.

TÉCNICO
- Rotas: / e /privacidade. Qualquer outro endereço leva para /.
- <html lang="pt-BR">. Título da aba: "Raio-X de Margem para sellers do Mercado Livre e da Shopee". Meta description: "Veja a margem de cada produto depois de comissão, frete, imposto e anúncios. Diagnóstico gratuito, feito à mão, para sellers do Mercado Livre e da Shopee."
- <meta name="robots" content="noindex"> enquanto a página estiver em teste.
- Imagem de compartilhamento simples: fundo Papel com "Raio-X de Margem" em Tinta, sem fotos.

ANTES DE TERMINAR, CONFIRA
1. ?v=a, ?v=b e ?v=c mostram os três títulos; sem o parâmetro, a versão sorteada se mantém ao recarregar.
2. O formulário não envia sem os campos obrigatórios nem sem o consentimento.
3. Um envio grava uma linha em leads sem usar .select(), e aparece a confirmação certa para quem está e para quem não está no perfil.
4. A página não tem depoimentos, números, prazos ou promessas além dos deste pedido, nem logotipos de marketplaces.
5. Tudo funciona com 360 px de largura, pelo teclado e com movimento reduzido.
6. /privacidade abre pelo rodapé e pelo link do consentimento.
```
