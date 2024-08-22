import { expect } from 'chai';
import chaiHttp from 'chai-http';
import app from '../app.js';

chai.use(chaiHttp);

describe('GET /dashboard', () => {
    it('should get all expenses for a user', (done) => {
        chai.request(app)
            .get('/expenses')
            .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.an('array');
                done();
            });
    });
});
