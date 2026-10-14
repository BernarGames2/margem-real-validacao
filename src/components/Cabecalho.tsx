import { CTA_CABECALHO } from '../conteudo'
import { Texto } from './Texto'

export function Cabecalho({ aoClicarCta }: { aoClicarCta?: () => void }) {
  return (
    <header className="cabecalho">
      <div className="conteiner cabecalho-linha">
        <a className="marca" href="/">
          Margem Real
        </a>
        {aoClicarCta && (
          <>
            <nav className="navegacao" aria-label="Seções da página">
              <a href="#como-funciona">Como funciona</a>
              <a href="#perguntas">Perguntas</a>
            </nav>
            <a className="botao botao-pequeno" href="#pedir" onClick={aoClicarCta}>
              <Texto>{CTA_CABECALHO}</Texto>
            </a>
          </>
        )}
      </div>
    </header>
  )
}
