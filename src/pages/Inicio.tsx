import { useCallback, useEffect, useMemo } from 'react'
import { BarraFixa } from '../components/BarraFixa'
import { Cabecalho } from '../components/Cabecalho'
import { Formulario } from '../components/Formulario'
import { Rodape } from '../components/Rodape'
import { ComoFunciona, OQueRecebe, ParaQuem, Perguntas, PorQueGratuito, Problema } from '../components/Secoes'
import { Topo } from '../components/Topo'
import { config } from '../config'
import { atribuicaoDaSessao } from '../lib/atribuicao'
import { registrarEvento } from '../lib/eventos'
import { varianteDaPagina } from '../lib/variante'

export function Inicio() {
  const variante = useMemo(() => varianteDaPagina(config.versoesAtivas), [])
  const atribuicao = useMemo(() => atribuicaoDaSessao(), [])

  useEffect(() => {
    registrarEvento('visita', variante, atribuicao)
  }, [variante, atribuicao])

  const aoClicarCta = useCallback(() => {
    registrarEvento('clique_cta', variante, atribuicao)
  }, [variante, atribuicao])

  const aoComecarFormulario = useCallback(() => {
    registrarEvento('inicio_formulario', variante, atribuicao)
  }, [variante, atribuicao])

  return (
    <>
      <a className="pular" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Cabecalho aoClicarCta={aoClicarCta} />
      <main id="conteudo">
        <Topo variante={variante} aoClicarCta={aoClicarCta} />
        <Problema />
        <ComoFunciona />
        <OQueRecebe mostrarConciliacao={config.versoesAtivas.includes('c')} />
        <ParaQuem />
        <PorQueGratuito />
        <Formulario variante={variante} atribuicao={atribuicao} aoComecar={aoComecarFormulario} />
        <Perguntas />
      </main>
      <Rodape />
      <BarraFixa aoClicarCta={aoClicarCta} />
    </>
  )
}
