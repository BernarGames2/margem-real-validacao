import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { SUPABASE_TESTE } from '../../playwright.config'
import { config, estaPendente } from '../../src/config'
import { FORMULARIO, VARIANTES } from '../../src/conteudo'

// O Supabase é simulado: os pedidos são interceptados aqui e nada sai da máquina.

interface Gravacao {
  tabela: string
  url: string
  corpo: Record<string, unknown>
  cabecalhos: Record<string, string>
}

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'apikey, authorization, content-type, prefer',
  'access-control-allow-methods': 'POST, OPTIONS',
}

async function simularSupabase(page: Page, statusLeads = 201): Promise<Gravacao[]> {
  const gravacoes: Gravacao[] = []
  await page.route(`${SUPABASE_TESTE}/rest/v1/**`, async (rota) => {
    const pedido = rota.request()
    if (pedido.method() === 'OPTIONS') {
      await rota.fulfill({ status: 204, headers: CORS })
      return
    }
    const tabela = new URL(pedido.url()).pathname.split('/').pop() ?? ''
    gravacoes.push({ tabela, url: pedido.url(), corpo: pedido.postDataJSON(), cabecalhos: pedido.headers() })
    await rota.fulfill({ status: tabela === 'leads' ? statusLeads : 201, headers: CORS, body: '' })
  })
  return gravacoes
}

/** O site ignora eventos de navegadores automatizados; aqui fingimos uma pessoa. */
async function comoPessoa(page: Page) {
  await page.addInitScript(() => {
    Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false })
  })
}

async function preencherValido(page: Page, faturamento = 'R$ 200 a 500 mil') {
  await page.getByLabel('Nome', { exact: true }).fill('  Ana   Souza ')
  await page.getByLabel('E-mail', { exact: true }).fill(' Ana@Empresa.com.BR ')
  await page.getByLabel('WhatsApp com DDD').pressSequentially('11912345678')
  await page.getByLabel('Onde você vende?').selectOption('Mercado Livre')
  await page.getByLabel('Faturamento mensal da loja').selectOption(faturamento)
  await page.getByRole('radio', { name: 'Sim' }).check()
  await page.getByRole('checkbox', { name: /Aceito receber contato/ }).check()
}

const leads = (gravacoes: Gravacao[]) => gravacoes.filter((g) => g.tabela === 'leads')
const eventos = (gravacoes: Gravacao[], tipo?: string) =>
  gravacoes.filter((g) => g.tabela === 'eventos' && (!tipo || g.corpo.tipo === tipo))

test.describe('versões do topo', () => {
  for (const variante of ['a', 'b', 'c'] as const) {
    test(`?v=${variante} mostra o título da versão ${variante}`, async ({ page }) => {
      await page.goto(`/?v=${variante}`)
      await expect(page.locator('h1')).toHaveText(VARIANTES[variante].titulo)
    })
  }

  test('sem ?v=, a versão sorteada se repete ao recarregar', async ({ page }) => {
    await page.goto('/')
    const primeira = await page.locator('#topo').getAttribute('data-variante')
    expect(['a', 'b', 'c']).toContain(primeira)
    await page.reload()
    await expect(page.locator('#topo')).toHaveAttribute('data-variante', primeira ?? '')
  })
})

