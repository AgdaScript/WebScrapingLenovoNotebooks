const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const port = 3000;

// Função para obter detalhes dos notebooks
async function getNotebookDetails(notebookURL, basePrice) {
    try {
        // Usar o preço base para o primeiro HDD e incrementar para HDDs adicionais
        const hdds = [];
        const baseHddPrice = basePrice;
        const hddPrices = [baseHddPrice, baseHddPrice + 20, baseHddPrice + 40, baseHddPrice + 60];

        // Simular a obtenção de HDDs e seus preços (já que não extraímos os preços dos elementos)
        const hddValues = ['128', '256', '512', '1024'];
        
        for (let i = 0; i < hddValues.length; i++) {
            hdds.push({ hdd: hddValues[i], price: hddPrices[i] });
        }

        return hdds;
    } catch (error) {
        console.error('Erro ao buscar detalhes do notebook:', error.message);
        return [];
    }
}

// Função para obter os dados dos notebooks
async function getNotebooks() {
    const baseURL = 'https://webscraper.io/test-sites/e-commerce/static/computers/laptops';
    let allNotebooks = [];

    try {
        // Função auxiliar para fazer scraping em uma página
        async function scrapePage(url) {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            
            const notebookPromises = $('.thumbnail').map(async (index, element) => {
                const priceText = $(element).find('.price').text().trim();
                const title = $(element).find('.title').text().trim();
                const description = $(element).find('.description').text().trim();
                const imageURL = $(element).find('.image').attr('src');
                const notebookURL = `https://webscraper.io${$(element).find('.title').attr('href')}`;
                const price = parseFloat(priceText.replace('$', '').replace(',', ''));

                // Obter detalhes dos HDDs para cada notebook
                const hdds = await getNotebookDetails(notebookURL, price);
                
                return {
                    title,
                    description,
                    price,
                    imageURL: `https://webscraper.io${imageURL}`,
                    reviews: $(element).find('.ratings > p').text().trim(),
                    hdds // Incluir os HDDs com preços
                };
            }).get();

            const notebooks = await Promise.all(notebookPromises);
            allNotebooks = allNotebooks.concat(notebooks);

            // Obter o link para a próxima página
            const nextPage = $('.pagination .page-item.next a').attr('href');
            if (nextPage) {
                await scrapePage(`https://webscraper.io${nextPage}`);
            }
        }

        await scrapePage(baseURL);
        return allNotebooks;

    } catch (error) {
        console.error('Erro ao buscar notebooks:', error.message);
        return [];
    }
}

// Rota da API para obter os notebooks
app.get('/api/notebooks', async (req, res) => {
    const notebooks = await getNotebooks();
    notebooks.sort((a, b) => a.price - b.price); // Ordena os notebooks pelo preço
    res.json(notebooks);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/api/notebooks`);
});
