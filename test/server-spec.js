/* eslint-env node, mocha */

process.env.NODE_ENV = 'test';
const chai           = require('chai');
const expect         = chai.expect;
const assert         = chai.assert;
const chaiHttp       = require('chai-http');
const server         = require('../server.js');
const configuration  = require('../knexfile.js')['test'];
const database       = require('knex')(configuration);

chai.should();
chai.use(chaiHttp);

describe('our yung carpark', () => {
  it('should exist', () => {
    expect(server).to.exist;
  });
});

describe('server side testing', () => {

  before((done) => {
    database.migrate.latest()
    .then(() => database.seed.run())
    .then(() => done());
  });

  afterEach((done) => {
    database.seed.run()
    .then(() => done());
  });

  describe('Client routes', () => {
    it('should return HTML', (done) => {
      chai.request(server)
      .get('/')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.html;
        done();
      });
    });

    it('should return 404 for non existent route and render HTML error', (done) => {
      chai.request(server)
      .get('/cool/end/point')
      .end((error, response) => {
        response.should.have.status(404);
        response.should.be.html;
        response.res.text.should.include('Route Not Found!');
        done();
      });
    });
  });

  describe('API routes', () => {
    describe('GET /secretEndpoint', () => {
      it('should return jason', (done) => {
        chai.request(server)
        .get('/secretEndpoint')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          assert.deepEqual(response.res.text, '{"name":"hugh","cool":true}');
          done();
        });
      });
    });

    describe('GET /api/v1/goods', () => {
      it('should return all goods', (done) => {
        chai.request(server)
        .get('/api/v1/goods')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          done();
        });
      });

      it('should get goods by ID', (done) => {
        chai.request(server)
        .get('/api/v1/goods/1')
        .end((error, response) => {
          response.should.have.status(200);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);
          let thisGood = response.body[0];

          thisGood.should.have.property('id');
          thisGood.should.have.property('name');
          thisGood.should.have.property('cleanliness');
          thisGood.should.have.property('why_tho');

          thisGood.id.should.equal(1);
          thisGood.name.should.equal('ultra cool tennis racket');
          thisGood.why_tho.should.equal('deal with it.jpeg');
          thisGood.cleanliness.should.equal('Rancid');
          done();
        });
      });

      it('should chuck a bloody error if asked to get invalid ID', (done) => {
        chai.request(server)
        .get('/api/v1/goods/4')
        .end((error, response) => {
          response.should.have.status(500);
          done();
        });
      });
    });

    describe('POST /api/v1/goods', () => {
      it('should allow me to chuck some junk into the carport', () => {
        chai.request(server)
        .post('/api/v1/goods')
        .send({
          id: 4,
          name: 'cool stuff',
          why_tho: 'because i feel like it',
          cleanliness: 'spicnspan'
        })
        .end((error, response) => {
          let newJunk = response.body[0];

          response.should.have.status(201);
          response.should.be.json;
          response.body.should.be.a('array');
          response.body.length.should.equal(1);

          newJunk.should.have.property('id');
          newJunk.should.have.property('name');
          newJunk.should.have.property('cleanliness');
          newJunk.should.have.property('why_tho');

          newJunk.id.should.equal(4);
          newJunk.name.should.equal('cool stuff');
          newJunk.why_tho.should.equal('because i feel like it');
          newJunk.cleanliness.should.equal('spicnspan');       
        });
      });
      it('should not let me post with bogus data', (done) => {
        chai.request(server)
        .post('/api/v1/goods')
        .send({
          id: 4,
          name: 'cool stuff',
          cleanliness: 'spicnspan'
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.error.should.equal('Missing fields from request!');
          done();
        });
      });
    });

    describe('PUT /api/v1/goods/:id', () => {
      it('should let me PUT stuff', (done) => {
        chai.request(server)
        .put('/api/v1/goods/1')
        .send({
          name: 'new name',
          why_tho: 'PUT',
          cleanliness: 'Idunno'
        })
        .end((error, response) => {
          let pastTensePut = response.body[0];

          response.should.have.status(200);
          response.should.be.a('object');
          response.body.length.should.equal(1);

          pastTensePut.should.have.property('id');
          pastTensePut.should.have.property('name');
          pastTensePut.should.have.property('why_tho');
          pastTensePut.should.have.property('cleanliness');

          pastTensePut.id.should.equal(1);
          pastTensePut.name.should.equal('new name');
          done();
        });
      });

      it('should not let me PUT with bogus data', (done) => {
        chai.request(server)
        .put('/api/v1/goods/1')
        .send({
          whatever: 'cool'
        })
        .end((error, response) => {
          response.should.have.status(422);
          done();
        });
      });
    });

    describe('PATCHes ohoulihan /api/v1/goods/:id', () => {
      it('should let me PATCH cleanliness', (done) => {
        chai.request(server)
        .patch('/api/v1/goods/1')
        .send({
          cleanliness: 'super'
        })
        .end((error, response) => {
          let thisPatch = response.body[0];

          response.should.have.status(200);
          response.body.should.be.a('array');
          response.body.length.should.equal(1);

          thisPatch.cleanliness.should.equal('super');
          done();
        });
      });

      it('should not let me patch an unkown ID', (done) => {
        chai.request(server)
        .patch('/api/v1/goods/12')
        .send({
          cleanliness: 'super'
        })
        .end((error, response) => {
          response.should.have.status(404);
          response.body.should.be.a('object');
          response.body.error.should.equal('ID not found!');
          done();          
        });
      });
      it('should not let me patch with bogus data', (done) => {
        chai.request(server)
        .patch('/api/v1/goods/1')
        .send({
          bogusTown: 'super'
        })
        .end((error, response) => {
          response.should.have.status(422);
          response.body.should.be.a('object');
          response.body.error.should.equal('Missing fields from request!');
          done();          
        });
      });
    });
    describe('DELETE /api/v1/goods/:id', () => {
      it('should let me delete a good if i feel like it!', (done) => {
        chai.request(server)
        .get('/api/v1/goods')
        .then((goods) => {
          goods.body.length.should.equal(3);
        })
        .then(() => {
          chai.request(server)
          .delete('/api/v1/goods/2')
          .end((error, response) => {
            response.should.have.status(200);
            response.body.should.be.a('array');
            response.body.length.should.equal(2);
            done();
          });
        });
      });

      it('should not let me delete a nonexistent good even if i feel like it', () => {
        chai.request(server)
        .delete('/api/v1/goods/232')
        .end((error, response) => {
          response.should.have.status(404);
          response.body.error.should.equal('ID not found!');
        });
      });
    });
  });
});