test.describe('formulário', () => {
  test('não envia sem os obrigatórios nem sem consentimento', async ({ page }) => {
    const gravacoes = await simularSupabase(page)
    await page.goto('/?v=a')
    await page.getByRole('button', { name: 'Pedir meu Raio-X gratuito' }).click()
    await expect(page.getByText('Informe seu nome.')).toBeVisible()
    await expect(page.getByLabel('Nome', { exact: true })).toBeFocused()
    await expect(page.getByText('Marque a caixa para podermos falar com você.')).toBeVisible()

    await preencherValido(page)
    await page.getByRole('checkbox', { name: /Aceito receber contato/ }).uncheck()
    await page.getByRole('button', { name: 'Pedir meu Raio-X gratuito' }).click()
    await expect(page.getByText('Marque a caixa para podermos falar com você.')).toBeVisible()
    expect(leads(gravacoes)).toHaveLength(0)
  })

  test('grava o pedido com os dados limpos, sem pedir a linha de volta', async ({ page }) => {
    const gravacoes = await simularSupabase(page)
    await page.goto('/?v=b&utm_source=teste&utm_campaign=lancamento')
    await preencherValido(page)
    await expect(page.getByLabel('WhatsApp com DDD')).toHaveValue('(11) 91234-5678')
    await page.getByRole('button', { name: 'Pedir meu Raio-X gratuito' }).click()

    await expect(page.getByRole('heading', { name: FORMULARIO.confirmacaoTitulo })).toBeVisible()
    await expect(page.getByText('Vamos chamar você no WhatsApp')).toBeVisible()

    const [lead] = leads(gravacoes)
    expect(lead.corpo).toEqual({
      variante: 'b',
      nome: 'Ana Souza',
      email: 'ana@empresa.com.br',
      whatsapp: '5511912345678',
      marketplace: 'Mercado Livre',
      faturamento: 'R$ 200 a 500 mil',
      anuncios: 'Sim',
      ferramenta: null,
      maior_dor: null,
      consentimento: true,
      utm_source: 'teste',
      utm_medium: null,
      utm_campaign: 'lancamento',
      referencia: null,
      armadilha: '',
    })
    expect(lead.url).toBe(`${SUPABASE_TESTE}/rest/v1/leads`)
    expect(lead.cabecalhos.apikey).toBe('sb_publishable_chave_de_teste')
    expect(lead.cabecalhos.prefer).toBe('return=minimal')
    expect(lead.cabecalhos.authorization).toBeUndefined()
  })

  test('confirma de outro jeito para quem está fora do perfil', async ({ page }) => {
    await simularSupabase(page)
    await page.goto('/?v=a')
    await preencherValido(page, 'Menos de R$ 50 mil')
    await page.getByRole('button', { name: 'Pedir meu Raio-X gratuito' }).click()
    await expect(page.getByText('Por enquanto, o Raio-X atende sellers')).toBeVisible()
  })

  test('se o banco falhar, mostra o erro e mantém o que foi digitado', async ({ page }) => {
    await simularSupabase(page, 500)
    await page.goto('/?v=a')
    await preencherValido(page)
    await page.getByRole('button', { name: 'Pedir meu Raio-X gratuito' }).click()
    await expect(page.getByRole('alert')).toContainText('Não foi possível enviar seu pedido.')
    // o navegador já tira espaços das pontas de campos de e-mail; o resto fica como foi digitado
    await expect(page.getByLabel('E-mail', { exact: true })).toHaveValue('Ana@Empresa.com.BR')
    await expect(page.getByLabel('WhatsApp com DDD')).toHaveValue('(11) 91234-5678')
  })
})

test.describe('medição', () => {
  test('registra visita, clique e início do formulário uma vez por sessão', async ({ page }) => {
    await comoPessoa(page)
    const gravacoes = await simularSupabase(page)
    await page.goto('/?v=c&utm_source=grupo-x')
    await expect.poll(() => eventos(gravacoes, 'visita').length).toBe(1)

    const botaoTopo = page.locator('#topo').getByRole('link', { name: 'Pedir meu Raio-X gratuito' })
    await botaoTopo.click()
    await botaoTopo.click()
    await page.getByLabel('Nome', { exact: true }).focus()
    await page.getByLabel('E-mail', { exact: true }).focus()
    await page.reload()
    await page.getByLabel('Nome', { exact: true }).focus()

    await expect.poll(() => eventos(gravacoes, 'inicio_formulario').length).toBe(1)
    expect(eventos(gravacoes, 'visita')).toHaveLength(1)
    expect(eventos(gravacoes, 'clique_cta')).toHaveLength(1)
    expect(eventos(gravacoes)[0].corpo).toMatchObject({ variante: 'c', utm_source: 'grupo-x' })
  })

  test('não conta navegadores automatizados', async ({ page }) => {
    const gravacoes = await simularSupabase(page)
    await page.goto('/?v=a')
    await page.locator('#topo').getByRole('link', { name: 'Pedir meu Raio-X gratuito' }).click()
    await page.waitForTimeout(300)
    expect(eventos(gravacoes)).toHaveLength(0)
  })
})

