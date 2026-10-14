// Todos os textos da página. Regras: nada de depoimentos, números de clientes, estatísticas,
// prazos ou promessas que não estejam aqui. Os exemplos numéricos são fictícios e rotulados.
// Trechos entre chaves, como {prazoRaioX}, vêm de src/config.ts.

import type { Variante } from './lib/variante'

export const VARIANTES: Record<Variante, { titulo: string; subtitulo: string }> = {
  a: {
    titulo: 'Veja quanto sobra de cada venda depois dos anúncios',
    subtitulo:
      'O Raio-X de Margem junta comissão, frete, imposto e o gasto com Mercado Ads ou Shopee Ads de cada produto e mostra o lucro que fica por SKU.',
  },
  b: {
    titulo: 'Saiba que preço cobrar e quais produtos pausar',
    subtitulo:
      'O Raio-X de Margem transforma os relatórios que você já exporta em decisões por produto: preço mínimo, SKUs no prejuízo e onde a verba de anúncio rende mais.',
  },
  c: {
    titulo: 'Confira se o marketplace cobrou o valor certo',
    subtitulo:
      'O Raio-X de Margem compara as tarifas, o frete e a armazenagem cobrados com os seus pedidos e lista as diferenças para você conferir.',
  },
}

export const CTA_PRINCIPAL = 'Pedir meu Raio-X gratuito'
export const CTA_CABECALHO = 'Pedir Raio-X'

export const TOPO = {
  nota: 'Sem senha e sem instalar nada. Cada Raio-X é feito à mão, por isso fazemos poucos por semana.',
}

export const RAIO_X = {
  produto: 'Garrafa térmica 1 L',
  precoCentavos: 8990,
  custos: [
    { nome: 'Custo do produto', centavos: 3800 },
    { nome: 'Comissão', centavos: 1169 },
    { nome: 'Frete', centavos: 1990 },
    { nome: 'Imposto', centavos: 719 },
    { nome: 'Anúncio por venda', centavos: 1522 },
  ],
  legenda: 'Exemplo ilustrativo com números fictícios.',
}

export const PROBLEMA = {
  titulo: 'O painel do marketplace mostra quanto você vendeu, não quanto sobrou',
  itens: [
    'Comissão, frete, imposto, devoluções e armazenagem mudam de pedido para pedido.',
    'O gasto com anúncios fica num relatório separado do lucro de cada produto.',
    'Um produto que vende muito pode estar dando prejuízo há meses sem ninguém perceber.',
  ],
}

export const COMO_FUNCIONA = {
  titulo: 'Como funciona',
  passos: [
    {
      titulo: 'Peça o Raio-X.',
      texto: 'Preencha o formulário em 1 minuto. As perguntas servem para saber se o diagnóstico faz sentido para a sua loja.',
    },
    {
      titulo: 'Exporte os relatórios.',
      texto:
        'Mandamos por WhatsApp o passo a passo para baixar os relatórios de vendas, tarifas e anúncios. Você não passa senha e apaga antes as colunas com dados dos compradores.',
    },
    {
      titulo: 'Receba o resultado.',
      texto:
        'Em até {prazoRaioX} você recebe uma planilha com a margem de cada produto, e conversamos por até 30 minutos sobre o que ela mostra.',
    },
  ],
}

export const O_QUE_RECEBE = {
  titulo: 'O que você recebe',
  itens: [
    'Margem de cada SKU depois de custo, comissão, frete, imposto, devoluções e anúncios',
    'Quanto de anúncio cada produto consome por venda',
    'Os produtos e as campanhas que estão dando prejuízo',
  ],
  itemConciliacao: 'Diferenças de tarifa e frete para você conferir com o marketplace',
  legendaTabela: 'Exemplo ilustrativo com números fictícios',
  colunas: ['Produto', 'Vendas no mês', 'Sobra por venda', 'Margem'],
  linhas: [
    { produto: 'Garrafa térmica 1 L', vendas: 412, sobraCentavos: -210, precoCentavos: 8990 },
    { produto: 'Kit 3 potes herméticos', vendas: 268, sobraCentavos: 985, precoCentavos: 6990 },
    { produto: 'Suporte de celular', vendas: 530, sobraCentavos: 440, precoCentavos: 3730 },
    { produto: 'Luminária de mesa', vendas: 97, sobraCentavos: -630, precoCentavos: 12090 },
  ],
}

export const PARA_QUEM = {
  titulo: 'Para quem é',
  sim: {
    titulo: 'É para você se:',
    itens: [
      'vende no Mercado Livre ou na Shopee com CNPJ;',
      'fatura de R$ 50 mil a R$ 1 milhão por mês;',
      'investe em anúncios todo mês;',
      'você ou seu sócio decidem preço e verba de anúncio.',
    ],
  },
  nao: {
    titulo: 'Ainda não é para você se:',
    itens: [
      'está começando e fatura menos de R$ 50 mil por mês;',
      'sua empresa já tem controller ou BI cuidando da margem.',
    ],
  },
}

export const GRATUITO = {
  titulo: 'Por que é gratuito?',
  texto:
    'Estamos construindo uma ferramenta de margem para sellers e queremos aprender com lojas reais antes de programar. Por isso os primeiros Raio-X são feitos à mão e sem custo. Em troca, pedimos 20 minutos da sua opinião sincera sobre o resultado. Não pedimos cartão.',
}

