import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import {
  DORES,
  FATURAMENTOS,
  FERRAMENTAS,
  FORMULARIO_VAZIO,
  MARKETPLACES,
  MENSAGENS,
  RESPOSTAS_ANUNCIO,
  emailValido,
  mascararWhatsapp,
  montarLead,
  nomeValido,
  normalizarWhatsapp,
  perfilProvavel,
  validar,
  type DadosFormulario,
} from '../../src/lib/validacao'

const schema = readFileSync(new URL('../../supabase/schema.sql', import.meta.url), 'utf8')

/** Lê a lista de valores de "coluna in (...)" na restrição check do banco. */
function opcoesDoBanco(coluna: string): string[] {
  const achado = new RegExp(`^\\s*${coluna}\\s+text[^\\n]*check \\(${coluna} in \\((.*)\\)\\),?\\s*$`, 'm').exec(schema)
  if (!achado) throw new Error(`restrição de ${coluna} não encontrada`)
  return [...achado[1].matchAll(/'([^']*)'/g)].map((m) => m[1])
}

const VALIDO: DadosFormulario = {
  ...FORMULARIO_VAZIO,
  nome: '  Ana   Souza ',
  email: ' Ana@Empresa.com.BR ',
  whatsapp: '(11) 91234-5678',
  marketplace: 'Mercado Livre',
  faturamento: 'R$ 200 a 500 mil',
  anuncios: 'Sim',
  consentimento: true,
}

const atribuicao = { utm_source: 'grupo-x', utm_medium: null, utm_campaign: null, referencia: 'l.instagram.com' }

describe('opções do formulário x restrições do banco', () => {
  it('são idênticas, letra por letra', () => {
    expect([...MARKETPLACES]).toEqual(opcoesDoBanco('marketplace'))
    expect([...FATURAMENTOS]).toEqual(opcoesDoBanco('faturamento'))
    expect([...RESPOSTAS_ANUNCIO]).toEqual(opcoesDoBanco('anuncios'))
    expect([...FERRAMENTAS]).toEqual(opcoesDoBanco('ferramenta'))
    expect([...DORES]).toEqual(opcoesDoBanco('maior_dor'))
  })
})

describe('nome e e-mail', () => {
  it('aceita nomes de 2 a 120 caracteres', () => {
    expect(nomeValido('Al')).toBe(true)
    expect(nomeValido(' A ')).toBe(false)
    expect(nomeValido('x'.repeat(121))).toBe(false)
  })

  it('valida e-mail no mesmo formato do banco', () => {
    expect(emailValido('nome@empresa.com.br')).toBe(true)
    expect(emailValido('nome@@empresa')).toBe(false)
    expect(emailValido('nome empresa@x.com')).toBe(false)
    expect(emailValido(`${'a'.repeat(150)}@empresa.com`)).toBe(false)
  })
})

describe('WhatsApp', () => {
  it('mascara enquanto a pessoa digita', () => {
    expect(mascararWhatsapp('1')).toBe('(1')
    expect(mascararWhatsapp('11')).toBe('(11')
    expect(mascararWhatsapp('119')).toBe('(11) 9')
    expect(mascararWhatsapp('1191234')).toBe('(11) 9123-4')
    expect(mascararWhatsapp('1133334444')).toBe('(11) 3333-4444')
    expect(mascararWhatsapp('11912345678')).toBe('(11) 91234-5678')
    expect(mascararWhatsapp('11912345678999')).toBe('(11) 91234-5678')
  })

  it('normaliza para 55 + DDD + número, como o banco exige', () => {
    expect(normalizarWhatsapp('(11) 91234-5678')).toBe('5511912345678')
    expect(normalizarWhatsapp('(11) 3333-4444')).toBe('551133334444')
    expect(normalizarWhatsapp('(01) 91234-5678')).toBeNull()
    expect(normalizarWhatsapp('(11) 1234-567')).toBeNull()
    expect(normalizarWhatsapp('')).toBeNull()
  })
})

describe('perfil provável', () => {
  it('segue a mesma regra da coluna perfil_provavel', () => {
    expect(perfilProvavel('Shopee', 'R$ 50 a 200 mil', 'Sim')).toBe(true)
    expect(perfilProvavel('Mercado Livre e Shopee', 'R$ 500 mil a 1 milhão', 'Sim')).toBe(true)
    expect(perfilProvavel('Só Amazon', 'R$ 50 a 200 mil', 'Sim')).toBe(false)
    expect(perfilProvavel('Shopee', 'Mais de R$ 1 milhão', 'Sim')).toBe(false)
    expect(perfilProvavel('Shopee', 'R$ 50 a 200 mil', 'Não')).toBe(false)
  })
})

describe('validação do formulário', () => {
  it('não acusa erro num formulário completo', () => {
    expect(validar(VALIDO)).toEqual({})
  })

  it('exige campos obrigatórios e consentimento', () => {
    const erros = validar(FORMULARIO_VAZIO)
    expect(erros).toEqual({
      nome: MENSAGENS.nome,
      email: MENSAGENS.email,
      whatsapp: MENSAGENS.whatsapp,
      marketplace: MENSAGENS.lista,
      faturamento: MENSAGENS.lista,
      anuncios: MENSAGENS.lista,
      consentimento: MENSAGENS.consentimento,
    })
  })

  it('aceita opcionais em branco e recusa valores fora da lista', () => {
    expect(validar({ ...VALIDO, ferramenta: '', maior_dor: '' })).toEqual({})
    expect(validar({ ...VALIDO, ferramenta: 'Excel' }).ferramenta).toBe(MENSAGENS.lista)
  })
})

describe('linha gravada em leads', () => {
  it('limpa os campos e manda null nos opcionais vazios', () => {
    expect(montarLead(VALIDO, 'b', atribuicao)).toEqual({
      variante: 'b',
      nome: 'Ana Souza',
      email: 'ana@empresa.com.br',
      whatsapp: '5511912345678',
      marketplace: 'Mercado Livre',
      faturamento: 'R$ 200 a 500 mil',
      anuncios: 'Sim',
      ferramenta: null,
      maior_dor: null,
      consentimento: true,
      utm_source: 'grupo-x',
      utm_medium: null,
      utm_campaign: null,
      referencia: 'l.instagram.com',
      armadilha: '',
    })
  })

  it('não monta a linha sem consentimento', () => {
    expect(() => montarLead({ ...VALIDO, consentimento: false }, 'a', atribuicao)).toThrow()
  })
})
