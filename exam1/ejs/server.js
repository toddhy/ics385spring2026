const express = require('express');
const app     = express();

app.set('view engine', 'ejs');

const beaches = [
  { name: 'Waikiki',   island: 'Oahu'       },
  { name: 'Kaanapali', island: 'Maui'       },
  { name: 'Hanalei',   island: 'Kauai'      },
  { name: 'Hapuna',    island: 'Big Island'  }
];

app.get('/', (req, res) => {
  res.render('index', { title: 'Hawaii Beaches', beaches: beaches });
});

app.get('/beach/:name', (req, res) => {
  const match = beaches.find(b => b.name === req.params.name);
  res.render('detail', { beach: match });
});

app.listen(3000);
