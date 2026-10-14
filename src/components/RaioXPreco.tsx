import type { CSSProperties } from 'react'
import { RAIO_X } from '../conteudo'
import { formatarReais, porcentagem } from '../lib/formato'

// Tons de Tinta, do mais claro ao mais escuro, um por custo.
const OPACIDADES = [0.2, 0.36, 0.52, 0.68, 0.84]

type Estilo = CSSProperties & Record<`--${string}`, string | number>

/** O único elemento ousado da página: o preço de um produto fictício decomposto em custos. */
export function RaioXPreco() {
  const { produto, precoCentavos, custos, legenda } = RAIO_X
  const totalCustos = custos.reduce((soma, custo) => soma + custo.centavos, 0)
  const sobra = precoCentavos - totalCustos
  const anuncio = custos[custos.length - 1].centavos
  const excedente = Math.max(0, porcentagem(totalCustos - precoCentavos, precoCentavos))

  return (
    <div className="raiox" role="group" aria-labelledby="raiox-produto">
      <div className="raiox-cabeca">
        <p className="raiox-produto" id="raiox-produto">
          {produto}
        </p>
        <p className="raiox-preco">
          Preço de venda <strong>{formatarReais(precoCentavos)}</strong>
        </p>
      </div>

      <div className="raiox-barra" aria-hidden="true">
        <div className="raiox-trilho">
          {custos.map((custo, indice) => {
            const estilo: Estilo = {
              width: `${porcentagem(custo.centavos, precoCentavos)}%`,
              '--i': indice,
              '--opacidade': OPACIDADES[indice],
            }
            return <span key={custo.nome} className="segmento" style={estilo} />
          })}
          {excedente > 0 && <span className="excedente" style={{ left: '100%', width: `${excedente}%` }} />}
          <span className="linha-preco">
            <span>preço de venda</span>
          </span>
        </div>
      </div>

      <table className="raiox-custos">
        <caption className="visualmente-oculto">Composição do preço de um produto fictício</caption>
        <tbody>
          {custos.map((custo, indice) => {
            const estilo: Estilo = { '--opacidade': OPACIDADES[indice] }
            return (
              <tr key={custo.nome}>
                <th scope="row">
                  <span className="amostra" style={estilo} aria-hidden="true" />
                  {custo.nome}
                </th>
                <td>{formatarReais(-custo.centavos)}</td>
              </tr>
            )
          })}
          <tr className="sobra">
            <th scope="row">Sobra por venda</th>
            <td>{formatarReais(sobra)}</td>
          </tr>
        </tbody>
      </table>
      <p className="raiox-nota">Sem o anúncio, sobrariam {formatarReais(sobra + anuncio)}.</p>
      <p className="raiox-legenda">{legenda}</p>
    </div>
  )
}
