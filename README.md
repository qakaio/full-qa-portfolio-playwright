# Rampz Store — QA Automation Portfolio

Suíte de automação E2E em Playwright para a loja demo Rampz Store. O projeto
exercita fluxos observáveis no site publicado, com foco em catálogo, carrinho,
validação de formulários, responsividade e evidências de execução.

> **Ambiente testado:** [https://qakaio.github.io/rampz-store/](https://qakaio.github.io/rampz-store/)
>
> A aplicação é fictícia. Não são realizados pagamentos ou envios reais.

## Stack e execução

- Node.js 20+
- Playwright Test com Chromium
- Playwright APIRequestContext para smoke checks HTTP de deployment estático
- GitHub Actions para execução contínua
- Allure para resultados e relatórios

```powershell
npm ci
npx playwright install chromium
npm run test:e2e
```

O Playwright HTML report abre com `npm run test:e2e:report`. Os resultados
Allure são coletados automaticamente durante os testes; para gerar e abrir o
HTML, instale Java 17+ e execute:

```powershell
npm run allure:generate
npm run allure:open
```

Outros comandos úteis:

```powershell
npm run test:e2e:ui
npm run test:e2e:headed
npx playwright test e2e/cart.spec.js --project=chromium
npx playwright test --grep "CART"
```

## Cobertura atual

| Área | Cenários |
|---|---|
| Catálogo | Seed visual, busca sem diferenciar caixa, filtros combinados, ordenação, faixa de preço exata, limpeza, paginação, produto sem estoque e diálogo de detalhes. |
| Carrinho | Adição pelo diálogo de detalhes e adição repetida, subtotal, alteração de quantidade, limite de 10, limite de estoque, remoção parcial/total, persistência e storage corrompido. |
| Checkout | Campos obrigatórios, e-mail e CEP inválidos, erro de frete sem confirmação indevida e comportamento do checkout vazio. |
| Conta | Obrigatórios do cadastro, rejeição de CPF inválido sem persistir conta e confirmação de senha diferente. |
| Contato | Campos obrigatórios, formato de e-mail, tamanho mínimo e confirmação local sem chamada de envio. |
| Interface | Viewports de 320–1440 px, navegação por teclado, nomes acessíveis, âncoras e exceções JavaScript. |
| Deployment | Status HTTP e tipo de conteúdo da página publicada, CSS e JavaScript. Esses checks não substituem testes da API de negócio. |

**Execução de referência:** 34 testes Playwright em Chromium; `npm ci` e
`npm run test:e2e` validados localmente. O caso CHK-01 é uma falha esperada
intencional: o site público deixa o botão de checkout habilitado com o
carrinho vazio.

## CI e evidências

O workflow [`.github/workflows/e2e.yml`](.github/workflows/e2e.yml) executa em
pull requests, push, acionamento manual e semanalmente. Instala Node.js,
Chromium e Java 17, roda a suíte e publica os relatórios Playwright/Allure e
evidências de falha como artifact da execução por 14 dias.

## Limitações e próximos passos

O repositório contém testes, não o código da aplicação. A versão GitHub Pages
disponibiliza a interface, mas não a API Node.js descrita no
[guia de automação](./GUIA-AUTOMACAO-QA.md). Por isso, cenários de contrato da
API, cupons, cotação de frete bem-sucedida, pagamento, pedidos, login
autenticado e administração precisam de um ambiente de aplicação com backend
disponível antes de serem cobertos como jornadas positivas.

Próximos itens do portfólio:

- [ ] Cobertura de API contra ambiente que exponha a API de demonstração.
- [ ] Automatizar os demais cenários E2E quando a aplicação/backend estiverem disponíveis.
- [x] CI com GitHub Actions.
- [x] Relatórios Allure.

Veja o [guia completo](./GUIA-AUTOMACAO-QA.md) para estratégia, backlog,
dados de teste e recomendações de QA. A [matriz de casos](./TEST-CASE-MATRIX.md)
registra cenários automatizados, defeito conhecido e itens pendentes.
