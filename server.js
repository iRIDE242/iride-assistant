const express = require('express'); 
const app = express(); 
const port = process.env.PORT || 5000; 

const https = require('https');

const options = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-Shopify-Access-Token': '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'
  }
};

https.get('https://iride-store.myshopify.com/admin/api/2021-10/products.json', options, res => {
  let data = [];
  const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
  console.log('Status Code:', res.statusCode);
  console.log('Date in Response header:', headerDate);

  console.log(res)  
}).on('error', err => {
  console.log('Error: ', err.message);
});


app.get('/shopify', async (req, res) => { 
  res.send({ shopify: 'This should be a Shopify response' }); 
}); 


// This displays message that the server running and listening to specified port
app.listen(port, () => console.log(`Listening on port ${port}`)); 

// create a GET route
app.get('/express_backend', (req, res) => { 
  res.send({ mock: 'text', express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' }); 
}); 