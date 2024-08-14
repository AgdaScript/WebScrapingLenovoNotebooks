const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const app = express();
const port = 3000;

// Função para obter os dados dos notebooks
async function getNotebooks() {
    const baseURL = 'https://webscraper.io/test-sites/e-commerce/static/computers/laptops';
    let allNotebooks = [];

    try {
        // Função auxiliar para fazer scraping em uma página
        async function scrapePage(url) {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            
            $('.thumbnail').each((index, element) => {
                const priceText = $(element).find('.price').text().trim();
                const title = $(element).find('.title').text().trim();
                const description = $(element).find('.description').text().trim();
                const imageURL = $(element).find('.image').attr('src');
                const price = parseFloat(priceText.replace('$', '').replace(',', ''));
                
                allNotebooks.push({
                    title,
                    description,
                    price,
                    imageURL: `https://webscraper.io${imageURL}`
                });
            });

            // Obter o link para a próxima página
            const nextPage = $('.pagination .page-item.next a').attr('href');
            if (nextPage) {
                await scrapePage(`https://webscraper.io${nextPage}`);
            }
        }

        await scrapePage(baseURL);
        return allNotebooks;

    } catch (error) {
        console.error('Error fetching notebooks:', error);
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
