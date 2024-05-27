const express = require('express');
const path = require('path');
const router = express.Router();
const { Client } = require('@elastic/elasticsearch');
const bodyParser = require('body-parser').json();
const client = new Client({
  node: 'https://81a3e41e8b0e4b35a2159519111cdb91.us-central1.gcp.cloud.es.io:443',
  auth: {
      apiKey: 'SXg1U25JOEI3RFUyMHROREEtSUc6SkNpWHRwU2ZTdzJqX1JGNy00a0FEUQ=='
  }
});

let cursos = []


router.get('/', (req, res) => {
  let query = {
    index: 'cursos'
  };

  if (req.query.product) {
    query.body = {
      query: {
        query_string: {
          query: `*${req.query.product}*`
        }
      },
      size: 20 // Aquí especificamos el número de resultados deseados
    };
  }
  client.search(query)
  .then(response => {
    // cursos = response.hits.hits
    cursos = response.hits.hits.slice(0,6)
    res.render('index', {cursos});
  })
  .catch(err => {
    console.log(err);
    return res.status(500).json({ msg: 'Error', err });
  });
});


module.exports = router;

  