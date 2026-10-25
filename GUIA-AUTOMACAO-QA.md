# Guia de automação QA — Rampz Store

Este guia orienta a criação de uma suíte de automação para apresentar a Rampz
Store como projeto de portfolio de QA. O foco é demonstrar planejamento,
automação de interface e API, validação de regras de negócio, evidências de
execução e controle de qualidade.

> A Rampz Store é uma aplicação fictícia de treinamento. Cadastro, login,
> pedidos, pagamentos, Pix, boleto e administração são demonstrações locais.
> Não são enviados pagamentos, e-mails ou pedidos reais.
> BASE URL: https://qakaio.github.io/rampz-store

## 1. O que existe no projeto

- BASE URL: https://qakaio.github.io/rampz-store
- Frontend em HTML, CSS e JavaScript sem framework.
- Servidor Node.js local, com API demonstrativa para catálogo, frete e cupons.
- Dados da API em memória e dados da experiência web principalmente em
  `localStorage`.
- 20 produtos no seed; o catálogo apresenta 12 produtos por página.
- Conta demo de cliente: `cliente@rampz.test` / `Teste@1234`.
- Conta demo de administrador: `admin@rampz.test` / `Admin@1234`.
- Contas bloqueada e inativa disponíveis para testar regras de login:
  `bloqueado@rampz.test` e `inativo@rampz.test` (use a senha incorreta padrão
  `WrongPassword@1` para validar a mensagem genérica).
- Produto 12 sem estoque; produto 11 de alto valor para cenários de cartão.
- Cupons de demonstração: `LAB20`, `FRETEGRATIS`, `BEMVINDO10` e um cupom
  expirado (`EXPIRADO`). As regras e elegibilidade estão implementadas no
  servidor.

As contas são dados públicos de demonstração, nunca use senhas pessoais. O
painel administrativo é local e não deve ser considerado um sistema seguro de
produção.

O endereço público informado neste projeto é servido pelo GitHub Pages. A
interface e o catálogo carregam, mas a API Node.js descrita acima não está
publicada nesse endereço; frete e outros fluxos que dependem dela não podem ser
validados como happy path nessa URL.

## 2. Preparação e comandos

Requisitos: Node.js 20 ou superior. No PowerShell, a partir da pasta do
projeto:

```powershell
npm ci
npx playwright install chromium
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:headed
npx playwright test e2e/cart.spec.js --project=chromium
npx playwright test --grep "CART"
npx playwright test --repeat-each=2
npm run allure:generate
```

Por padrão, a suíte acessa a versão publicada em
`https://qakaio.github.io/rampz-store/`; não inicia servidor local nem executa
reset remoto. Para apontar os testes a outro ambiente, defina
`PLAYWRIGHT_BASE_URL` antes de executar a suíte.

Os relatórios Playwright e Allure e os traces são salvos em `playwright-report/`,
`allure-report/`, `allure-results/` e `test-results/`. A geração do HTML Allure
requer Java 17 ou superior. Para abrir os relatórios após a execução:

```powershell
npm run test:e2e:report
npm run allure:open
```

O workflow `.github/workflows/e2e.yml` executa Chromium, Firefox e WebKit em
pull requests, pushes, execução manual e semanalmente às segundas-feiras. Os
relatórios e evidências são publicados como artefato da execução por 14 dias;
Java 17 é instalado pelo workflow para gerar o HTML Allure.
O resumo do job mostra contagens de aprovação, falhas esperadas, falhas
inesperadas e retries por navegador; localmente, `npm run test:summary` lê o
JSON da última execução.

## 3. Estratégia de testes

Organize a suíte por nível, evitando tentar provar tudo pelo navegador:

1. **Testes de regras/unitários**: limites exatos de cupom e frete, dados
   inválidos e cálculos sem iniciar servidor de browser. Esses testes dependem
   do código local da aplicação, que não faz parte deste repositório de testes.
2. **Testes de API**: status HTTP, formato JSON, validações, seed, headers,
   limites de requisição e rotas inexistentes. Não são executados contra o
   site publicado: a API demonstrativa descrita neste guia não está disponível
   na hospedagem GitHub Pages.
3. **Testes E2E**: jornadas de ponta a ponta e resultados visíveis pelo usuário,
   executados contra a URL publicada. Os specs estão separados por catálogo,
   carrinho, checkout, contato e verificações de interface em `e2e/`.
4. **Smoke checks HTTP de deployment**: status e content-type do HTML, CSS e
   JavaScript publicados. Esses GETs verificam a hospedagem estática, não o
   contrato da API de negócio.
