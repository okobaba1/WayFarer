/* eslint-disable camelcase */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../database/dbconnection';

const Users = {
  async create(req, res) {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({
          message: 'Some values are missing',
        });
      }
      const {
        email, first_name, last_name, password,
      } = req.body;

      const hashedPassword = await bcrypt.hash(password, 10);

      const checkUser = {
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email],
      };
      const createQuery = {
        text: 'INSERT INTO users(email, first_name, last_name, password) VALUES($1, $2, $3, $4) RETURNING *',
        values: [email, first_name, last_name, hashedPassword],
      };

      const { rows } = await db.query(checkUser);
      if (rows[0]) {
        return res.status(409).json({
          status: 409,
          error: 'User already exists',
        });
      }
      const { rows: userRows } = await db.query(createQuery);
      const { id, is_admin } = userRows[0];
      const token = jwt.sign({
        email,
        id,
        is_admin,
      }, process.env.SECRET_KEY, { expiresIn: '24hrs' });
      return res.status(201).json({
        status: 201,
        data: {
          id,
          first_name,
          last_name,
          email,
          is_admin,
          token,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: `Internal server error ${error.message}`,
      });
    }
  },
  async login(req, res) {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({
          status: 400,
          error: 'kindly put in your email and password',
        });
      }
      const { email, password } = req.body;
      const checkUser = {
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email],
      };
      const { rows } = await db.query(checkUser);
      if (!rows[0]) {
        return res.status(400).json({
          status: 400,
          error: 'Please sign Up',
        });
      } bcrypt.compare(password, rows[0].password, (error, response) => {
        if (!response) {
          return res.status(401).json({
            status: 401,
            error: 'Incorrect password',
          });
        } const token = jwt.sign({
          email,
          id: rows[0].id,
          is_admin: rows[0].is_admin,
        }, process.env.SECRET_KEY, { expiresIn: '1024hrs' });
        return res.status(200).json({
          status: 200,
          message: 'login successsful',
          data: {
            token,
            user_id: rows[0].id,
            first_name: rows[0].first_name,
            last_name: rows[0].last_name,
            email: rows[0].email,
          },
        });
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: `Internal server error ${error.message}`,
      });
    }
  },

  async trip(req, res) {
    try {
      const {
        bus_id, origin, destination, trip_date, fare,
      } = req.body;
      const checkbus = {
        text: 'SELECT * FROM buses WHERE id = $1',
        values: [bus_id],
      };
      const { rows } = await db.query(checkbus);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'Not an available bus',
        });
      }
      const createQuery = {
        text: 'INSERT INTO trips(bus_id, origin, destination, trip_date, fare) VALUES($1, $2, $3, $4, $5) RETURNING *',
        values: [bus_id, origin, destination, trip_date, fare],
      };
      const { rows: create } = await db.query(createQuery);
      return res.status(201).json({
        status: 'success',
        data: {
          trip_id: create[0].id,
          bus_id,
          origin,
          destination,
          trip_date,
          fare,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: `Internal server error ${error.message}`,
      });
    }
  },

  async getTrips(req, res) {
    try {
      const getTrips = { text: 'SELECT * FROM trips' };
      const { rows } = await db.query(getTrips);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'No available trip',
        });
      }
      return res.status(200).json({
        status: 'success',
        data: rows,
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: `Internal server error ${error.message}`,
      });
    }
  },
};

export default Users;
