import { Cabecalho } from '../components/Cabecalho'
import { Rodape } from '../components/Rodape'
import { Texto } from '../components/Texto'
import { PRIVACIDADE } from '../conteudo'

export function Privacidade() {
  return (
    <>
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Cabecalho />
      <main id="conteudo" className="privacidade">
        <div className="conteiner">
          <h1>{PRIVACIDADE.titulo}</h1>
          <p className="nota">
            <Texto>{PRIVACIDADE.atualizacao}</Texto>
          </p>
          {PRIVACIDADE.secoes.map((secao) => (
            <section key={secao.titulo}>
              <h2>{secao.titulo}</h2>
              <p>
                <Texto>{secao.texto}</Texto>
              </p>
            </section>
          ))}
          <p className="voltar">
            <a href="/">{PRIVACIDADE.voltar}</a>
          </p>
        </div>
      </main>
      <Rodape />
    </>
  )
}
