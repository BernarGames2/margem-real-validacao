import { CTA_PRINCIPAL, TOPO, VARIANTES } from '../conteudo'
import type { Variante } from '../lib/variante'
import { RaioXPreco } from './RaioXPreco'
import { Texto } from './Texto'

export function Topo({ variante, aoClicarCta }: { variante: Variante; aoClicarCta: () => void }) {
  const { titulo, subtitulo } = VARIANTES[variante]
  return (
    <section id="topo" className="topo" aria-labelledby="titulo-principal" data-variante={variante}>
      <div className="conteiner topo-grade">
        <div className="topo-texto">
          <h1 id="titulo-principal">{titulo}</h1>
          <p className="subtitulo">{subtitulo}</p>
          <a className="botao" href="#pedir" onClick={aoClicarCta}>
            <Texto>{CTA_PRINCIPAL}</Texto>
          </a>
          <p className="nota">
            <Texto>{TOPO.nota}</Texto>
          </p>
        </div>
        <RaioXPreco />
      </div>
    </section>
  )
}
