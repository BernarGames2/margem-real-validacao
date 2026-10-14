import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CTA_PRINCIPAL, FORMULARIO } from '../conteudo'
import type { Atribuicao } from '../lib/atribuicao'
import { inserir } from '../lib/supabase'
import {
  DORES,
  FATURAMENTOS,
  FERRAMENTAS,
  FORMULARIO_VAZIO,
  MARKETPLACES,
  ORDEM_DOS_CAMPOS,
  RESPOSTAS_ANUNCIO,
  mascararWhatsapp,
  montarLead,
  perfilProvavel,
  validar,
  type Campo,
  type DadosFormulario,
  type Erros,
} from '../lib/validacao'
import type { Variante } from '../lib/variante'
import { Texto } from './Texto'

type Estado = { tipo: 'editando' } | { tipo: 'enviando' } | { tipo: 'erro' } | { tipo: 'sucesso'; perfil: boolean }

interface Props {
  variante: Variante
  atribuicao: Atribuicao
  aoComecar: () => void
}

export function Formulario({ variante, atribuicao, aoComecar }: Props) {
  const [dados, setDados] = useState<DadosFormulario>(FORMULARIO_VAZIO)
  const [erros, setErros] = useState<Erros>({})
  const [estado, setEstado] = useState<Estado>({ tipo: 'editando' })
  const [anuncio, setAnuncio] = useState('')
  const campos = useRef<Partial<Record<Campo, HTMLElement | null>>>({})
  const confirmacao = useRef<HTMLHeadingElement>(null)
  const { rotulos } = FORMULARIO

  useEffect(() => {
    if (estado.tipo === 'sucesso') confirmacao.current?.focus()
  }, [estado])

  function atualizar<C extends Campo>(campo: C, valor: DadosFormulario[C]) {
    setDados((anterior) => ({ ...anterior, [campo]: valor }))
    if (erros[campo]) {
      setErros((anteriores) => {
        const proximos = { ...anteriores }
        delete proximos[campo]
        return proximos
      })
    }
  }

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault()
    if (estado.tipo === 'enviando') return
    const encontrados = validar(dados)
    const comErro = ORDEM_DOS_CAMPOS.filter((campo) => encontrados[campo])
    if (comErro.length > 0) {
      setErros(encontrados)
      setAnuncio(FORMULARIO.resumoErros(comErro.length))
      campos.current[comErro[0]]?.focus()
      return
    }
    setErros({})
    setEstado({ tipo: 'enviando' })
    setAnuncio(FORMULARIO.enviando)
    try {
      await inserir('leads', montarLead(dados, variante, atribuicao))
      setEstado({ tipo: 'sucesso', perfil: perfilProvavel(dados.marketplace, dados.faturamento, dados.anuncios) })
      setAnuncio('')
    } catch {
      setEstado({ tipo: 'erro' })
      setAnuncio('')
    }
  }

  const descricao = (campo: Campo) => (erros[campo] ? `erro-${campo}` : undefined)
  const registrar = (campo: Campo) => (elemento: HTMLElement | null) => {
    campos.current[campo] = elemento
  }
  const erro = (campo: Campo) =>
    erros[campo] ? (
      <p className="erro-campo" id={`erro-${campo}`}>
        {erros[campo]}
      </p>
    ) : null

  return (
    <section id="pedir" className="secao formulario-secao" aria-labelledby="pedir-titulo">
      <div className="conteiner">
        <div className="painel-form">
          {estado.tipo === 'sucesso' ? (
            <div className="confirmacao">
              <h2 id="pedir-titulo" ref={confirmacao} tabIndex={-1}>
                {FORMULARIO.confirmacaoTitulo}
              </h2>
              <p>
                <Texto>{estado.perfil ? FORMULARIO.confirmacaoPerfil : FORMULARIO.confirmacaoFora}</Texto>
              </p>
            </div>
          ) : (
            <>
              <h2 id="pedir-titulo">
                <Texto>{FORMULARIO.titulo}</Texto>
              </h2>
              <p>
                <Texto>{FORMULARIO.texto}</Texto>
              </p>
              <form noValidate onSubmit={enviar} onFocusCapture={aoComecar} aria-describedby="nota-dados">
                <div className="campos">
                  <div className="campo">
                    <label htmlFor="campo-nome">{rotulos.nome}</label>
                    <input
                      id="campo-nome"
                      name="nome"
                      type="text"
                      autoComplete="name"
                      maxLength={120}
                      aria-required="true"
                      aria-invalid={Boolean(erros.nome)}
                      aria-describedby={descricao('nome')}
                      ref={registrar('nome')}
                      value={dados.nome}
                      onChange={(e) => atualizar('nome', e.target.value)}
                    />
                    {erro('nome')}
                  </div>

                  <div className="campo">
                    <label htmlFor="campo-email">{rotulos.email}</label>
                    <input
                      id="campo-email"
                      name="email"
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      spellCheck={false}
                      maxLength={160}
                      aria-required="true"
                      aria-invalid={Boolean(erros.email)}
                      aria-describedby={descricao('email')}
                      ref={registrar('email')}
                      value={dados.email}
                      onChange={(e) => atualizar('email', e.target.value)}
                    />
                    {erro('email')}
                  </div>

                  <div className="campo">
                    <label htmlFor="campo-whatsapp">{rotulos.whatsapp}</label>
                    <input
                      id="campo-whatsapp"
                      name="whatsapp"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="(11) 91234-5678"
                      aria-required="true"
                      aria-invalid={Boolean(erros.whatsapp)}
                      aria-describedby={descricao('whatsapp')}
                      ref={registrar('whatsapp')}
                      value={dados.whatsapp}
                      onChange={(e) => atualizar('whatsapp', mascararWhatsapp(e.target.value))}
                    />
                    {erro('whatsapp')}
                  </div>

                  <div className="campo">
                    <label htmlFor="campo-marketplace">{rotulos.marketplace}</label>
                    <select
                      id="campo-marketplace"
                      name="marketplace"
                      aria-required="true"
                      aria-invalid={Boolean(erros.marketplace)}
                      aria-describedby={descricao('marketplace')}
                      ref={registrar('marketplace')}
                      value={dados.marketplace}
                      onChange={(e) => atualizar('marketplace', e.target.value)}
                    >
                      <option value="">{FORMULARIO.escolha}</option>
                      {MARKETPLACES.map((opcao) => (
                        <option key={opcao} value={opcao}>
                          {opcao}
                        </option>
                      ))}
                    </select>
                    {erro('marketplace')}
                  </div>

                  <div className="campo">
                    <label htmlFor="campo-faturamento">{rotulos.faturamento}</label>
                    <select
                      id="campo-faturamento"
                      name="faturamento"
                      aria-required="true"
                      aria-invalid={Boolean(erros.faturamento)}
                      aria-describedby={descricao('faturamento')}
                      ref={registrar('faturamento')}
                      value={dados.faturamento}
                      onChange={(e) => atualizar('faturamento', e.target.value)}
                    >
                      <option value="">{FORMULARIO.escolha}</option>
                      {FATURAMENTOS.map((opcao) => (
                        <option key={opcao} value={opcao}>
                          {opcao}
                        </option>
                      ))}
                    </select>
                    {erro('faturamento')}
                  </div>

                  <fieldset className="campo" aria-describedby={descricao('anuncios')}>
                    <legend>{rotulos.anuncios}</legend>
                    <div className="opcoes">
                      {RESPOSTAS_ANUNCIO.map((opcao, indice) => (
                        <label key={opcao} className="opcao">
                          <input
                            type="radio"
                            name="anuncios"
                            value={opcao}
                            aria-invalid={Boolean(erros.anuncios)}
                            ref={indice === 0 ? registrar('anuncios') : undefined}
                            checked={dados.anuncios === opcao}
                            onChange={() => atualizar('anuncios', opcao)}
                          />
                          {opcao}
                        </label>
                      ))}
                    </div>
                    {erro('anuncios')}
                  </fieldset>

                  <div className="campo">
                    <label htmlFor="campo-ferramenta">{rotulos.ferramenta}</label>
                    <select
                      id="campo-ferramenta"
                      name="ferramenta"
                      aria-invalid={Boolean(erros.ferramenta)}
                      aria-describedby={descricao('ferramenta')}
                      ref={registrar('ferramenta')}
                      value={dados.ferramenta}
                      onChange={(e) => atualizar('ferramenta', e.target.value)}
                    >
                      <option value="">{FORMULARIO.escolhaOpcional}</option>
                      {FERRAMENTAS.map((opcao) => (
                        <option key={opcao} value={opcao}>
                          {opcao}
                        </option>
                      ))}
                    </select>
                    {erro('ferramenta')}
                  </div>

                  <div className="campo">
                    <label htmlFor="campo-maior-dor">{rotulos.maior_dor}</label>
                    <select
                      id="campo-maior-dor"
                      name="maior_dor"
                      aria-invalid={Boolean(erros.maior_dor)}
                      aria-describedby={descricao('maior_dor')}
                      ref={registrar('maior_dor')}
                      value={dados.maior_dor}
                      onChange={(e) => atualizar('maior_dor', e.target.value)}
                    >
                      <option value="">{FORMULARIO.escolhaOpcional}</option>
                      {DORES.map((opcao) => (
                        <option key={opcao} value={opcao}>
                          {opcao}
                        </option>
                      ))}
                    </select>
                    {erro('maior_dor')}
                  </div>

                  <div className="campo campo-largo campo-consentimento">
                    <label className="opcao" htmlFor="campo-consentimento">
                      <input
                        id="campo-consentimento"
                        name="consentimento"
                        type="checkbox"
                        aria-required="true"
                        aria-invalid={Boolean(erros.consentimento)}
                        aria-describedby={descricao('consentimento')}
                        ref={registrar('consentimento')}
                        checked={dados.consentimento}
                        onChange={(e) => atualizar('consentimento', e.target.checked)}
                      />
                      <span>
                        {FORMULARIO.consentimentoAntes}
                        <a href="/privacidade/" target="_blank" rel="noopener">
                          {FORMULARIO.consentimentoLink}
                          <span className="visualmente-oculto"> (abre em nova aba)</span>
                        </a>
                        .
                      </span>
                    </label>
                    {erro('consentimento')}
                  </div>
                </div>

                <div className="armadilha" aria-hidden="true">
                  <label htmlFor="campo-site">Não preencha este campo</label>
                  <input
                    id="campo-site"
                    name="site"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={dados.armadilha}
                    onChange={(e) => atualizar('armadilha', e.target.value)}
                  />
                </div>

                {estado.tipo === 'erro' && (
                  <p className="erro-envio" role="alert">
                    <Texto>{FORMULARIO.erroEnvio}</Texto>
                  </p>
                )}

                <div className="acoes">
                  <button type="submit" className="botao" disabled={estado.tipo === 'enviando'}>
                    {estado.tipo === 'enviando' ? FORMULARIO.enviando : <Texto>{CTA_PRINCIPAL}</Texto>}
                  </button>
                  <p className="nota" id="nota-dados">
                    <Texto>{FORMULARIO.notaDados}</Texto>
                  </p>
                </div>
              </form>
            </>
          )}
          <div className="visualmente-oculto" role="status" aria-live="polite">
            {anuncio}
          </div>
        </div>
      </div>
    </section>
  )
}
