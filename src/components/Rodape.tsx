import { RODAPE } from '../conteudo'
import { Texto } from './Texto'

export function Rodape() {
  return (
    <footer className="rodape">
      <div className="conteiner">
        <p>{RODAPE.aviso}</p>
        <p>
          <Texto>{RODAPE.contato}</Texto>
        </p>
        <p>
          <a href="/privacidade/">{RODAPE.privacidade}</a>
        </p>
      </div>
    </footer>
  )
}
