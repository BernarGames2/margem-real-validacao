import { describe, expect, it } from 'vitest'
import { estaPendente } from '../../src/config'
import { O_QUE_RECEBE, RAIO_X, VARIANTES } from '../../src/conteudo'
import { formatarPercentual, formatarReais, porcentagem } from '../../src/lib/formato'

// Os exemplos são fictícios, mas precisam fechar a conta: um número errado num exemplo
// de margem derruba a credibilidade da página.

const nbsp = (texto: string) => texto.replace(/ /g, ' ')

describe('formatos', () => {
  it('escreve reais e porcentagens no padrão brasileiro, com sinal de menos', () => {
    expect(nbsp(formatarReais(3800))).toBe('R$ 38,00')
    expect(nbsp(formatarReais(-210))).toBe('−R$ 2,10')
    expect(formatarPercentual(14.09)).toBe('14,1%')
    expect(formatarPercentual(-2.336)).toBe('−2,3%')
  })
})

describe('raio-x do preço (exemplo fictício)', () => {
  const total = RAIO_X.custos.reduce((soma, custo) => soma + custo.centavos, 0)
  const sobra = RAIO_X.precoCentavos - total

  it('fecha a conta do preço de R$ 89,90', () => {
    expect(total).toBe(9200)
    expect(sobra).toBe(-210)
    expect(sobra + RAIO_X.custos[4].centavos).toBe(1312)
  })

  it('usa as larguras de barra do prompt', () => {
    const larguras = RAIO_X.custos.map((custo) => porcentagem(custo.centavos, RAIO_X.precoCentavos))
    expect(larguras).toEqual([42.3, 13, 22.1, 8, 16.9])
    expect(porcentagem(total - RAIO_X.precoCentavos, RAIO_X.precoCentavos)).toBe(2.3)
  })
})

describe('tabela de exemplo', () => {
  it('mostra as margens do prompt', () => {
    const margens = O_QUE_RECEBE.linhas.map((linha) => formatarPercentual((linha.sobraCentavos / linha.precoCentavos) * 100))
    expect(margens).toEqual(['−2,3%', '14,1%', '11,8%', '−5,2%'])
  })
})

describe('textos', () => {
  it('tem as três versões do topo', () => {
    expect(Object.keys(VARIANTES)).toEqual(['a', 'b', 'c'])
  })

  it('reconhece campos ainda entre colchetes', () => {
    expect(estaPendente('[E-MAIL DE CONTATO]')).toBe(true)
    expect(estaPendente('contato@exemplo.com.br')).toBe(false)
  })
})
