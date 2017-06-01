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
  .then(goods => {
    goods.length > 0
      ? response.status(200).json(goods)
      : response.status(404);
  })
  .catch(() => error.serverError(response));
});

router.get('/api/v1/goods/:id', (request, response) => {
  const { id } = request.params;
  database('carport').where('id', id).select()
    .then(goods => {
      goods.length > 0 
        ? response.status(200).json(goods) 
        : error.invalidID(request, response);
    })
    .catch(() => error.serverError(response));
});

// POST nouveau noir chic

router.post('/api/v1/goods', (request, response) => {
  let requiredGoods = ['name', 'why_tho', 'cleanliness'].every((prop) => {
    return request.body.hasOwnProperty(prop);
  });

  if (requiredGoods) {
    const newGood = request.body;
    database('carport').insert(newGood, ['name', 'why_tho', 'cleanliness'])
      .then(goods => response.status(201).json(goods))
      .catch(() => error.serverError(response));
  } else {
    return error.missingFields(response);
  }
});

// PUT er there

router.put('/api/v1/goods/:id', (request, response) => {
  const { id } = request.params;
  let requiredGoods = ['name', 'why_tho', 'cleanliness'].every((prop) => {
    return request.body.hasOwnProperty(prop);
  });

  if (request.body.hasOwnProperty('id')) {
    return error.dontTouchID(response);
  }

  if (requiredGoods) {
    const updatedGood = request.body;

    database('carport').where('id', id).select()
      .then((goods) => {
        if (goods.length > 0) {
          database('carport').where('id', id)
            .update(updatedGood)
            .then(() => database('carport').where('id', id))
            .then((update) => response.status(200).json(update))
            .catch(() => error.serverError(response));
        } else {
          return error.invalidID(response);
        }
      });
  } else {
    return error.missingFields(response);
  }
});

// PATCHes O'Houlihan

router.patch('/api/v1/goods/:id', (request, response) => {
  const { id } = request.params;
  let patchWerk = ['cleanliness'].every((prop) => {
    return request.body.hasOwnProperty(prop);
  });

  if (request.body.hasOwnProperty('id')) {
    return error.dontTouchID(response);
  }

  if (patchWerk) {
    const { cleanliness } = request.body;
    const goodsPatch = { cleanliness };

    database('carport').where('id', id).select()
      .then((goods) => {
        if (goods.length > 0) {
          database('carport').where('id', id)
            .update(goodsPatch)
            .then(() => database('carport').where('id', id))
            .then((update) => response.status(200).json(update))
            .catch(() => error.serverError(response));
        } else {
          return error.invalidID(response);
        }
      });
  } else {
    return error.missingFields(response);
  }
});

// DELETE && dodge duck dip dive and dodge

router.delete('/api/v1/goods/:id', (request, response) => {
  const { id } = request.params;

  database('carport').where('id', id).select()
    .then((goods) => {
      if (goods.length > 0) {
        database('carport').where('id', id).del()
          .then(() => database('carport').select())
          .then((goods) => response.status(200).json(goods))
          .catch(() => error.serverError(response));
      } else {
        return error.invalidID(response);
      }
    })
    .catch(() => error.serverError(response));
});

module.exports = router;