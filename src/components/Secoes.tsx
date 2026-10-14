import { config } from '../config'
import { COMO_FUNCIONA, GRATUITO, O_QUE_RECEBE, PARA_QUEM, PERGUNTAS, PROBLEMA } from '../conteudo'
import { formatarPercentual, formatarReais } from '../lib/formato'
import { Texto } from './Texto'

export function Problema() {
  return (
    <section className="secao" aria-labelledby="problema-titulo">
      <div className="conteiner">
        <h2 id="problema-titulo">{PROBLEMA.titulo}</h2>
        <ul className="lista">
          {PROBLEMA.itens.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function ComoFunciona() {
  return (
    <section id="como-funciona" className="secao" aria-labelledby="como-funciona-titulo">
      <div className="conteiner">
        <h2 id="como-funciona-titulo">{COMO_FUNCIONA.titulo}</h2>
        <ol className="passos">
          {COMO_FUNCIONA.passos.map((passo) => (
            <li key={passo.titulo}>
              <strong>{passo.titulo}</strong>
              <p>
                <Texto>{passo.texto}</Texto>
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export function OQueRecebe({ mostrarConciliacao }: { mostrarConciliacao: boolean }) {
  const itens = mostrarConciliacao ? [...O_QUE_RECEBE.itens, O_QUE_RECEBE.itemConciliacao] : O_QUE_RECEBE.itens
  return (
    <section className="secao" aria-labelledby="recebe-titulo">
      <div className="conteiner">
        <h2 id="recebe-titulo">{O_QUE_RECEBE.titulo}</h2>
        <ul className="lista">
          {itens.map((item) => (
            <li key={item}>
              <Texto>{item}</Texto>
            </li>
          ))}
        </ul>
        <div className="rolagem-tabela">
          <table className="tabela-exemplo">
            <caption>{O_QUE_RECEBE.legendaTabela}</caption>
            <thead>
              <tr>
                {O_QUE_RECEBE.colunas.map((coluna, indice) => (
                  <th key={coluna} scope="col" className={indice > 0 ? 'num' : undefined}>
                    {coluna}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {O_QUE_RECEBE.linhas.map((linha) => {
                const classe = linha.sobraCentavos < 0 ? 'num negativo' : 'num positivo'
                return (
                  <tr key={linha.produto}>
                    <th scope="row">{linha.produto}</th>
                    <td className="num">{linha.vendas}</td>
                    <td className={classe}>{formatarReais(linha.sobraCentavos)}</td>
                    <td className={classe}>{formatarPercentual((linha.sobraCentavos / linha.precoCentavos) * 100)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export function ParaQuem() {
  return (
    <section className="secao" aria-labelledby="para-quem-titulo">
      <div className="conteiner">
        <h2 id="para-quem-titulo">{PARA_QUEM.titulo}</h2>
        <div className="colunas">
          {[PARA_QUEM.sim, PARA_QUEM.nao].map((grupo) => (
            <div key={grupo.titulo}>
              <h3>{grupo.titulo}</h3>
              <ul className="lista">
                {grupo.itens.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PorQueGratuito() {
  return (
    <section className="secao" aria-labelledby="gratuito-titulo">
      <div className="conteiner">
        <h2 id="gratuito-titulo">{GRATUITO.titulo}</h2>
        <p>
          <Texto>{GRATUITO.texto}</Texto>
        </p>
      </div>
    </section>
  )
}

export function Perguntas() {
  const itens = PERGUNTAS.itens.filter((item) => !item.quemEstaPorTras || config.mostrarQuemEstaPorTras)
  return (
    <section id="perguntas" className="secao perguntas" aria-labelledby="perguntas-titulo">
      <div className="conteiner">
        <h2 id="perguntas-titulo">{PERGUNTAS.titulo}</h2>
        {itens.map((item) => (
          <details key={item.pergunta}>
            <summary>
              <Texto>{item.pergunta}</Texto>
            </summary>
            <p>
              <Texto>{item.resposta}</Texto>
            </p>
          </details>
        ))}
      </div>
    </section>
  )
}
