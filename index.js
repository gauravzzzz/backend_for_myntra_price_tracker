import express from 'express';
import { launch } from 'puppeteer';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json()); // Middleware to parse JSON bodies

app.post('/price', async (req, res) => {
    const url = req.body.url;

    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    try {
        const browser = await launch({headless: false});
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2',timeout:60000 });

        const price = await page.evaluate(() => {
            const priceElement = document.querySelector('.pdp-price');
            return priceElement ? priceElement.textContent : null;
        });

        await browser.close();
        console.log("Price is successfully scrapped for the particular product");
        res.json({ price: price });
    } catch (error) {
        console.error('Error fetching price:', error);
        res.status(500).json({ error: 'Failed to fetch price' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
