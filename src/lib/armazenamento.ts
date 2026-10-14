// localStorage e sessionStorage podem falhar (aba anônima, bloqueio de dados do site).
// Toda leitura e gravação passa por aqui e nunca derruba a página.

export type Area = 'local' | 'sessao'

function obter(area: Area): Storage | null {
  try {
    return area === 'local' ? window.localStorage : window.sessionStorage
  } catch {
    return null
  }
}

export function ler(area: Area, chave: string): string | null {
  try {
    return obter(area)?.getItem(chave) ?? null
  } catch {
    return null
  }
}

export function gravar(area: Area, chave: string, valor: string): void {
  try {
    obter(area)?.setItem(chave, valor)
  } catch {
    // sem armazenamento: a página segue funcionando
  }
}
