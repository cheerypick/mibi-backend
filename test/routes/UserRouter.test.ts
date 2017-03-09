import * as mocha from 'mocha';
import * as chai from 'chai';
import chaiHttp = require('chai-http');
import app from '../../src/App';

chai.use(chaiHttp);
const expect = chai.expect;

describe('GET api/v1/users', () => {
    it('Should return multiple users', () => {
        return chai.request(app).get('/api/v1/users')
            .then(res => {
                expect(res.body.length).greaterThan(1);
            });
    });
});

describe('GET api/v1/users/:id', () => {

    it('Should be a single JSON object', () => {
        return chai.request(app).get('/api/v1/users/1')
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res.type).to.eql('application/json');
                expect(res.body).to.be.an('object');
            });
    });

    it('Should return Ola', () => {
        return chai.request(app).get('/api/v1/users/1')
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res.type).to.eql('application/json');
                expect(res.body).to.be.an('object');
                expect(res.body.firstName).to.equal('Ola');
            });
    });

    it('Should return 404 and not found', () => {
        return chai.request(app).get('/api/v1/users/0')
            .then(res => {
                expect(res.body.status).to.equal(404);
            });
    });
});


describe('GET api/v1/users/:id/updates', () => {
    it('Should return 1 update on Ola', () => {
        return chai.request(app).get('/api/v1/users/1/updates')
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res.type).to.eql('application/json');
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.equal(1);
            });
    });

    it('Should return 0 updates on Lise', () => {
        return chai.request(app).get('/api/v1/users/2/updates')
            .then(res => {
                expect(res.status).to.equal(200);
                expect(res.type).to.eql('application/json');
                expect(res.body).to.be.an('array');
                expect(res.body.length).to.equal(0);
            });
    });

    it('Should return 404 if user dont exist', () => {
        return chai.request(app).get('/api/v1/users/0/updates')
            .then(res => {
                expect(res.body.status).to.equal(404);
            });
    });
});
