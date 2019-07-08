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

}

export default Users;
