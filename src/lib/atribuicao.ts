import { gravar, ler } from './armazenamento'

/** De onde veio a visita. Guardado só durante a sessão do navegador, sem identificar a pessoa. */
export interface Atribuicao {
  utm_source: string | null
  utm_medium: string | null
  utm_campaign: string | null
  referencia: string | null
}

const CHAVE = 'mr_atribuicao'

function limitar(valor: string | null, maximo: number): string | null {
  const texto = valor?.trim()
  return texto ? texto.slice(0, maximo) : null
}

/** Só o domínio de quem mandou a visita, e só se for outro site. */
export function dominioExterno(referrer: string, hostAtual: string): string | null {
  if (!referrer) return null
  try {
    const host = new URL(referrer).hostname
    return host && host !== hostAtual ? host.slice(0, 200) : null
  } catch {
    return null
  }
}

export function lerAtribuicao(busca: string, referrer: string, hostAtual: string): Atribuicao {
  const parametros = new URLSearchParams(busca)
  return {
    utm_source: limitar(parametros.get('utm_source'), 100),
    utm_medium: limitar(parametros.get('utm_medium'), 100),
    utm_campaign: limitar(parametros.get('utm_campaign'), 100),
    referencia: dominioExterno(referrer, hostAtual),
  }
}

function textoOuNulo(valor: unknown, maximo: number): string | null {
  return typeof valor === 'string' ? limitar(valor, maximo) : null
}

export function interpretarGuardada(texto: string | null): Atribuicao | null {
  if (!texto) return null
  try {
    const dado = JSON.parse(texto) as Record<string, unknown>
    if (typeof dado !== 'object' || dado === null) return null
    return {
      utm_source: textoOuNulo(dado.utm_source, 100),
      utm_medium: textoOuNulo(dado.utm_medium, 100),
      utm_campaign: textoOuNulo(dado.utm_campaign, 100),
      referencia: textoOuNulo(dado.referencia, 200),
    }
  } catch {
    return null
  }
}

/** Vale a origem da primeira página aberta na sessão; páginas seguintes reaproveitam. */
export function atribuicaoDaSessao(): Atribuicao {
  const guardada = interpretarGuardada(ler('sessao', CHAVE))
  if (guardada) return guardada
  const nova = lerAtribuicao(window.location.search, document.referrer, window.location.hostname)
  gravar('sessao', CHAVE, JSON.stringify(nova))
  return nova
}
