const reais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const decimal = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

const MENOS = '−' // sinal de menos tipográfico

/** 3800 → "R$ 38,00"; -210 → "−R$ 2,10". */
export function formatarReais(centavos: number): string {
  const texto = reais.format(Math.abs(centavos) / 100)
  return centavos < 0 ? MENOS + texto : texto
}

/** -2.336 → "−2,3%". */
export function formatarPercentual(valor: number): string {
  const arredondado = Math.round(valor * 10) / 10
  const texto = `${decimal.format(Math.abs(arredondado))}%`
  return arredondado < 0 ? MENOS + texto : texto
}

/** Parte de um total em %, com uma casa decimal. */
export function porcentagem(parte: number, total: number): number {
  return Math.round((parte / total) * 1000) / 10
}
