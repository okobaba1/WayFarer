import chai from 'chai';
import chaiHttp from 'chai-http';
import dotenv from 'dotenv';
import app from '../server/app';

const {
  expect, assert, should,
} = chai;
chai.use(chaiHttp);
dotenv.config();
should();


describe('User', ()=> {
  const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpY3RvcmFkbWluQHdheWZhcmVyLmNvbSIsImlkIjoxLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNTYyNjI2Mzk3LCJleHAiOjE1NjYzMTI3OTd9.DP78i0BpIkajBVL86g0LVLasXtKv0Cc27pKh6Eihi8o';
  const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpY3RvckBnbWFpbC5jb20iLCJpZCI6MiwiaXNfYWRtaW4iOmZhbHNlLCJpYXQiOjE1NjI3Njk0NDksImV4cCI6MTU2Mjg1NTg0OX0.CB4XvDWIK4I-zAFg45eWntO41OODs7EkYBlDH94GYSw';

  it('App should exists', () => {
    chai.request(app);
    expect(app).to.be.a('function');
  });

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
  it('invalid input', (done) => {
    const user = {
      email: 'victor@gmail.com',
      firstname: 'moke',
      lastname: 'ilo',
      password: '1234hdgdpds',
    };
    chai.request(app)
      .post('/api/v1/auth/signup')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('number');
        assert.equal(res.body.status, 400);
        done();
      });
  });
  // User login tests
  it('User Login', (done) => {
    const user = {
      email: 'victor@gmail.com',
      password: '1234hdgdpds',
    };
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('number');
        expect(res.body.data).be.an('object');
        assert.equal(res.body.status, 200);
        assert.equal(res.body.message, 'login successsful');
        done();
      });
  });
  it('incorrect password', (done) => {
    const user = {
      email: 'victor@gmail.com',
      password: '1234hdgdp',
    };
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('number');
        assert.equal(res.body.status, 401);
        assert.equal(res.body.error, 'Incorrect password');
        done();
      });
  });
  it('Not signed up', (done) => {
    const user = {
      email: 'ab@gmail.com',
      password: '1234hsvsz',
    };
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('number');
        assert.equal(res.body.status, 400);
        assert.equal(res.body.error, 'Please sign Up');
        done();
      });
  });
  it('Empty email or password input', (done) => {
    const user = {
      email: '',
      password: '',
    };
    chai.request(app)
      .post('/api/v1/auth/signin')
      .send(user)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('number');
        assert.equal(res.body.status, 400);
        assert.equal(res.body.error, 'kindly put in your email and password');
        done();
      });
  });
  it('No trips', (done) => {
    chai.request(app)
      .get('/api/v1/trips')
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('number');
        assert.equal(res.body.error, 'No available trip');
        done();
      });
  });

  // create trips
  it('create trips successful', (done) => {
    const user = {
      bus_id: 1,
      origin: 'Lagos',
      destination: 'Abuja',
      trip_date: '2019-07-24',
      fare: 26000,
    };
    chai.request(app)
      .post('/api/v1/trips')
      .send(user)
      .set('x-access-token', adminToken)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        expect(res.body.data).be.an('object');
        assert.equal(res.body.status, 'success');
        done();
      });
  });
  it('All trips', (done) => {
    chai.request(app)
      .get('/api/v1/trips')
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        expect(res.body.data).be.an('array');
        assert.equal(res.body.status, 'success');
        done();
      });
  });
  it('post booking success', (done) => {
    const user = {
      trip_id: 1,
      seat_number: 5,
    };
    chai.request(app)
      .post('/api/v1/bookings')
      .send(user)
      .set('x-access-token', userToken)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        expect(res.body.data).be.an('object');
        assert.equal(res.body.status, 'success');
        done();
      });
  });
  it('post booking not available trip', (done) => {
    const user = {
      trip_id: 4,
      seat_number: 5,
    };
    chai.request(app)
      .post('/api/v1/bookings')
      .send(user)
      .set('x-access-token', userToken)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('number');
        assert.equal(res.body.status, 404);
        assert.equal(res.body.error, 'trip not available');
        done();
      });
  });
  it('User bookings', (done) => {
    const user = {
      trip_id: 1,
      seat_number: 5,
    };
    chai.request(app)
      .get('/api/v1/bookings')
      .send(user)
      .set('x-access-token', userToken)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        expect(res.body.data).be.an('array');
        assert.equal(res.body.status, 'success');
        done();
      });
  });
  it('Admin bookings', (done) => {
    const user = {
      trip_id: 1,
      seat_number: 5,
    };
    chai.request(app)
      .get('/api/v1/bookings')
      .send(user)
      .set('x-access-token', adminToken)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        expect(res.body.data).be.an('array');
        assert.equal(res.body.status, 'success');
        done();
      });
  });
  // it('User delete booking', (done) => {
  //   chai.request(app)
  //     .delete('/api/v1/bookings/1')
  //     .set('x-access-token', userToken)
  //     .end((err, res) => {
  //       res.should.have.status(200);
  //       expect(res.body).be.an('object');
  //       expect(res.body.status).be.a('string');
  //       expect(res.body.data).be.an('object');
  //       assert.equal(res.body.error, 'booking successfully deleted');
  //       done();
  //     });
  // });
  it('No booking found', (done) => {
    chai.request(app)
      .delete('/api/v1/bookings/4')
      .set('x-access-token', userToken)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('number');
        assert.equal(res.body.error, 'No booking found');
        done();
      });
  });
  it('Not authorized', (done) => {
    chai.request(app)
      .delete('/api/v1/bookings/4')
      .set('x-access-token', adminToken)
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('number');
        assert.equal(res.body.error, 'Not authorized to perform this operation');
        done();
      });
  });
});
