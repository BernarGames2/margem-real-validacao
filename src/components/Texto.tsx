import { Fragment, type ReactNode } from 'react'
import { config, estaPendente, type ChaveTexto } from '../config'

const CHAVES: readonly string[] = [
  'nome',
  'nomeCompleto',
  'fraseExperiencia',
  'emailContato',
  'prazoResposta',
  'prazoRaioX',
  'dataPublicacao',
]

/** Valor de configuração; entre colchetes aparece marcado em amarelo. */
export function Valor({ chave }: { chave: ChaveTexto }) {
  const valor = config[chave]
  if (estaPendente(valor)) return <mark className="pendente">{valor}</mark>
  if (chave === 'emailContato') return <a href={`mailto:${valor}`}>{valor}</a>
  return <>{valor}</>
}

/** Troca {chave} pelo valor de src/config.ts e impede que "Raio-X" quebre no hífen. */
export function Texto({ children }: { children: string }) {
  const partes = children.split(/(\{[a-zA-Z]+\}|Raio-X)/g)
  const nos: ReactNode[] = partes.map((parte, indice) => {
    if (parte === 'Raio-X') {
      return (
        <span key={indice} className="sem-quebra">
          {parte}
        </span>
      )
    }
    const chave = parte.startsWith('{') && parte.endsWith('}') ? parte.slice(1, -1) : null
    if (chave && CHAVES.includes(chave)) {
      return <Valor key={indice} chave={chave as ChaveTexto} />
    }
    return <Fragment key={indice}>{parte}</Fragment>
  })
  // Um único span: dentro de botões (flex), vários pedaços soltos perderiam os espaços entre si.
  return <span>{nos}</span>
}
