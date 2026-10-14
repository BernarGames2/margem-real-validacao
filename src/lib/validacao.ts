import type { Atribuicao } from './atribuicao'
import type { Variante } from './variante'

// As opções abaixo precisam bater, letra por letra, com as restrições de supabase/schema.sql.
export const MARKETPLACES = [
  'Mercado Livre',
  'Shopee',
  'Mercado Livre e Shopee',
  'Só Amazon',
  'Só loja própria ou outros',
] as const
export const FATURAMENTOS = [
  'Menos de R$ 50 mil',
  'R$ 50 a 200 mil',
  'R$ 200 a 500 mil',
  'R$ 500 mil a 1 milhão',
  'Mais de R$ 1 milhão',
] as const
export const RESPOSTAS_ANUNCIO = ['Sim', 'Não'] as const
export const FERRAMENTAS = [
  'Planilha',
  'Bling',
  'UpSeller',
  'Tiny (Olist)',
  'Base',
  'Outro ERP',
  'Nenhuma',
] as const
export const DORES = [
  'Custo de anúncio por produto',
  'Saber que preço cobrar e o que pausar',
  'Cobranças erradas do marketplace',
  'Impostos e reforma tributária',
  'Outro',
] as const

const MARKETPLACES_PERFIL: readonly string[] = ['Mercado Livre', 'Shopee', 'Mercado Livre e Shopee']
const FATURAMENTOS_PERFIL: readonly string[] = ['R$ 50 a 200 mil', 'R$ 200 a 500 mil', 'R$ 500 mil a 1 milhão']

export const MENSAGENS = {
  nome: 'Informe seu nome.',
  email: 'Informe um e-mail válido, como nome@empresa.com.br.',
  whatsapp: 'Informe o WhatsApp com DDD, como (11) 91234-5678.',
  lista: 'Escolha uma opção.',
  consentimento: 'Marque a caixa para podermos falar com você.',
} as const

export interface DadosFormulario {
  nome: string
  email: string
  whatsapp: string
  marketplace: string
  faturamento: string
  anuncios: string
  ferramenta: string
  maior_dor: string
  consentimento: boolean
  armadilha: string
}

export type Campo = keyof DadosFormulario
export type Erros = Partial<Record<Campo, string>>

export const ORDEM_DOS_CAMPOS: Campo[] = [
  'nome',
  'email',
  'whatsapp',
  'marketplace',
  'faturamento',
  'anuncios',
  'ferramenta',
  'maior_dor',
  'consentimento',
]

export const FORMULARIO_VAZIO: DadosFormulario = {
  nome: '',
  email: '',
  whatsapp: '',
  marketplace: '',
  faturamento: '',
  anuncios: '',
  ferramenta: '',
  maior_dor: '',
  consentimento: false,
  armadilha: '',
}

const RE_EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
const RE_WHATSAPP = /^55[1-9]{2}[0-9]{8,9}$/

const contem = (lista: readonly string[], valor: string) => lista.includes(valor)

export function limparNome(nome: string): string {
  return nome.trim().replace(/\s+/g, ' ')
}

export function nomeValido(nome: string): boolean {
  const limpo = limparNome(nome)
  return limpo.length >= 2 && limpo.length <= 120
}

export function limparEmail(email: string): string {
  return email.trim().toLowerCase()
}

export function emailValido(email: string): boolean {
  const limpo = limparEmail(email)
  return limpo.length <= 160 && RE_EMAIL.test(limpo)
}

export function digitos(valor: string): string {
  return valor.replace(/\D/g, '')
}

/** Máscara (11) 91234-5678 enquanto a pessoa digita; aceita só DDD e número. */
export function mascararWhatsapp(valor: string): string {
  const d = digitos(valor).slice(0, 11)
  if (d.length === 0) return ''
  if (d.length <= 2) return `(${d}`
  const ddd = d.slice(0, 2)
  const resto = d.slice(2)
  if (resto.length <= 4) return `(${ddd}) ${resto}`
  const corte = resto.length === 9 ? 5 : 4
  return `(${ddd}) ${resto.slice(0, corte)}-${resto.slice(corte)}`
}

/** DDD + número viram 55 + DDD + número, como o banco exige. */
export function normalizarWhatsapp(valor: string): string | null {
  const d = digitos(valor)
  if (d.length !== 10 && d.length !== 11) return null
  const completo = `55${d}`
  return RE_WHATSAPP.test(completo) ? completo : null
}

/** Mesma regra da coluna perfil_provavel do banco: 3 dos 5 critérios do perfil. */
export function perfilProvavel(marketplace: string, faturamento: string, anuncios: string): boolean {
  return contem(MARKETPLACES_PERFIL, marketplace) && contem(FATURAMENTOS_PERFIL, faturamento) && anuncios === 'Sim'
}

export function validar(dados: DadosFormulario): Erros {
  const erros: Erros = {}
  if (!nomeValido(dados.nome)) erros.nome = MENSAGENS.nome
  if (!emailValido(dados.email)) erros.email = MENSAGENS.email
  if (!normalizarWhatsapp(dados.whatsapp)) erros.whatsapp = MENSAGENS.whatsapp
  if (!contem(MARKETPLACES, dados.marketplace)) erros.marketplace = MENSAGENS.lista
  if (!contem(FATURAMENTOS, dados.faturamento)) erros.faturamento = MENSAGENS.lista
  if (!contem(RESPOSTAS_ANUNCIO, dados.anuncios)) erros.anuncios = MENSAGENS.lista
  if (dados.ferramenta && !contem(FERRAMENTAS, dados.ferramenta)) erros.ferramenta = MENSAGENS.lista
  if (dados.maior_dor && !contem(DORES, dados.maior_dor)) erros.maior_dor = MENSAGENS.lista
  if (!dados.consentimento) erros.consentimento = MENSAGENS.consentimento
  return erros
}

export interface LeadParaGravar extends Atribuicao {
  variante: Variante
  nome: string
  email: string
  whatsapp: string
  marketplace: string
  faturamento: string
  anuncios: string
  ferramenta: string | null
  maior_dor: string | null
  consentimento: true
  armadilha: string
}

/** Monta a linha da tabela leads. id, criado_em e perfil_provavel ficam com o banco. */
export function montarLead(dados: DadosFormulario, variante: Variante, atribuicao: Atribuicao): LeadParaGravar {
  const whatsapp = normalizarWhatsapp(dados.whatsapp)
  if (!whatsapp) throw new Error('WhatsApp inválido')
  if (!dados.consentimento) throw new Error('Sem consentimento')
  return {
    variante,
    nome: limparNome(dados.nome),
    email: limparEmail(dados.email),
    whatsapp,
    marketplace: dados.marketplace,
    faturamento: dados.faturamento,
    anuncios: dados.anuncios,
    ferramenta: dados.ferramenta || null,
    maior_dor: dados.maior_dor || null,
    consentimento: true,
    utm_source: atribuicao.utm_source,
    utm_medium: atribuicao.utm_medium,
    utm_campaign: atribuicao.utm_campaign,
    referencia: atribuicao.referencia,
    armadilha: dados.armadilha,
  }
}