export const FORMULARIO = {
  titulo: 'Peça seu Raio-X de Margem',
  texto: 'Leva 1 minuto. Respondemos pelo WhatsApp em até {prazoResposta}.',
  rotulos: {
    nome: 'Nome',
    email: 'E-mail',
    whatsapp: 'WhatsApp com DDD',
    marketplace: 'Onde você vende?',
    faturamento: 'Faturamento mensal da loja',
    anuncios: 'Você investe em anúncios no marketplace todo mês?',
    ferramenta: 'Onde você controla vendas e custos hoje? (opcional)',
    maior_dor: 'O que mais pesa hoje? (opcional)',
  },
  escolha: 'Escolha uma opção',
  escolhaOpcional: 'Escolha, se quiser',
  consentimentoAntes: 'Aceito receber contato por WhatsApp e e-mail sobre o Raio-X e li a ',
  consentimentoLink: 'Política de privacidade',
  enviando: 'Enviando…',
  notaDados: 'Usamos seus dados só para falar com você sobre o Raio-X. Você pode pedir a exclusão quando quiser.',
  resumoErros: (quantidade: number) =>
    quantidade === 1 ? 'Há 1 campo para corrigir.' : `Há ${quantidade} campos para corrigir.`,
  erroEnvio:
    'Não foi possível enviar seu pedido. Confira sua conexão e tente de novo. Se continuar, escreva para {emailContato}.',
  confirmacaoTitulo: 'Pedido recebido.',
  confirmacaoPerfil: 'Vamos chamar você no WhatsApp em até {prazoResposta} para combinar os relatórios.',
  confirmacaoFora:
    'Por enquanto, o Raio-X atende sellers do Mercado Livre e da Shopee que faturam de R$ 50 mil a R$ 1 milhão por mês e anunciam todo mês. Guardamos seu contato e avisamos quando abrirmos para o seu perfil.',
}

export interface Pergunta {
  pergunta: string
  resposta: string
  quemEstaPorTras?: true
}

export const PERGUNTAS: { titulo: string; itens: Pergunta[] } = {
  titulo: 'Perguntas',
  itens: [
    {
      pergunta: 'Preciso passar minha senha do Mercado Livre ou da Shopee?',
      resposta: 'Não. Você mesmo exporta os relatórios e nos envia.',
    },
    {
      pergunta: 'Quais dados vocês recebem?',
      resposta:
        'Só os relatórios de vendas, tarifas e anúncios da sua loja. Antes de enviar, você apaga as colunas com nome, endereço e documento dos compradores. Os arquivos são apagados ao fim do diagnóstico.',
    },
    { pergunta: 'Quanto custa?', resposta: 'Nada. Nesta fase, o Raio-X é gratuito.' },
    {
      pergunta: 'Vocês são do Mercado Livre ou da Shopee?',
      resposta: 'Não. Somos um projeto independente, sem vínculo com Mercado Livre, Shopee ou Amazon.',
    },
    { pergunta: 'Funciona para a Amazon?', resposta: 'Por enquanto, o Raio-X cobre Mercado Livre e Shopee.' },
    { pergunta: 'Quem está por trás?', resposta: '{nome}, {fraseExperiencia}.', quemEstaPorTras: true },
    {
      pergunta: 'E se a minha loja não estiver no perfil?',
      resposta: 'Você pode deixar o contato mesmo assim. Avisamos quando abrirmos para outros perfis.',
    },
  ],
}

export const RODAPE = {
  aviso:
    'Margem Real é um nome provisório. Projeto independente em fase de testes, sem vínculo com Mercado Livre, Shopee ou Amazon.',
  contato: 'Contato: {emailContato}',
  privacidade: 'Política de privacidade',
}

export const PRIVACIDADE = {
  titulo: 'Política de privacidade',
  atualizacao: 'Última atualização: {dataPublicacao}',
  secoes: [
    {
      titulo: 'Quem cuida dos seus dados',
      texto:
        '{nomeCompleto}, responsável pelo projeto Margem Real (nome provisório). Para qualquer pedido sobre seus dados, escreva para {emailContato}.',
    },
    {
      titulo: 'O que coletamos',
      texto:
        'No formulário, nome, e-mail, WhatsApp, onde você vende, faixa de faturamento, se anuncia e, se você quiser, a ferramenta que usa e o que mais pesa hoje. Também contamos visitas e cliques nesta página sem identificar ninguém, junto com a versão do texto exibida e a origem do link. Não usamos cookies de rastreamento ou de publicidade e não gravamos seu endereço IP nas nossas tabelas; os provedores de hospedagem podem manter registros técnicos de acesso.',
    },
    {
      titulo: 'Para que usamos',
      texto:
        'Para falar com você sobre o Raio-X de Margem, combinar o envio dos relatórios e saber, no total, quais textos desta página funcionam melhor. Não vendemos nem alugamos seus dados.',
    },
    {
      titulo: 'Base legal',
      texto: 'O seu consentimento, dado no formulário. Você pode retirá-lo quando quiser.',
    },
    {
      titulo: 'Com quem compartilhamos',
      texto:
        'Só com os serviços que fazem a página funcionar, que são a hospedagem do site e o banco de dados (Supabase), com servidores na região de São Paulo.',
    },
    {
      titulo: 'Relatórios do Raio-X',
      texto:
        'Os relatórios que você enviar não passam por este site. Combinamos o envio por WhatsApp ou e-mail, usamos os arquivos só no diagnóstico e os apagamos ao final.',
    },
    {
      titulo: 'Por quanto tempo',
      texto: 'Guardamos os dados do formulário até 31/03/2027 ou até você pedir a exclusão, o que vier primeiro.',
    },
    {
      titulo: 'Seus direitos',
      texto:
        'Você pode pedir acesso, correção ou exclusão dos seus dados e retirar o consentimento escrevendo para {emailContato}. Respondemos em até 15 dias.',
    },
    { titulo: 'Mudanças', texto: 'Se esta política mudar, a data acima será atualizada.' },
  ],
  voltar: 'Voltar para a página inicial',
}