test.describe('página e acessibilidade', () => {
  test('a política de privacidade abre pelo rodapé e pelo consentimento', async ({ page }) => {
    await page.goto('/?v=a')
    await expect(page.getByRole('link', { name: /Política de privacidade \(abre em nova aba\)/ })).toHaveAttribute(
      'href',
      '/privacidade/',
    )
    await page.locator('footer').getByRole('link', { name: 'Política de privacidade' }).click()
    await expect(page).toHaveURL(/\/privacidade\/$/)
    await expect(page.locator('h1')).toHaveText('Política de privacidade')
    await page.getByRole('link', { name: 'Voltar para a página inicial' }).click()
    await expect(page.locator('h1')).toBeVisible()
  })

  test('campos ainda entre colchetes aparecem marcados em amarelo', async ({ page }) => {
    await page.goto('/?v=a')
    for (const valor of [config.prazoRaioX, config.prazoResposta, config.emailContato]) {
      if (estaPendente(valor)) {
        expect(await page.locator('mark.pendente', { hasText: valor }).count()).toBeGreaterThan(0)
      }
    }
  })

  test('sem rolagem horizontal em 360 px', async ({ page }) => {
    await page.setViewportSize({ width: 360, height: 740 })
    for (const caminho of ['/?v=a', '/?v=b', '/?v=c', '/privacidade/']) {
      await page.goto(caminho)
      const largura = await page.evaluate(() => ({
        documento: document.documentElement.scrollWidth,
        janela: window.innerWidth,
      }))
      expect(largura.documento, caminho).toBeLessThanOrEqual(largura.janela)
    }
  })

  test('botões mostram o texto com os espaços certos', async ({ page }) => {
    await page.goto('/?v=a')
    const textoVisivel = await page
      .locator('#topo')
      .getByRole('link', { name: 'Pedir meu Raio-X gratuito' })
      .evaluate((el) => (el as HTMLElement).innerText.replace(/\s+/g, ' ').trim())
    expect(textoVisivel).toBe('Pedir meu Raio-X gratuito')
    const larguraBotao = await page.getByRole('button', { name: 'Pedir meu Raio-X gratuito' }).evaluate((el) => {
      const intervalo = document.createRange()
      intervalo.selectNodeContents(el)
      return intervalo.getBoundingClientRect().width
    })
    expect(larguraBotao).toBeGreaterThan(150)
  })

  test('com movimento reduzido, a barra do raio-x fica parada', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' })
    await page.goto('/?v=a')
    const animacao = await page.locator('.segmento').first().evaluate((el) => getComputedStyle(el).animationName)
    expect(animacao).toBe('none')
  })

  test('sem violações graves de acessibilidade', async ({ page }) => {
    for (const caminho of ['/?v=a', '/privacidade/']) {
      await page.goto(caminho)
      await page.emulateMedia({ reducedMotion: 'reduce' })
      const resultado = await new AxeBuilder({ page }).analyze()
      const graves = resultado.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      expect(
        graves.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).join(', ')}`),
        caminho,
      ).toEqual([])
    }
  })

  test('no celular, a barra fixa aparece fora do topo e some no formulário', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'só no celular')
    await page.goto('/?v=a')
    const barra = page.getByTestId('barra-fixa')
    await expect(barra).not.toHaveClass(/visivel/)
    await page.locator('#como-funciona').scrollIntoViewIfNeeded()
    await expect(barra).toHaveClass(/visivel/)
    await page.locator('#pedir').scrollIntoViewIfNeeded()
    await expect(barra).not.toHaveClass(/visivel/)
  })
})
