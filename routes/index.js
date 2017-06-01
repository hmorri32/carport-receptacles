const express       = require('express');
const router        = express.Router();
const environment   = process.env.NODE_ENV || 'development';
const configuration = require('../knexfile')[environment];
const database      = require('knex')(configuration);
const error         = require('../helpers/error');

// GET güd

router.get('/secretEndpoint', (request, response) => {
  response.json({
    name: 'hugh',
    cool: true
  });
});

router.get('/api/v1/goods', (request, response) => {
  database('carport').select()
  .then(goods => response.status(200).json(goods))
  .catch(() => error.serverError(response));
});

router.get('/api/v1/goods/:id', (request, response) => {
  const { id } = request.params;

  database('carport').where('id', id).select()
  .then(goods => {
    goods.length > 0
      ? response.status(200).json(goods)
      : error.invalidID(response);
  })
  .catch(() => error.serverError(response));
});

module.exports = router;