5. **Testes não funcionais leves**: responsividade, teclado, ausência de
   overflow e auditoria automatizada axe-core para WCAG 2.1 A/AA. São
   verificações cross-browser; não substituem avaliação manual, leitor de tela
   ou testes de desempenho.

Uma boa suíte não precisa repetir a mesma regra em todos os níveis. Por
exemplo, validar muitas combinações de cálculo de frete é mais rápido no teste
de regras/API; no browser, valide pelo menos a jornada e a apresentação do
resultado ao usuário.

## 4. Cobertura E2E implementada

Os casos abaixo estão automatizados nos arquivos `e2e/*.spec.js` e executam
contra a versão publicada. O conjunto foi ampliado com cenários do backlog e
inclui somente comportamentos verificáveis nessa aplicação publicada.
Para IDs, prioridade, status e limitações por caso, consulte
[`TEST-CASE-MATRIX.md`](./TEST-CASE-MATRIX.md).

| Área | Casos existentes |
|---|---|
| Catálogo | Seed visual e paginação; busca sem diferenciar caixa; estado vazio e limpeza; combinação de categoria, faixa de preço, estoque e ordenação; filtro de preço exato; detalhes do produto fechados por Escape ou botão; produto indisponível. |
| Carrinho | Adição pelo diálogo de detalhes e adição repetida do mesmo produto; subtotal; alteração de quantidade; limites máximo e de estoque; remoção de um ou todos os itens; persistência após recarregar; recuperação de conteúdo corrompido no `localStorage`. |
| Checkout | Abertura com item; validação de endereço obrigatório, e-mail e CEP; estado quando a API pública de frete falha, sem avanço ou confirmação falsa. |
| Conta | Validação de campos obrigatórios, CPF inválido sem persistir conta e confirmação de senha diferente no cadastro local. Login, pedidos e administração não foram automatizados porque a autenticação publicada não está acessível sem a API. |
| Contato | Campos obrigatórios; formato de e-mail; tamanho mínimo da mensagem; confirmação local sem requisição de envio. |
| Layout, teclado e acessibilidade | Viewports de 320, 390, 768, 1280 e 1440 px; atalho `/`; navegação por âncoras; nomes acessíveis nos controles principais e hierarquia básica de headings; exceções JavaScript; auditoria axe-core WCAG 2.1 A/AA (UI-05, baseline conhecido). |
| Deployment | Resposta HTTP 200 e tipo de conteúdo do documento principal, do CSS e do JavaScript publicados. Não valida endpoints da API de negócio. |

Os testes `CHK-01` e `CART-04` verificam e documentam o estado do checkout
vazio. `CHK-01` está marcado como falha esperada: a versão publicada deixa o
botão de checkout habilitado quando o carrinho está vazio, contrariando o
comportamento desejado. Se esse comportamento for corrigido no site, remova a
anotação `test.fail` para que a regressão volte a ser tratada como falha
inesperada.

## 5. Catálogo de test cases para ampliar a cobertura

Use os casos abaixo como backlog adicional. Cenários já cobertos na tabela de
cobertura acima devem ser removidos do backlog ao evoluir a suíte. Não marque
um caso como automatizado sem teste e execução comprovável.

### 5.1 Catálogo e navegação

| ID | Prioridade | Cenário | Resultado esperado |
|---|---|---|---|
| CAT-01 | P1 | Validar resposta da API de categorias e produtos | Contrato HTTP/JSON validado contra um ambiente que exponha a API. |
| CAT-05b | P2 | Preço mínimo maior que máximo ou preço negativo | Registrar a regra de negócio esperada antes de automatizar. |
| CAT-07 | P1 | API de categorias ou produtos indisponível/inválida | Mensagem de erro explícita; não mostrar sucesso com dados stale. |
| CAT-09 | P2 | Validar link da marca e links/âncoras ainda não cobertos | Navegação/scroll chega à seção correta. |

### 5.2 Carrinho

| ID | Prioridade | Cenário | Resultado esperado |
|---|---|---|---|
| CART-06b | P2 | Estoque muda entre catálogo e checkout | Usuário recebe erro claro e não consegue confirmar quantidade que deixou de estar disponível. |
| CART-07 | P2 | Fazer login/logout com carrinho já preenchido | Confirmar o comportamento intencional de merge/troca entre carrinho anônimo e carrinho da conta. |

### 5.3 Checkout, frete e cupons

