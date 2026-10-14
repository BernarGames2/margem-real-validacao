// Gravação direta na API REST do Supabase (a mesma que o supabase-js usa por baixo),
// sem dependência extra. O visitante só tem permissão de INSERT; por isso o pedido usa
// "Prefer: return=minimal" e nunca pede a linha de volta (isso exigiria permissão de leitura).

export type Tabela = 'leads' | 'eventos'

const URL_BASE = import.meta.env.VITE_SUPABASE_URL as string | undefined
const CHAVE = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseConfigurado = Boolean(URL_BASE && CHAVE)

/** Chave publicável (sb_publishable_...) vai só no cabeçalho apikey; a anon antiga (JWT) vai também no Authorization. */
export function montarCabecalhos(chave: string): Record<string, string> {
  const cabecalhos: Record<string, string> = {
    apikey: chave,
    'Content-Type': 'application/json',
    Prefer: 'return=minimal',
  }
  if (chave.startsWith('eyJ')) cabecalhos.Authorization = `Bearer ${chave}`
  return cabecalhos
}

export function enderecoDaTabela(urlBase: string, tabela: Tabela): string {
  return `${urlBase.replace(/\/+$/, '')}/rest/v1/${tabela}`
}

export async function inserir(tabela: Tabela, linha: object, opcoes: { keepalive?: boolean } = {}): Promise<void> {
  if (!URL_BASE || !CHAVE) {
    throw new Error('Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY')
  }
  const resposta = await fetch(enderecoDaTabela(URL_BASE, tabela), {
    method: 'POST',
    headers: montarCabecalhos(CHAVE),
    body: JSON.stringify(linha),
    keepalive: opcoes.keepalive,
  })
  if (!resposta.ok) {
    throw new Error(`Falha ao gravar em ${tabela}: HTTP ${resposta.status}`)
  }
}
