# Matriz de casos de teste

Ambiente: `https://qakaio.github.io/rampz-store/`  
Execução de referência: 35 casos em Chromium, Firefox e WebKit (105 execuções).

## Casos automatizados

| ID | Prioridade | Cenário | Spec | Status |
|---|---|---|---|---|
| DEP-01 | P1 | Página publicada responde 200 como HTML da Rampz Store | `e2e/deployment-smoke.spec.js` | Automatizado |
| DEP-02 | P1 | CSS e JavaScript publicados respondem 200 com MIME esperado | `e2e/deployment-smoke.spec.js` | Automatizado |
| UI-01 | P1 | Sem overflow horizontal nos viewports de 320 a 1440 px | `e2e/accessibility-responsive.spec.js` | Automatizado |
| UI-02 | P1 | Atalho `/` foca o campo de busca | `e2e/accessibility-responsive.spec.js` | Automatizado |
| UI-03 | P2 | Controles principais têm nomes acessíveis e há um H1 | `e2e/accessibility-responsive.spec.js` | Automatizado |
| UI-04 | P2 | Carregamento inicial não lança exceção JavaScript | `e2e/accessibility-responsive.spec.js` | Automatizado |
| UI-05 | P1 | Axe verifica critérios WCAG 2.1 A/AA na página inicial | `e2e/accessibility-responsive.spec.js` | Falha esperada — violações conhecidas |
| CAT-01 | P1 | Catálogo mostra produtos, categoria e paginação do seed | `e2e/catalog.spec.js` | Automatizado |
| CAT-01b | P1 | Produto sem estoque não oferece ação de compra | `e2e/catalog.spec.js` | Automatizado |
| CAT-02 | P1 | Busca ignora caixa e permite limpar estado sem resultados | `e2e/catalog.spec.js` | Automatizado |
| CAT-03 | P1 | Categoria, preço, estoque e ordenação são combinados | `e2e/catalog.spec.js` | Automatizado |
| CAT-04 | P1 | Limpar filtros restaura catálogo e valores padrão | `e2e/catalog.spec.js` | Automatizado |
| CAT-05 | P2 | Preço mínimo igual ao máximo retorna produto correspondente | `e2e/catalog.spec.js` | Automatizado |
| CAT-06 | P2 | Paginação avança e retorna sem duplicar produtos | `e2e/catalog.spec.js` | Automatizado |
| CAT-08a | P2 | Diálogo de produto fecha com Escape e devolve o foco | `e2e/catalog.spec.js` | Automatizado |
| CAT-08b | P2 | Diálogo de produto fecha pelo botão | `e2e/catalog.spec.js` | Automatizado |
| CART-01 | P1 | Adições repetidas consolidam quantidade e atualizam subtotal | `e2e/cart.spec.js` | Automatizado |
| CART-01b | P1 | Adiciona produto ao carrinho pelo diálogo de detalhes | `e2e/catalog.spec.js` | Automatizado |
| CART-02 | P1 | Quantidade do carrinho não passa de 10 | `e2e/cart.spec.js` | Automatizado |
| CART-03 | P1 | Itens e quantidade persistem após reload | `e2e/cart.spec.js` | Automatizado |
| CART-04a | P1 | Remover o último produto exibe estado vazio | `e2e/cart.spec.js` | Automatizado |
| CART-04b | P1 | Remover item atualiza subtotal; remover restante esvazia carrinho | `e2e/cart.spec.js` | Automatizado |
| CART-05 | P2 | Storage de carrinho corrompido não impede abrir o carrinho | `e2e/cart.spec.js` | Automatizado |
| CART-06 | P2 | Quantidade máxima respeita o estoque disponível | `e2e/cart.spec.js` | Automatizado |
| CHK-01 | P1 | Checkout vazio deve estar indisponível | `e2e/checkout.spec.js` | Automatizado — falha esperada conhecida |
| CHK-02a | P1 | Endereço vazio não avança checkout | `e2e/checkout.spec.js` | Automatizado |
| CHK-02b | P1 | E-mail/CEP inválidos não avançam checkout | `e2e/checkout.spec.js` | Automatizado |
| CHK-10 | P1 | Falha pública de frete mostra erro e não confirma pedido | `e2e/checkout.spec.js` | Automatizado |
| ACC-05 | P1 | Campos obrigatórios vazios impedem cadastro | `e2e/account.spec.js` | Automatizado |
| ACC-05b | P1 | CPF inválido mostra erro e não salva cadastro | `e2e/account.spec.js` | Automatizado |
| ACC-06 | P1 | Senhas diferentes não criam cadastro | `e2e/account.spec.js` | Automatizado |
| CON-01a | P1 | Campos obrigatórios vazios impedem envio do contato | `e2e/contact.spec.js` | Automatizado |
| CON-01b | P1 | E-mail e mensagem fora do formato/tamanho são inválidos | `e2e/contact.spec.js` | Automatizado |
| CON-02 | P1 | Contato válido apresenta confirmação local sem requisição | `e2e/contact.spec.js` | Automatizado |
| NAV-01 | P2 | Âncoras de categorias, história e contato navegam corretamente | `e2e/accessibility-responsive.spec.js` | Automatizado |

## Defeito conhecido

`CHK-01`: a versão publicada mantém habilitado o botão **Continue to checkout**
mesmo com o carrinho vazio. O teste usa `test.fail` para registrar a expectativa
de produto sem tornar a execução da suíte instável. Remova essa anotação quando
o comportamento for corrigido para transformar qualquer recorrência em falha
inesperada do CI.

## Pendências e limites do ambiente

| Área | Situação | Motivo/próximo passo |
|---|---|---|
| API de catálogo, frete e cupons | Pendente | GitHub Pages não publica a API Node.js; executar quando houver URL de backend de teste. |
| Pagamento, pedidos e regras de cupom | Pendente | Dependem da API e de dados isolados/resetáveis. |
| Login autenticado, histórico de pedidos e logout | Pendente | Requer serviço de autenticação disponível no ambiente testado. |
| Administração e transições de pedidos | Pendente | Requer API e contas/dados seed de teste. |
| CAT-05b, limites de preços inválidos/invertidos | Pendente | Definir o comportamento esperado antes de fixar asserts. |
| CART-06b, estoque alterado entre catálogo e checkout | Pendente | Requer alteração concorrente do estoque no backend. |
| Acessibilidade em estados interativos e avaliação manual | Pendente | UI-05 audita a página inicial; ampliar para diálogos/formulários e fazer avaliação com teclado/leitor de tela. |
| Cross-browser | Automatizado | Os 35 casos executam em Chromium, Firefox e WebKit no CI. |

### Baseline de acessibilidade

Na execução de referência, axe-core encontrou 88 nós afetados por duas regras
de impacto sério: contraste insuficiente (`color-contrast`, 73 nós) e
incompatibilidade entre texto visível e nome acessível
(`label-content-name-mismatch`, 15 nós). Como este repositório contém apenas
os testes e o site é publicado em outro repositório, `UI-05` fica marcado como
falha esperada para preservar os detalhes no relatório sem tornar o CI
vermelho. Quando a aplicação corrigir esses problemas, a anotação deve ser
removida; um resultado limpo passará a ser obrigatório.

Os dois smoke tests `DEP-*` verificam a entrega estática (HTML/CSS/JavaScript)
por HTTP; não devem ser contabilizados como cobertura dos endpoints da API de
negócio.