| ID | Prioridade | Cenário | Resultado esperado |
|---|---|---|---|
| CHK-03 | P1 | Calcular frete para CEP de regiões diferentes | Região, prazo e preço correspondem às regras simuladas. |
| CHK-04 | P1 | Frete grátis no limite exato e acima do limite | Confirmar o comportamento de fronteira (R$ 500 e R$ 500,01). |
| CHK-05 | P1 | Aplicar `LAB20` abaixo e acima do mínimo | Abaixo do limite rejeita; acima aplica desconto elegível. |
| CHK-06 | P1 | Aplicar `FRETEGRATIS` abaixo e acima do mínimo | Benefício aparece somente quando elegível. |
| CHK-07 | P1 | `BEMVINDO10` para primeira compra e cliente com compra paga anterior | Elegibilidade considera pedido pago do mesmo e-mail, não pedido pendente ou de outro cliente. |
| CHK-08 | P2 | Cupom desconhecido, expirado, espaços e diferenças de caixa | Regra de normalização/erro é consistente e compreensível. |
| CHK-09 | P1 | Mudar cupom ou endereço depois de calcular frete | Total e opção de frete recalculam; não usar cotação antiga indevidamente. |
| CHK-11 | P1 | Voltar entre etapas e alterar quantidade/dados | Resumo reflete os dados mais recentes e não duplica desconto/frete. |
| CHK-12 | P1 | Confirmar pedido após revisão | Número, itens, valores e status exibidos são consistentes com a jornada. |

### 5.4 Pagamentos demo e pedidos

| ID | Prioridade | Cenário | Resultado esperado |
|---|---|---|---|
| PAY-01 | P1 | Cartão demo aprovado | Pedido marcado pago; mensagem esclarece que nenhuma cobrança ocorreu. |
| PAY-02 | P1 | Cartão demo recusado ou timeout | Sem pedido confirmado, sem cobrança e carrinho preservado; erro permite tentar novamente. |
| PAY-03 | P1 | Total abaixo do mínimo de parcela | Cartão não avança; método alternativo segue disponível. |
| PAY-04 | P1 | Pix | Desconto demonstrativo e código/QR identificado como fictício; status esperado documentado. |
| PAY-05 | P1 | Boleto | Código identificado como fictício e pedido pendente. |
| PAY-06 | P1 | Clique duplo/duas confirmações rápidas | Não gerar pedido duplicado nem estados inconsistentes. |
| PAY-07 | P2 | Atualizar ou voltar da tela de confirmação | Não repetir a criação do pedido; confirmação continua coerente. |
| ORD-01 | P1 | Cliente visualiza pedidos pagos e pendentes | Apenas pedidos apropriados à conta são exibidos com status correto. |
| ORD-02 | P1 | Cancelar pedido pendente | Status passa a cancelado e ação deixa de estar disponível. |
| ORD-03 | P1 | Tentar cancelar pedido pago ou cancelado | A ação é impedida conforme a regra de transição. |
| ORD-04 | P1 | Admin atualiza um pedido pendente | Status permitido é salvo e renderizado; testar também transições inválidas. |
| ORD-05 | P2 | Pedido de outra conta | Não aparece no histórico de cliente diferente. |

### 5.5 Conta, administração e contato

| ID | Prioridade | Cenário | Resultado esperado |
|---|---|---|---|
| ACC-01 | P1 | Login válido de cliente e admin | Abre o painel da função correta. |
| ACC-02 | P1 | E-mail desconhecido e senha incorreta para conta existente | Mesma mensagem genérica, evitando revelar existência da conta. |
| ACC-03 | P1 | Conta bloqueada/inativa | Login não cria sessão; mensagem é clara sem expor dados desnecessários. |
| ACC-04 | P2 | Limite de tentativas de login e bloqueio temporário | Após o limite, comportamento e tempo de recuperação seguem a regra implementada. |
| ACC-05 | P1 | Cadastro com e-mail inválido, CPF inválido ou duplicado | Validação impede cadastro e mantém feedback por campo/formulário. |
| ACC-06 | P1 | Cadastro com senha fraca ou confirmação coincidente porém inválida | Não cria conta. |
| ACC-07 | P1 | Recuperação com e-mail/token incorreto ou token já usado | Não troca senha; feedback não confirma a existência da conta. |
| ACC-08 | P2 | Sessão após reload, expiração e logout | Persistência/expiração respeita o comportamento demo documentado. |
| ADM-01 | P1 | Criar/editar/excluir produto | Alterações locais refletem na lista e persistem no browser conforme esperado. |
| ADM-02 | P1 | Salvar produto com nome/preço/estoque inválido | Formulário rejeita dados inválidos e informa o problema. |
| ADM-03 | P2 | Editar imagem/campos opcionais e cancelar edição | Sem corrupção de dados nem alteração involuntária. |
| ADM-04 | P1 | Usuário cliente tenta acessar controles administrativos | Controles não aparecem nem ficam acessíveis pela interface. |
| ADM-05 | P1 | Alterar status de pedido para transição não permitida | Operação é bloqueada ou erro é mostrado; estado anterior permanece. |

