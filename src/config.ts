import type { Variante } from './lib/variante'

// Troque os textos entre colchetes antes de publicar. Enquanto um campo continuar entre
// colchetes, a página o mostra com fundo amarelo, para ninguém publicar sem perceber.
export const config = {
  nome: '[SEU NOME]',
  nomeCompleto: '[SEU NOME COMPLETO]',
  fraseExperiencia: '[UMA FRASE SOBRE SUA EXPERIÊNCIA]',
  emailContato: '[E-MAIL DE CONTATO]',
  prazoResposta: '[PRAZO DE RESPOSTA]',
  prazoRaioX: '[PRAZO DO RAIO-X]',
  dataPublicacao: '[DATA DE PUBLICAÇÃO]',

  // Sem conferir cobranças no Raio-X, use ['a', 'b']: some a versão c e o item sobre tarifas.
  // Com pouco tráfego, testar só duas versões também ajuda.
  versoesAtivas: ['a', 'b', 'c'] as readonly Variante[],

  // false remove a pergunta "Quem está por trás?".
  mostrarQuemEstaPorTras: true,
}

export type ChaveTexto =
  | 'nome'
  | 'nomeCompleto'
  | 'fraseExperiencia'
  | 'emailContato'
  | 'prazoResposta'
  | 'prazoRaioX'
  | 'dataPublicacao'

export function estaPendente(valor: string): boolean {
  return /^\[[^\]]*\]$/.test(valor.trim())
}
