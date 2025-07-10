const express = require('express');
const cors = require('cors');
const axios = require('axios');
const products = require('./products.json');

const app = express();
app.use(cors());

const PORT = 3000;

// Convert popularity (0–1) to 5-star scale
const getStarRating = (score) => (score * 5).toFixed(1);

app.get('/api/products', async (req, res) => {
  try {
    let goldPrice = 70; // fallback price

    // Optional filters from query params
    const minPrice = parseFloat(req.query.minPrice) || 0;
    const maxPrice = parseFloat(req.query.maxPrice) || Infinity;

    const minPopularity = parseFloat(req.query.minPopularity) || 0;

    // Try to fetch live gold price
    try {
      const response = await axios.get('https://www.goldapi.io/api/XAU/USD', {
        headers: {
          'x-access-token': 'goldapi-1pfsmcw6ptq2-io',
          'Content-Type': 'application/json'
        }
      });
      goldPrice = response.data.price;
    } catch (err) {
      console.warn('Using fallback gold price due to API error:', err.message);
    }

    // Add price and starRating to products
    const enriched = products.map((product) => {
      const priceValue = (product.popularityScore + 1) * product.weight * goldPrice;
      return {
        ...product,
        price: `$${priceValue.toFixed(2)} USD`,
        priceValue,
        starRating: getStarRating(product.popularityScore)
      };
    });

    // Apply filtering
    const filtered = enriched.filter(p =>
      p.priceValue >= minPrice &&
      p.priceValue <= maxPrice &&
      p.popularityScore >= minPopularity
    );

    res.json(filtered);
  } catch (error) {
    console.error('Error in /api/products:', error.message);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
