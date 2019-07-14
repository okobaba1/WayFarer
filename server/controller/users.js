/* eslint-disable camelcase */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import moment from 'moment';
import db from '../database/dbconnection';

const Users = {
  async create(req, res) {
    try {
      if (!req.body.email || !req.body.password) {
        return res.status(400).json({
          error: 'Some values are missing',
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
      }, process.env.SECRET_KEY, { expiresIn: '1024hrs' });
      return res.status(201).json({
        status: 'success',
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
      const dateCheck = moment(trip_date).format('YYYY-MM-DD');
      if (dateCheck === 'Invalid date') {
        return res.status(406).json({
          status: 406,
          error: 'Please input date in YYYY-MM-DD format',
        });
      }
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
          id: create[0].id,
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
      const { origin, destination } = req.query;
      if (origin) {
        const getOrigin = {
          text: 'SELECT * FROM trips WHERE origin = $1',
          values: [origin],
        };
        const { rows: orijin } = await db.query(getOrigin);
        if (!orijin[0]) {
          return res.status(404).json({
            status: 404,
            error: 'No available trip',
          });
        }
        return res.status(200).json({
          status: 'success',
          data: orijin,
        });
      }
      if (destination) {
        const getDestination = {
          text: 'SELECT * FROM trips WHERE destination = $1',
          values: [destination],
        };
        const { rows: destine } = await db.query(getDestination);
        if (!destine[0]) {
          return res.status(404).json({
            status: 404,
            error: 'No available trip',
          });
        }
        return res.status(200).json({
          status: 'success',
          data: destine,
        });
      }
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

  async makeBooking(req, res) {
    try {
      const { email, id } = req.user;
      const { trip_id } = req.body;
      let { seat_number } = req.body;
      if (!seat_number) {
        seat_number = Math.floor(Math.random() * 13) + 1;
      }
      const checkUser = {
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email],
      };
      const status = 'active';
      const checkTrip = {
        text: 'SELECT * FROM trips where id = $1 AND status = $2',
        values: [trip_id, status],
      };
      const checkSeat = {
        text: 'SELECT * FROM bookings where trip_id = $1 AND seat_number = $2',
        values: [trip_id, seat_number],
      };
      const { rows } = await db.query(checkUser);
      if (!rows[0]) {
        return res.status(401).json({
          status: 401,
          error: 'Please sign up',
        });
      }
      const { rows: trip } = await db.query(checkTrip);
      if (!trip[0]) {
        return res.status(404).json({
          status: 404,
          error: 'trip not available',
        });
      }
      const { rows: seat } = await db.query(checkSeat);
      if (seat[0]) {
        return res.status(409).json({
          status: 409,
          error: 'Seat number already taken',
        });
      }
      const createQuery = {
        text: 'INSERT INTO bookings(trip_id, user_id, seat_number) VALUES($1, $2, $3) RETURNING *',
        values: [trip_id, id, seat_number],
      };
      const { rows: booking } = await db.query(createQuery);
      return res.status(201).json({
        status: 'success',
        data: {
          id: booking[0].id,
          user_id: id,
          trip_id,
          bus_id: trip[0].bus_id,
          trip_date: trip[0].trip_date,
          seat_number,
          first_name: rows[0].first_name,
          last_name: rows[0].last_name,
          email,
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: `Internal server error ${error.message}`,
      });
    }
  },

  async getbookings(req, res) {
    try {
      const { is_admin, id } = req.user;
      if (is_admin == Boolean(true)) {
        const checkBookings = { text: 'SELECT * FROM bookings' };
        const { rows } = await db.query(checkBookings);
        if (!rows[0]) {
          return res.status(404).json({
            status: 404,
            error: 'No booking found',
          });
        }
        return res.status(200).json({
          status: 'success',
          data: rows,
        });
      }
      const checkBookings = {
        text: 'SELECT * FROM bookings WHERE user_id = $1',
        values: [id],
      };
      const { rows } = await db.query(checkBookings);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'No booking found',
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

  async deleteBooking(req, res) {
    try {
      const { bookingId: id } = req.params;
      const { id: user_id } = req.user;
      const checkBooking = {
        text: 'SELECT * FROM bookings where id = $1 AND user_id = $2',
        values: [id, user_id],
      };
      const { rows } = await db.query(checkBooking);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'No booking found',
        });
      }
      const deleteBooking = {
        text: 'DELETE FROM bookings WHERE id = $1 AND user_id = $2',
        values: [id, user_id],
      };
      await db.query(deleteBooking);
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'booking successfully deleted',
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: `Internal server error ${error.message}`,
      });
    }
  },

  async cancelTrip(req, res) {
    try {
      const { tripId } = req.params;
      const checkTrip = {
        text: 'SELECT * FROM trips WHERE id = $1 and status = $2',
        values: [tripId, 'active'],
      };
      const { rows } = await db.query(checkTrip);
      if (!rows[0]) {
        return res.status(400).json({
          status: 400,
          error: 'Not an active trip',
        });
      }
      const updateTrip = {
        text: "UPDATE trips SET status = 'cancelled' WHERE id = $1",
        values: [tripId],
      };
      await db.query(updateTrip);
      return res.status(200).json({
        status: 'success',
        data: {
          message: 'Trip cancelled successfully',
        },
      });
    } catch (error) {
      return res.status(500).json({
        status: 500,
        error: `Internal server error ${error.message}`,
      });
    }
  },

  async changeSeats(req, res) {
    try {
      const { email, id: user_id } = req.user;
      const { bookingId } = req.params;
      const { newSeatNumber } = req.body;
      const checkBooking = {
        text: 'SELECT * FROM bookings where id = $1 AND user_id = $2',
        values: [bookingId, user_id],
      };
      const { rows } = await db.query(checkBooking);
      if (!rows[0]) {
        return res.status(404).json({
          status: 404,
          error: 'No booking found',
        });
      }
      const checknumber = {
        text: 'SELECT * FROM bookings where seat_number = $1',
        values: [newSeatNumber],
      };
      const { rows: seats } = await db.query(checknumber);
      if (seats[0]) {
        return res.status(401).json({
          status: 401,
          error: 'seat already taken',
        });
      }
      const changeSeat = {
        text: 'UPDATE bookings SET seat_number = $1 WHERE id = $2 RETURNING *',
        values: [newSeatNumber, bookingId],
      };
      const { rows: changed } = await db.query(changeSeat);
      return res.status(201).json({
        status: 'success',
        data: {
          bookingId,
          user_id,
          trip_id: changed[0].trip_id,
          newSeatNumber,
          email,
        },
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
