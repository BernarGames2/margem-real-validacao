import { describe, expect, it } from 'vitest'
import { dominioExterno, interpretarGuardada, lerAtribuicao } from '../../src/lib/atribuicao'
import { escolherVariante, type Variante } from '../../src/lib/variante'

const TODAS: readonly Variante[] = ['a', 'b', 'c']

describe('escolha da versão', () => {
  it('respeita ?v= quando a versão está ativa', () => {
    expect(escolherVariante({ parametro: 'c', guardada: 'a', ativas: TODAS, sortear: () => 0 })).toBe('c')
  })

  it('ignora ?v= de versão desligada e usa a guardada', () => {
    expect(escolherVariante({ parametro: 'c', guardada: 'b', ativas: ['a', 'b'], sortear: () => 0 })).toBe('b')
  })

  it('sorteia com chances iguais quando não há parâmetro nem versão guardada', () => {
    const contagem: Record<string, number> = { a: 0, b: 0, c: 0 }
    for (let i = 0; i < 300; i++) {
      const v = escolherVariante({ parametro: null, guardada: null, ativas: TODAS, sortear: () => (i + 0.5) / 300 })
      contagem[v]++
    }
    expect(contagem).toEqual({ a: 100, b: 100, c: 100 })
  })

  it('nunca sai do intervalo, mesmo com sorteio igual a 1', () => {
    expect(escolherVariante({ parametro: null, guardada: null, ativas: TODAS, sortear: () => 1 })).toBe('c')
  })
})

describe('origem da visita', () => {
  it('lê utm da URL e corta textos longos', () => {
    const at = lerAtribuicao(`?utm_source=grupo-sp&utm_medium=whatsapp&utm_campaign=${'x'.repeat(150)}`, '', 'site.com')
    expect(at.utm_source).toBe('grupo-sp')
    expect(at.utm_medium).toBe('whatsapp')
    expect(at.utm_campaign).toHaveLength(100)
    expect(at.referencia).toBeNull()
  })

  it('guarda só o domínio de outro site, nunca a URL completa', () => {
    expect(dominioExterno('https://l.instagram.com/?u=abc&e=123', 'site.com')).toBe('l.instagram.com')
    expect(dominioExterno('https://site.com/privacidade/', 'site.com')).toBeNull()
    expect(dominioExterno('nao é url', 'site.com')).toBeNull()
  })

  it('descarta dados guardados malformados', () => {
    expect(interpretarGuardada('{quebrado')).toBeNull()
    expect(interpretarGuardada(JSON.stringify({ utm_source: 7, referencia: 'x.com' }))).toEqual({
      utm_source: null,
      utm_medium: null,
      utm_campaign: null,
      referencia: 'x.com',
    })
  })
})
