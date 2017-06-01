// knex seed:run

exports.seed = function(knex, Promise) {
  return knex('carport').del()
  .then(() => {
    return Promise.all([
      knex('carport').insert([
        {
          name: 'ultra cool tennis racket',
          why_tho: 'deal with it.jpeg',
          cleanliness: 'Rancid'
        }, {
          name: 'baloney sandwich',
          why_tho: '??',
          cleanliness: 'Sparkling'
        }, {
          name: 'grandma',
          why_tho: 'i dont even',
          cleanliness: 'Dusty'
        }
      ])
    ]);
  });
};