### 5.6 API e não funcionais

| ID | Prioridade | Cenário | Resultado esperado |
|---|---|---|---|
| API-01 | P1 | Catálogo: busca, paginação, categoria, preço, estoque e ordenação | Status, formato, total e itens correspondem aos parâmetros. |
| API-02 | P1 | Produto inexistente e endpoint inexistente | 404 com formato apropriado (API JSON vs página pública). |
| API-03 | P1 | CEP/payload de frete inválidos e subtotal fora do limite | Erro de cliente documentado; não retornar cotação de sucesso. |
| API-04 | P1 | Cupom elegível, inelegível, expirado, desconhecido e payload malformado | Status e conteúdo correspondem à regra; testar limites exatos. |
| API-05 | P1 | POST sem Content-Type, método incorreto e body malformado | Resposta 4xx apropriada, sem crash do servidor. |
| API-06 | P2 | `HEAD` para recursos que aceitam `GET` | Status/headers equivalentes sem corpo. |
| API-07 | P1 | Reset do seed em `NODE_ENV=test` e fora dele | Restaura seed somente em modo de teste; fora dele retorna proibido. |
| API-08 | P2 | Rate limit de escrita e `Retry-After` | Excesso retorna 429; validar isoladamente para não afetar a suíte paralela. |
| API-09 | P1 | Headers de segurança e conteúdo servido | Headers esperados; arquivos internos/configuração não são servidos. |
| UI-02 | P1 | Navegação por teclado e foco visível dos controles interativos | Busca abre/foca; foco visível; controles operáveis sem mouse. |
| UI-05 | P2 | Ampliar auditoria de acessibilidade para fluxos interativos e avaliação manual | Auditar diálogos e formulários; complementar axe-core com teclado e leitor de tela. |
| UI-04 | P2 | Monitorar erros de console e falhas de rede não esperadas | Distinguir erros conhecidos de APIs indisponíveis no ambiente público. |

O backlog é uma proposta de portfolio, não uma afirmação de que todos esses
comportamentos já existem ou passaram. Quando o comportamento esperado não
estiver claro (ex.: valores invertidos nos filtros), alinhe a regra ou registre
um bug antes de fixar uma expectativa no teste.

## 6. Dados de teste importantes

| Dado | Uso sugerido |
|---|---|
| Produto 3 — `Glass Beaker 250ml`, R$ 18,50 | Carrinho barato, total abaixo do mínimo de parcela. |
| Produto 11 — microscópio, R$ 1.299, estoque 8 | Cartão com total suficiente para parcela mínima. |
| Produto 12 — estoque 0 | Indisponibilidade e bloqueio de compra. |
| Produto 13 — estoque 3 | Limite de estoque menor que 10 (bom candidato a caso de fronteira). |
| Produto 19 — R$ 7,50 | Total baixo e validação de valores pequenos. |
| CEP `01310-000` | Sudeste, usado nos exemplos da suíte. |
| CEP iniciado em `8` / `4` | Sul / outras regiões nas regras de frete. |
| E-mail `novo@rampz.test` | Conta seed de cliente; escolha um e-mail exclusivo para cenário de cadastro. |
| E-mail `cliente@rampz.test` | Conta demo com pedido pago e pedido pendente no seed. |

Mantenha dados determinísticos. Não dependa de um estado criado por outro teste
e não reutilize o mesmo storage state entre testes que alteram conta, carrinho,
pedido ou produto.

## 7. Exemplo de estrutura e scripts

A suíte é separada por fluxo, sem dependências entre arquivos:

```text
e2e/
  helpers.js
  catalog.spec.js
  cart.spec.js
  checkout.spec.js
  account.spec.js
  contact.spec.js
  accessibility-responsive.spec.js
```

Page objects são opcionais. Helpers pequenos para preparar um contexto limpo
ou adicionar um produto ficam em `e2e/helpers.js`; mantenha os asserts e regras
importantes nos próprios testes.

Exemplo de padrão para teste independente:

