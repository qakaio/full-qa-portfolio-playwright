# Rampz Store — QA Automation Portfolio

![Playwright CI](https://github.com/qakaio/full-qa-portfolio-playwright/actions/workflows/e2e.yml/badge.svg)

Projeto de portfólio de QA com automação de testes E2E usando Playwright.
Ele demonstra trabalho com testes de interface, regras de negócio, regressão,
responsividade, acessibilidade e evidências de execução em ambiente público.

> Ambiente de referência: https://qakaio.github.io/rampz-store/
>
> A aplicação é fictícia e não realiza pagamentos, pedidos ou envios reais.

## Resultado e valor para o portfolio

- 37 casos automatizados em 3 navegadores (Chromium, Firefox e WebKit)
- 111 execuções na matriz de testes de referência
- Integração com GitHub Actions para execução contínua
- Relatórios HTML e Allure com evidências de falhas e retries
- Cobertura de acessibilidade com axe-core e validações de UX

## O que está no repositório

- Testes E2E em Playwright para catálogo, carrinho, checkout, conta e contato
- Cobertura cross-browser em Chromium, Firefox e WebKit
- Smoke checks HTTP para validar deploy estático em GitHub Pages
- Testes de acessibilidade com axe-core
- Resumo de resultados por navegador para CI
- Documentação de estratégia, execução e matriz de casos

## Stack

- Node.js 20+
- Playwright Test
- JavaScript
- GitHub Actions
- Allure + HTML report
- axe-core

## Execução local

```bash
npm ci
npx playwright install chromium firefox webkit
npm run test:all
```

Comandos úteis:

```bash
npm run test:e2e
npm run test:e2e:ui
npm run test:e2e:headed
npm run test:summary
npx playwright test e2e/cart.spec.js --project=chromium
npx playwright test --grep "CART"
```

Relatórios:

```bash
npm run test:e2e:report
npm run allure:generate
npm run allure:open
```

## Cobertura atual

- Catálogo: busca, filtros, paginação, estoque e detalhes do produto
- Carrinho: adição, subtotal, quantidade, limites, remoção e persistência
- Checkout: validações, frete falhando e comportamento do carrinho vazio
- Conta e contato: validações de formulário e regras de negócio
- Interface: viewports, teclado, âncoras e auditoria de acessibilidade
- Deployment: status HTTP e MIME do HTML, CSS e JavaScript publicados

## Documentação

- [GUIA-AUTOMACAO-QA.md](./GUIA-AUTOMACAO-QA.md) — visão geral do projeto e estratégia de QA
- [TEST-CASE-MATRIX.md](./TEST-CASE-MATRIX.md) — matriz de casos automatizados e pendências
- [playwright.config.js](./playwright.config.js) — configuração da suíte
- [.github/workflows/e2e.yml](.github/workflows/e2e.yml) — pipeline de CI

## Status do projeto

Este repositório contém a suíte de testes e evidências de automação, não a aplicação comercial em si. A versão pública do projeto oferece a interface, mas não a API backend completa; por isso, casos de contrato de API e fluxos autenticados ficam como pendências quando o ambiente com backend estiver disponível.

## Autor

**Kaio Garcia** | QA Engineer

[GitHub](https://github.com/qakaio) · [LinkedIn](https://www.linkedin.com/in/kaioqa/)

