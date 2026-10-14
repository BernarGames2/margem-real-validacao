import { gravar, ler, type Area } from './armazenamento'
import type { Atribuicao } from './atribuicao'
import { inserir, type Tabela } from './supabase'
import type { Variante } from './variante'

export type TipoEvento = 'visita' | 'clique_cta' | 'inicio_formulario'

const PREFIXO = 'mr_evento_'
const enviadosNestaPagina = new Set<string>()

export function pareceRobo(navegador: { webdriver?: boolean; userAgent: string }): boolean {
  return Boolean(navegador.webdriver) || /bot|crawler|spider|crawling|headless/i.test(navegador.userAgent)
}

interface Dependencias {
  ler: (area: Area, chave: string) => string | null
  gravar: (area: Area, chave: string, valor: string) => void
  inserir: (tabela: Tabela, linha: object, opcoes?: { keepalive?: boolean }) => Promise<void>
  navegador: { webdriver?: boolean; userAgent: string }
  enviados: Set<string>
}

const padrao = (): Dependencias => ({
  ler,
  gravar,
  inserir,
  navegador: navigator,
  enviados: enviadosNestaPagina,
})

/**
 * Registra cada tipo de evento no máximo uma vez por sessão do navegador.
 * Nunca atrasa nem trava a página: falhas são ignoradas.
 * Retorna true quando o evento foi enviado.
 */
export function registrarEvento(
  tipo: TipoEvento,
  variante: Variante,
  atribuicao: Atribuicao,
  dependencias: Dependencias = padrao(),
): boolean {
  const { ler: lerArea, gravar: gravarArea, inserir: inserirLinha, navegador, enviados } = dependencias
  if (pareceRobo(navegador)) return false
  const chave = PREFIXO + tipo
  if (enviados.has(chave) || lerArea('sessao', chave)) return false
  enviados.add(chave)
  gravarArea('sessao', chave, '1')
  inserirLinha('eventos', { tipo, variante, ...atribuicao }, { keepalive: true }).catch(() => {
    // evento perdido não afeta a pessoa nem o formulário
  })
  return true
}
