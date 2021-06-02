
process.env.NODE_ENV = 'test';

let chai = require("chai");
let chaiHttp = require("chai-http");
let server = require ("../app")


let mongoose = require("mongoose");
let Book = require('../models/Pokemon');


//Assertion Style
chai.should();

chai.use(chaiHttp);

describe('Tasks API', () => {

    /**
     * Test the GET route
     */
    
     describe('/GET pokemon', () => {
        it('it should GET all the pokemons', (done) => {
            
          chai.request(server)
              .get('/api/pokemons')
              .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('array');
                    res.body.length.should.be.eql(28);
                done();

          
              });
        }).timeout(10000);
    });


});