```js
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("https://qakaio.github.io/rampz-store/");
  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });
  await page.reload();
});

test("adiciona item ao carrinho e atualiza o subtotal", async ({ page }) => {
  await page.getByTestId("add-to-cart-button-3").click();
  await page.getByTestId("open-cart-button").click();

  await expect(page.getByTestId("cart-item-3")).toBeVisible();
  await expect(page.getByTestId("cart-subtotal")).toContainText("18,50");
});
```

O reset da API limpa somente os dados em memória do servidor; não apaga o
`localStorage`. A suíte publicada não chama esse endpoint: cada teste usa um
contexto novo e limpa `localStorage` e `sessionStorage` antes de validar a
página. Nunca use o reset de teste no servidor normal de desenvolvimento ou
em qualquer ambiente publicado.

### Recomendações para scripts robustos

- Prefira `getByTestId()` para contratos de teste explícitos e
  `getByRole()`/`getByLabel()` quando estiver validando acessibilidade e
  semântica. Evite seletores frágeis por classe de estilo ou posição.
- Use asserts sobre resultados do usuário: status, mensagem, total, quantidade
  e elemento visível. Verifique storage apenas quando a persistência em si for
  o requisito.
- Use `await expect(locator).toBeVisible()` e assertions que fazem retry. Não
  use `waitForTimeout()` como sincronização; espere estado da UI ou resposta de
  rede.
- Para estados de carregamento, controle a chamada com `page.route()` e
  libere-a no próprio teste, como no cenário de frete, em vez de depender de
  latência aleatória.
- Em erros de pagamento, verifique também os efeitos colaterais: sem pedido
  novo, carrinho preservado e nenhuma tela de confirmação.
- Em formulários, cubra happy path, obrigatório ausente, formato inválido e
  limites de comprimento/valor. Use `evaluate(input => input.validity.valid)`
  somente quando a validação HTML nativa for parte do comportamento sob teste.
- Evite afirmar que um e-mail foi enviado ou um pagamento ocorreu: valide o
  aviso explícito de que a operação é simulada.
- Crie helpers pequenos com parâmetros para variações reais; mantenha os
  asserts no teste para que a intenção continue legível.
- Não compartilhe objetos mutáveis, contas ou dados entre workers. Cada teste
  deve abrir contexto isolado e preparar seus próprios dados.
- Use nomes descritivos (`area - ação - resultado`), IDs de test case e
  tags de prioridade quando a suíte crescer.
- Não esconda falhas com retry excessivo. O retry de CI ajuda a coletar
  evidência, mas falha intermitente deve ser investigada e corrigida.

## 8. Boas práticas para portfolio

Para apresentar o trabalho, inclua no repositório ou na descrição do portfolio:

1. Objetivo e escopo da aplicação, deixando explícito o que é simulado.
2. Estratégia por níveis (unitário/API/E2E) e critérios de prioridade.
3. Casos de teste com ID, pré-condição, passos, dados, resultado esperado,
   prioridade e status (automatizado/manual/pendente).
4. Evidências de execução: comando, versão de Node/Playwright, navegador,
   resultado, relatório HTML e trace de falha quando aplicável.
5. CI executando checks e a suíte E2E em Chromium, Firefox e WebKit.
6. Exemplos de bug report reproduzível, com ambiente, passos, esperado,
   obtido, evidência e severidade.
7. Uma seção de limitações: API simplificada, dados locais/in-memory, ausência
   de cobrança/e-mail real e escopo de navegadores efetivamente testados.

Não publique vídeos, traces ou screenshots que contenham dados pessoais. Para
esta loja, use somente os dados fictícios deste guia e endereços de teste.

## 9. Critério de conclusão sugerido

Uma entrega de automação pode ser considerada pronta para portfolio quando:

- Os fluxos P1 principais têm casos determinísticos e assertions úteis.
- O E2E pode ser executado do zero com um único comando e não depende de
  ordem entre testes.
- API e regras de negócio têm testes próprios para limites e entradas inválidas.
- Falhas são diagnosticáveis via relatório/trace e os dados não vazam entre
  execuções.
- CI roda a suíte e comunica corretamente sucesso ou falha.
- O README/este guia distingue cobertura implementada de backlog e limitações.

### Checklist de evolução

- [ ] Cobrir testes de API.
- [ ] Cobrir todos os cenários E2E do backlog aplicáveis.
- [x] Automatizar CI dos testes e artefatos de relatório com GitHub Actions.
- [x] Implementar relatórios Allure.

O workflow cobre CI da suíte. Deploy contínuo não foi configurado: este
repositório contém apenas automação, e a aplicação exercitada já está hospedada
em GitHub Pages; não há código de aplicação ou artefato de produção para
publicar a partir deste projeto.
