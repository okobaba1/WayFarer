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


describe('User', () => {
  const adminToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpY3RvcmFkbWluQHdheWZhcmVyLmNvbSIsImlkIjoxLCJpc19hZG1pbiI6dHJ1ZSwiaWF0IjoxNTYyNjI2Mzk3LCJleHAiOjE1NjYzMTI3OTd9.DP78i0BpIkajBVL86g0LVLasXtKv0Cc27pKh6Eihi8o';
  const userToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InZpY3RvckBnbWFpbC5jb20iLCJpZCI6MiwiaXNfYWRtaW4iOmZhbHNlLCJpYXQiOjE1NjI4NjIxNzIsImV4cCI6MTU2NjU0ODU3Mn0.VxGhw42I10jzeh-RvmQZTfmm3RwtS0l5_RicWUsjui8';

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
        expect(res.body.status).be.a('string');
        expect(res.body.data).be.an('object');
        assert.equal(res.body.status, 'success');
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
        expect(res.body.status).be.a('string');
        expect(res.body.error).be.an('string');
        assert.equal(res.body.status, 'error');
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
        expect(res.body.status).be.a('string');
        assert.equal(res.body.status, 'error');
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
        expect(res.body.status).be.a('string');
        expect(res.body.data).be.an('object');
        assert.equal(res.body.status, 'success');
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
        expect(res.body.status).be.a('string');
        assert.equal(res.body.status, 'error');
        assert.equal(res.body.error, 'Incorrect email/password');
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
        expect(res.body.status).be.a('string');
        assert.equal(res.body.status, 'error');
        assert.equal(res.body.error, 'Incorrect email/password');
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
        expect(res.body.status).be.a('string');
        assert.equal(res.body.status, 'error');
        assert.equal(res.body.error, 'kindly put in your email and password');
        done();
      });
  });
  it('No trips', (done) => {
    chai.request(app)
      .get('/api/v1/trips')
      .set('token', adminToken)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        assert.equal(res.body.error, 'No available trip');
        done();
      });
  });
  it('No trips origin', (done) => {
    chai.request(app)
      .get('/api/v1/trips')
      .query({ origin: 'ibadan' })
      .set('token', adminToken)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        assert.equal(res.body.error, 'No available trip');
        done();
      });
  });
  it('No trips destination', (done) => {
    chai.request(app)
      .get('/api/v1/trips')
      .query({ destination: 'ibadan' })
      .set('token', adminToken)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
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
      .set('token', adminToken)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        expect(res.body.data).be.an('object');
        assert.equal(res.body.status, 'success');
        done();
      });
  });
  it('create trips no token provided', (done) => {
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
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        assert.equal(res.body.error, 'No token provided.');
        done();
      });
  });
  it('create trips invalid date', (done) => {
    const user = {
      bus_id: 1,
      origin: 'Lagos',
      destination: 'Abuja',
      trip_date: '2019-07-2409',
      fare: 26000,
    };
    chai.request(app)
      .post('/api/v1/trips')
      .send(user)
      .set('token', adminToken)
      .end((err, res) => {
        res.should.have.status(406);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        assert.equal(res.body.error, 'Please input date in YYYY-MM-DD format');
        done();
      });
  });
  it('All trips', (done) => {
    chai.request(app)
      .get('/api/v1/trips')
      .set('token', adminToken)
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
      .set('token', userToken)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        expect(res.body.data).be.an('object');
        assert.equal(res.body.status, 'success');
        done();
      });
  });

  it('post booking no token', (done) => {
    const user = {
      trip_id: 1,
      seat_number: 5,
    };
    chai.request(app)
      .post('/api/v1/bookings')
      .send(user)
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        assert.equal(res.body.error, 'No token provided.');
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
      .set('token', userToken)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        assert.equal(res.body.status, 'error');
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
      .set('token', userToken)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        expect(res.body.data).be.an('array');
        assert.equal(res.body.status, 'success');
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
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        assert.equal(res.body.error, 'No token provided.');
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
      .set('token', adminToken)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        expect(res.body.data).be.an('array');
        assert.equal(res.body.status, 'success');
        done();
      });
  });
  it('User change seats bookings', (done) => {
    const user = {
      newSeatNumber: 9,
    };
    chai.request(app)
      .patch('/api/v1/bookings/1')
      .send(user)
      .set('token', userToken)
      .end((err, res) => {
        res.should.have.status(201);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        expect(res.body.data).be.an('object');
        assert.equal(res.body.status, 'success');
        done();
      });
  });
  it('User change seats no bookings', (done) => {
    const user = {
      newSeatNumber: 9,
    };
    chai.request(app)
      .patch('/api/v1/bookings/5')
      .send(user)
      .set('token', userToken)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        assert.equal(res.body.error, 'No booking found');
        done();
      });
  });
  it('User delete booking', (done) => {
    chai.request(app)
      .delete('/api/v1/bookings/1')
      .set('token', userToken)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        expect(res.body.data).be.an('object');
        assert.equal(res.body.data.message, 'booking successfully deleted');
        done();
      });
  });
  it('No booking found', (done) => {
    chai.request(app)
      .delete('/api/v1/bookings/4')
      .set('token', userToken)
      .end((err, res) => {
        res.should.have.status(404);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        assert.equal(res.body.error, 'No booking found');
        done();
      });
  });
  it('Not authorized', (done) => {
    chai.request(app)
      .delete('/api/v1/bookings/4')
      .set('token', adminToken)
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        assert.equal(res.body.error, 'Not authorized to perform this operation');
        done();
      });
  });
  it('Not active trip', (done) => {
    chai.request(app)
      .patch('/api/v1/trips/7')
      .set('token', adminToken)
      .end((err, res) => {
        res.should.have.status(400);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        assert.equal(res.body.error, 'Not an active trip');
        done();
      });
  });
  it('Cancelled trip', (done) => {
    chai.request(app)
      .patch('/api/v1/trips/1')
      .set('token', adminToken)
      .end((err, res) => {
        res.should.have.status(200);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        expect(res.body.data).be.an('object');
        assert.equal(res.body.data.message, 'Trip cancelled successfully');
        done();
      });
  });
  it('user error', (done) => {
    chai.request(app)
      .patch('/api/v1/trips/1')
      .set('token', userToken)
      .end((err, res) => {
        res.should.have.status(401);
        expect(res.body).be.an('object');
        expect(res.body.status).be.a('string');
        assert.equal(res.body.error, 'Not authorized to perform this operation');
        done();
      });
  });
});
