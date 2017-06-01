exports.seed = function(knex, Promise) {
  return knex('carport').del()
  .then(() => {
    return Promise.all([
      knex('carport').insert([
        {
          id: 1,
          name: 'ultra cool tennis racket',
          why_tho: 'deal with it.jpeg',
          cleanliness: 'Rancid'
        }, {
          id: 2,
          name: 'baloney sandwich',
          why_tho: '??',
          cleanliness: 'Sparkling'
        }, {
          id: 3,
          name: 'grandma',
          why_tho: 'i dont even',
          cleanliness: 'Dusty'
        }
      ])
    ]);
  });
};