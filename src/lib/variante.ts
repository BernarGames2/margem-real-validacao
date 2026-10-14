import { gravar, ler } from './armazenamento'

export type Variante = 'a' | 'b' | 'c'

export const CHAVE_VARIANTE = 'mr_variante'

interface Escolha {
  parametro: string | null
  guardada: string | null
  ativas: readonly Variante[]
  sortear: () => number
}

/** Ordem: ?v= da URL, depois a versão já vista neste navegador, depois sorteio com chances iguais. */
export function escolherVariante({ parametro, guardada, ativas, sortear }: Escolha): Variante {
  if (ativas.length === 0) throw new Error('Nenhuma versão ativa')
  const valida = (v: string | null): v is Variante =>
    v !== null && (ativas as readonly string[]).includes(v)
  if (valida(parametro)) return parametro
  if (valida(guardada)) return guardada
  const indice = Math.min(ativas.length - 1, Math.floor(sortear() * ativas.length))
  return ativas[indice]
}

export function varianteDaPagina(ativas: readonly Variante[]): Variante {
  const parametro = new URLSearchParams(window.location.search).get('v')
  const variante = escolherVariante({
    parametro: parametro ? parametro.trim().toLowerCase() : null,
    guardada: ler('local', CHAVE_VARIANTE),
    ativas,
    sortear: Math.random,
  })
  gravar('local', CHAVE_VARIANTE, variante)
  return variante
}
