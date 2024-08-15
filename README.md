# Web Scraper para Notebooks com Paginação

Este projeto é um web scraper construído com Node.js, Axios e Cheerio que coleta informações sobre notebooks listados em um site de e-commerce. O scraper navega por múltiplas páginas para extrair detalhes como título, descrição, preço, imagem, número de reviews, número de estrelas e preços de HDDs disponíveis.

## Funcionalidades

- Extrai informações de notebooks, incluindo título, descrição, preço, URL da imagem, reviews e número de estrelas.
- Calcula os preços de HDDs adicionais com base no preço inicial do notebook.
- Suporta paginação, coletando dados de todas as páginas disponíveis.
- Exibe os dados ordenados pelo preço dos notebooks em ordem crescente.

## Requisitos

- Node.js
- npm ou yarn

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/AgdaScript/WebScrapingLenovoNotebooks.git
   
2. Instale as dependências:
   
    ```bash
    npm install

3. Acesse a API:
   ```bash
   http://localhost:3000/api/notebooks

## Estrutura do projeto
Contém todo o código da API, incluindo a lógica de scraping e o servidor Express.

## Exemplo de resposta
```json
{
  "title": "Aspire E1-510",
  "description": "15.6\", Pentium N3520 2.16GHz, 4GB, 500GB, Linux",
  "price": 306.99,
  "imageURL": "https://webscraper.io/images/test-sites/e-commerce/items/cart2.png",
  "reviews": "2 reviews",
  "rating": 3,
  "hdds": [
    {
      "hdd": "128",
      "price": 306.99
    },
    {
      "hdd": "256",
      "price": 326.99
    },
    {
      "hdd": "512",
      "price": 346.99
    },
    {
      "hdd": "1024",
      "price": 366.99
    }
  ]
}
```

## Tecnologias Utilizadas
Node.js: Ambiente de execução do JavaScript.
Express: Framework web para Node.js.
Axios: Cliente HTTP para fazer requisições ao site.
Cheerio: Biblioteca para fazer parsing de HTML e realizar o web scraping.
