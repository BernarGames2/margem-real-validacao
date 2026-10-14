import { describe, expect, it, vi } from 'vitest'
import { pareceRobo, registrarEvento } from '../../src/lib/eventos'
import { enderecoDaTabela, inserir, montarCabecalhos } from '../../src/lib/supabase'

const atribuicao = { utm_source: null, utm_medium: null, utm_campaign: null, referencia: null }
const PESSOA = { webdriver: false, userAgent: 'Mozilla/5.0 (Linux; Android 14) Chrome/140 Mobile' }

function ambiente(navegador = PESSOA) {
  const sessao = new Map<string, string>()
  const inserirFalso = vi.fn().mockResolvedValue(undefined)
  return {
    sessao,
    inserirFalso,
    dependencias: {
      ler: (_area: 'local' | 'sessao', chave: string) => sessao.get(chave) ?? null,
      gravar: (_area: 'local' | 'sessao', chave: string, valor: string) => void sessao.set(chave, valor),
      inserir: inserirFalso,
      navegador,
      enviados: new Set<string>(),
    },
  }
}

describe('eventos', () => {
  it('envia cada tipo uma única vez por sessão', () => {
    const { dependencias, inserirFalso } = ambiente()
    expect(registrarEvento('visita', 'a', atribuicao, dependencias)).toBe(true)
    expect(registrarEvento('visita', 'a', atribuicao, dependencias)).toBe(false)
    expect(registrarEvento('clique_cta', 'a', atribuicao, dependencias)).toBe(true)
    expect(inserirFalso).toHaveBeenCalledTimes(2)
    expect(inserirFalso).toHaveBeenCalledWith('eventos', { tipo: 'visita', variante: 'a', ...atribuicao }, { keepalive: true })
  })

  it('não conta robôs nem navegadores automatizados', () => {
    expect(pareceRobo({ userAgent: 'Googlebot/2.1' })).toBe(true)
    expect(pareceRobo({ userAgent: 'Mozilla/5.0 HeadlessChrome/140' })).toBe(true)
    expect(pareceRobo({ webdriver: true, userAgent: PESSOA.userAgent })).toBe(true)
    const { dependencias, inserirFalso } = ambiente({ webdriver: true, userAgent: PESSOA.userAgent })
    expect(registrarEvento('visita', 'b', atribuicao, dependencias)).toBe(false)
    expect(inserirFalso).not.toHaveBeenCalled()
  })

  it('ignora falha no envio sem quebrar a página', async () => {
    const { dependencias, inserirFalso } = ambiente()
    inserirFalso.mockRejectedValueOnce(new Error('rede'))
    expect(() => registrarEvento('inicio_formulario', 'c', atribuicao, dependencias)).not.toThrow()
    await Promise.resolve()
  })
})

describe('chamada ao Supabase', () => {
  it('manda a chave publicável só no cabeçalho apikey e nunca pede a linha de volta', () => {
    const cabecalhos = montarCabecalhos('sb_publishable_abc')
    expect(cabecalhos).toEqual({
      apikey: 'sb_publishable_abc',
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    })
  })

  it('manda a chave anon antiga (JWT) também no Authorization', () => {
    expect(montarCabecalhos('eyJhbGciOi.x.y').Authorization).toBe('Bearer eyJhbGciOi.x.y')
  })

  it('monta o endereço da tabela sem barras duplicadas', () => {
    expect(enderecoDaTabela('https://abc.supabase.co/', 'leads')).toBe('https://abc.supabase.co/rest/v1/leads')
  })

  it('recusa gravar sem configuração', async () => {
    await expect(inserir('leads', {})).rejects.toThrow('Supabase não configurado')
  })
})
