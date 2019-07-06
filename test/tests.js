import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server/app';

const {
  expect, assert, should,
} = chai;
chai.use(chaiHttp);
should();


describe('User', ()=> {
  it('should sign up a user', (done) => {
    const user = {
      email: 'victor@gmail.com',
      first_name: 'moke',
      last_name: 'ilo',
      password: '1234hdgdpds',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('number');
        expect(res.body.data).be.an('object');
        assert.equal(res.body.status, 201);
        done();
      });
  });
  it('User already exists', (done) => {
    const user = {
      email: 'victor@gmail.com',
      first_name: 'moke',
      last_name: 'ilo',
      password: '1234hdgdpds',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(409);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('number');
        expect(res.body.error).be.an('string');
        assert.equal(res.body.status, 409);
        assert.equal(res.body.error, 'User already exists');
        done();
      });
  });
})