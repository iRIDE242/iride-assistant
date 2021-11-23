const express = require('express'); 
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const app = express(); 
const port = process.env.PORT || 5000; 

const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': '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'
  }
};

app.get('/shopify', async (req, res) => { 
  const resFromShop = await fetch('https://iride-store.myshopify.com/admin/api/2021-10/products.json', options)
  const objFromShop = await resFromShop.json()

  res.send({ shopify: 'This should be a Shopify response', objFromShop }); 
}); 


// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); 

// create a GET route
app.get('/express_backend', (req, res) => { 
  res.send({ mock: 'text', express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); 
}); 