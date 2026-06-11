# Tita Fotografia

Site estatico de portfolio profissional para fotografa/videomaker, com galeria de fotos, marca d'agua visual, carrinho e simulacao de pagamento.

## Como abrir

Abra o arquivo `index.html` no navegador.

## Como publicar no GitHub Pages

1. Crie um repositorio no GitHub.
2. Envie estes arquivos para a raiz do repositorio:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `.nojekyll`
   - `README.md`
3. No GitHub, acesse `Settings` > `Pages`.
4. Em `Build and deployment`, selecione:
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
5. Salve e aguarde o GitHub gerar o link publico.

## O que esta incluido

- Home visual com chamada de portfolio.
- Secoes de portfolio, servicos e contato.
- Galeria de cliente com fotos protegidas por marca d'agua.
- Upload local de novas fotos para demonstracao.
- Selecao de fotos por cliente.
- Carrinho com preco por foto.
- Simulacao de pagamento que libera as fotos sem marca d'agua.

## Observacao para producao

Esta versao pode ser publicada no GitHub Pages, mas o GitHub Pages hospeda apenas frontend estatico. Para vender fotos de verdade, a protecao precisa ser feita no backend:

- armazenar os arquivos originais em area privada;
- gerar previews com marca d'agua no servidor;
- integrar pagamento real, como Mercado Pago, Stripe ou Pix;
- liberar download dos originais somente apos confirmacao do pagamento.

Enquanto estiver apenas no GitHub Pages, o fluxo de compra funciona como demonstracao visual. Para uso comercial real, recomendo manter este site como vitrine publica e conectar a galeria de clientes a uma API/backend separado.
