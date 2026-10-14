# Margem Real: página de validação

Página que testa 3 posicionamentos do **Raio-X de Margem** e capta sellers do perfil para
diagnósticos gratuitos feitos à mão. "Margem Real" é um nome provisório.

**Situação:** ainda não publicada. Publicar depende da sua autorização; pelo plano, a página vai
ao ar nas semanas 3 e 4 da validação, com os títulos ajustados às palavras das primeiras entrevistas.

## O que tem aqui

| Caminho | O que é |
| --- | --- |
| `src/conteudo.ts` | Todos os textos: três versões do topo, seções, formulário, perguntas e política |
| `src/config.ts` | Campos entre colchetes a trocar antes de publicar e versões ativas |
| `src/lib/` | Regras: sorteio da versão, origem da visita, validação, envio ao Supabase e eventos |
| `supabase/schema.sql` | Tabelas `leads` e `eventos`; quem visita só consegue gravar |
| `supabase/consultas.sql` | Funil por versão e origem dos pedidos, só leitura |
| `supabase/limpeza.sql` | Apaga os testes; exclusão a pedido e prazo de guarda ficam desligados até você ativar |
| `tests/` | Testes de unidade (Vitest) e no navegador (Playwright, com o Supabase simulado) |
| `supabase/tests/test_sql.py` | Testes do banco em PostgreSQL |
| `docs/PROMPT-LOVABLE.md` | Prompt original da página, se quiser gerá-la no Lovable |

## Antes de publicar

1. Troque os campos entre colchetes em `src/config.ts`. Enquanto algum continuar entre colchetes,
   a página o mostra com fundo amarelo.
2. Escolha as versões. Sem conferir cobranças no Raio-X, use `versoesAtivas: ['a', 'b']`; com pouco
   tráfego, duas versões também bastam.
3. Crie um projeto gratuito no [Supabase](https://supabase.com) na região South America (São Paulo)
   e rode `supabase/schema.sql` no SQL Editor.
4. Copie `.env.example` para `.env.local` e preencha a URL do projeto e a chave publicável
   (`sb_publishable_...`) ou a anon antiga. Nunca use a chave secreta.

## Rodar no computador

Precisa do Node 20 ou mais novo.

```bash
npm install
cp .env.example .env.local   # depois preencha
npm run dev                  # abre em http://localhost:5173
```

Para ver uma versão específica do topo: `/?v=a`, `/?v=b` ou `/?v=c`.

## Testes

```bash
npm run typecheck
npm test                          # unidade
npx playwright install chromium   # só na primeira vez
npm run test:e2e                  # navegador, com o Supabase simulado
npm run test:sql                  # precisa de PostgreSQL 15+ (PGHOST, PGPORT, PGUSER, PGPASSWORD)
```

Resultado em 14/10/2026: 31 testes de unidade; 17 cenários no navegador, em celular e desktop,
incluindo acessibilidade com axe e tela de 360 px (33 execuções aprovadas e 1 pulada, por ser só de
celular); 26 verificações do banco num PostgreSQL 16. A conexão com um projeto Supabase real ainda
não foi testada, porque o projeto ainda não existe. O GitHub Actions roda todos esses testes a cada
envio para a branch `main`.

## Publicar (só com a sua autorização)

O site é estático: `npm run build` gera a pasta `dist`, e qualquer hospedagem de site estático
serve. Configure nela as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`.

- A Vercel não permite uso comercial no plano gratuito (Hobby); o plano Pro custa US$ 20 por mês.
- Cloudflare Pages e Netlify têm planos gratuitos; confira os termos de uso comercial antes de escolher.
- Com domínio próprio, troque `og:image` em `index.html` por um endereço absoluto. Para aparecer em
  buscas, retire a tag `noindex`.

## Divulgar e medir

- Divulgue sempre o link sem `?v=`, com um `utm_source` por canal, por exemplo
  `?utm_source=grupo-sellers-sp`. O sorteio divide as versões de forma justa; `?v=` serve só para testar.
- Faça os testes manuais com `?utm_source=teste` e depois rode `supabase/limpeza.sql`.
- Compare as versões com cerca de 100 visitas de sellers em cada uma. Com 100 visitas, um resultado
  de 15% tem margem de erro de uns 7 pontos para mais ou para menos. A hipótese H5 é atingida com 15% ou mais.
- Rode `supabase/consultas.sql` no SQL Editor para ver visitas, cliques, pedidos e conversão por versão.

## Dados e privacidade

- O formulário grava, só com consentimento, nome, e-mail, WhatsApp, onde vende, faturamento, se
  anuncia e, se a pessoa quiser, ferramenta e maior dor.
- Visitas e cliques são contados sem identificador, sem IP nas tabelas e sem cookies. A página não
  carrega scripts de terceiros, e as fontes vão junto do site.
- Quem visita não consegue ler, alterar nem apagar nada: RLS e permissões em `supabase/schema.sql`.
- A política promete apagar os dados até 31/03/2027 ou quando a pessoa pedir; os comandos estão em
  `supabase/limpeza.sql`.
- A política de privacidade e o texto de consentimento são modelos simples e não substituem
  orientação jurídica.

## Regras de conteúdo

Sem depoimentos, logotipos de clientes, contadores, estatísticas ou promessas de resultado. Os
números da página são exemplos fictícios, rotulados como tais, e os testes conferem que fecham a conta.
