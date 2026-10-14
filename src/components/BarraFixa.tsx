import { useEffect, useState } from 'react'
import { CTA_PRINCIPAL } from '../conteudo'
import { Texto } from './Texto'

/** No celular, aparece quando o topo sai da tela e some quando o formulário está visível. */
export function BarraFixa({ aoClicarCta }: { aoClicarCta: () => void }) {
  const [visivel, setVisivel] = useState(false)

  useEffect(() => {
    const topo = document.getElementById('topo')
    const formulario = document.getElementById('pedir')
    if (!topo || !formulario || !('IntersectionObserver' in window)) return
    let topoNaTela = true
    let formularioNaTela = false
    const observador = new IntersectionObserver((entradas) => {
      for (const entrada of entradas) {
        if (entrada.target === topo) topoNaTela = entrada.isIntersecting
        if (entrada.target === formulario) formularioNaTela = entrada.isIntersecting
      }
      setVisivel(!topoNaTela && !formularioNaTela)
    })
    observador.observe(topo)
    observador.observe(formulario)
    return () => observador.disconnect()
  }, [])

  return (
    <div className={visivel ? 'barra-fixa visivel' : 'barra-fixa'} data-testid="barra-fixa">
      <a className="botao" href="#pedir" onClick={aoClicarCta} tabIndex={visivel ? undefined : -1}>
        <Texto>{CTA_PRINCIPAL}</Texto>
      </a>
    </div>
  )
}
