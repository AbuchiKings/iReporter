import chai from 'chai';
import chaiHttp from 'chai-http';
import app from './app';

const { expect } = chai;
chai.use(chaiHttp);
describe('iReporter', () => {

    describe('Incidents', () => {
        describe('GET /incidents', () => {
            it('Users should be able to get all red flag incidents', done => {
                chai
                    .request(app)
                    .get('/api/v1/incidents')
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('status');
                        expect(res.body.status).to.equal(200);
                        expect(res.body).to.have.property('data');
                        expect(res.body.data).to.be.an('array')
                        done(err);
                    });
            });
        });



        describe('GET /incidents/:id', () => {
            it('A valid id should return a matching incident', done => {
                chai
                    .request(app)
                    .get('/api/v1/incidents/1')
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('data');
                        expect(res.body).to.have.property('status');
                        done(err);
                    });
            });


            it('A on-existing id should return a not found error', done => {
                chai
                    .request(app)
                    .get('/api/v1/incidents/7')
                    .end((err, res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body).to.not.have.property('data');
                        expect(res.body).to.have.property('error');
                        done(err);
                    });
            });
        });


        describe('POST /incidents/post', () => {
            it('Users should be able to create incidents', done => {
                chai
                    .request(app)
                    .post('/api/v1/incidents/post')
                    .send({
                        "createdBy": 5,
                        "type": "intervention",
                        "location": "Latitude: 45.6079545 Longitude: 53.6217802",
                        "comment": "High rate of secondary school dropouts."
                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(201);
                        expect(res.body).to.have.property('status');
                        expect(res.body).to.have.property('data');
                        done(err);
                    });
            });
        });



        it('Invalid location inputs should return an unprocessable entry error', done => {
            chai
                .request(app)
                .post('/api/v1/incidents/post')
                .send({
                    location: "Lagos"
                })
                .end((err, res) => {
                    expect(res.status).to.equal(422);
                    expect(res.body).to.have.property('error');
                    done(err);
                });
        });


        it('Invalid createdBy inputs should return an unprocessable entry error', done => {
            chai
                .request(app)
                .post('/api/v1/incidents/post')
                .send({
                    createdBy: "name"
                })
                .end((err, res) => {
                    expect(res.status).to.equal(422);
                    expect(res.body).to.have.property('error');
                    done(err);
                });
        });


        it('Invalid type inputs should return an unprocessable entry error', done => {
            chai
                .request(app)
                .post('/api/v1/incidents/post')
                .send({
                    type: "Bribery"
                })
                .end((err, res) => {
                    expect(res.status).to.equal(422);
                    expect(res.body).to.have.property('error');
                    done(err);
                });
        });


        describe('PATCH /incidents/location/:id', () => {
            it('Invalid location input should return an unprocessable entry error', done => {
                chai
                    .request(app)
                    .patch('/api/v1/incidents/location/1')
                    .send({
                        location: "Ondo",
                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(422);
                        expect(res.body).to.have.property('error');
                        done(err);
                    });
            });
            it('Invalid location input format should return an unprocessable entry error', done => {
                chai
                    .request(app)
                    .patch('/api/v1/incidents/location/1')
                    .send({
                        location: "Lat: 16.5, Long: 3"
                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(422);
                        expect(res.body).to.have.property('error');
                        done(err);
                    });
            });

            it('Non-existing incident id should return a not found error during location update', done => {
                chai
                    .request(app)
                    .patch('/api/v1/incidents/location/36')
                    .send({
                        location: "Latitude: 45.6079545 Longitude: 53.6217802"

                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(404);
                        done(err);
                    });
            });

            it('A valid incident format update should not return error', done => {
                chai
                    .request(app)
                    .patch('/api/v1/incidents/location/1')
                    .send({
                        location: "Latitude: 45.6079545 Longitude: 53.6217802"                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('data')
                        done(err);
                    });
            });
        });
        describe('PATCH /incidents/comment/:id', () => {
            it('Empty comment input should return an unprocessable entry error', done => {
                chai
                    .request(app)
                    .patch('/api/v1/incidents/comment/1')
                    .send({
                        comment: "",
                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(422);
                        expect(res.body).to.have.property('error');
                        done(err);
                    });
            });
            it('An comment format should return an unprocessable entry error', done => {
                chai
                    .request(app)
                    .patch('/api/v1/incidents/location/1')
                    .send({
                        comment: "123456789"
                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(422);
                        expect(res.body).to.have.property('error');
                        done(err);
                    });
            });

            it('Non-existing incident id should return a not found error during comment update', done => {
                chai
                    .request(app)
                    .patch('/api/v1/incidents/comment/36')
                    .send({
                        comment: "Government intervention needed in bad roads"

                    })
                    .end((err, res) => {
                        expect(res.status).to.equal(404);
                        expect(res.body).to.not.have.property('data');
                        expect(res.body).to.have.property('error')
                        expect(res.body).to.have.property('status')
                        done(err);
                    });
            });

            it('A valid comment update should not return an error', done => {
                chai
                    .request(app)
                    .patch('/api/v1/incidents/comment/1')
                    .send({
                        comment: "Government intervention needed in bad roads"
                     })
                    .end((err, res) => {
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property('data')
                        expect(res.body).to.have.property('status')
                        done(err);
                    });
            });
        });

        describe('DELETE /incidents/:id', () => {
            it('Non-existing incident id should return a not found error', done => {
              chai
                .request(app)
                .del('/api/v1/incidents/10')
                .end((err, res) => {
                  expect(res.status).to.equal(404);
                  expect(res.body).to.have.a.property('status');
                  expect(res.body).to.have.a.property('error');
                  expect(res.body.status).to.equal(404);
                  expect(res.body.error).to.equal('Incident not found')
                  done(err);
                });
            });
            it('An invalid incident id should return unprocessable entity error', done => {
              chai
                .request(app)
                .del('/api/v1/incidents/t')
                .end((err, res) => {
                  expect(res.status).to.equal(422);
                  expect(res.body).to.have.a.property('error');
                  expect(res.body.error).to.be.an('array')
                  done(err);
                });
            });
        
            it('Users should be able to delete an incident with a valid incident id', done => {
              chai
                .request(app)
                .del('/api/v1/incidents/1')
                .end((err, res) => {
                  expect(res.status).to.equal(200);
                  expect(res.body).to.have.a.property('status');
                  expect(res.body).to.have.a.property('data');
                  expect(res.body.status).to.equal(204);
                  expect(res.body.data).to.be.an('array');
                  expect(res.body.data[0]).to.have.all.keys(
                      'id',
                      'message'
                  );
                  done(err);
                });
            });
          
        });
    });

})