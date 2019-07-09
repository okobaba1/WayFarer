import '@babel/polyfill';
import bcrypt from 'bcrypt';
import db from './dbconnection';

const Migration = {
  async migrate() {
    try {
      console.log('Dropping users table');
      await db.query('DROP TABLE IF EXISTS users CASCADE');

      console.log('Dropping bus table');
      await db.query('DROP TABLE IF EXISTS buses CASCADE');

      console.log('Dropping trip table');
      await db.query('DROP TABLE IF EXISTS trips CASCADE');

      console.log('Dropping booking table');
      await db.query('DROP TABLE IF EXISTS bookings CASCADE');

      console.log('Creating User table');
      await db.query(`
      CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(128) NOT NULL,
        last_name VARCHAR(128) NOT NULL,
        password TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT false
      );
    `);

      console.log('Creating bus table');
      await db.query(`
      CREATE TABLE IF NOT EXISTS buses(
        id SERIAL PRIMARY KEY,
        number_plate VARCHAR(128) NOT NULL,
        manufacturer VARCHAR(128) NOT NULL,
        model VARCHAR(128) NOT NULL,
        year INTEGER NOT NULL,
        capacity INTEGER NOT NULL
      );
    `);

      console.log('Creating trip table');
      await db.query(`
      CREATE TABLE IF NOT EXISTS trips(
        id SERIAL PRIMARY KEY,
        bus_id INTEGER REFERENCES buses(id) on DELETE CASCADE,
        origin VARCHAR(128) NOT NULL,
        destination VARCHAR(128) NOT NULL,
        trip_date DATE NOT NULL,
        fare FLOAT NOT NULL,
        status VARCHAR(50) DEFAULT 'active'
      );
    `);

      console.log('Creating booking table');
      await db.query(`
      CREATE TABLE IF NOT EXISTS bookings(
        id SERIAL PRIMARY KEY,
        trip_id INTEGER REFERENCES trips(id) on DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) on DELETE CASCADE,
        created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

      const adminQuery = `INSERT INTO
    users(email, first_name, last_name, password, is_admin)
    VALUES($1,$2,$3,$4,$5)
    RETURNING email, first_name, last_name, is_admin`;
      const values = [
        'victoradmin@wayfarer.com',
        'Victor',
        'Admin',
        await bcrypt.hash('password', 10),
        true,
      ];

      const busesQuery = `INSERT INTO buses(
        number_plate, manufacturer, model, year, capacity)
    VALUES($1,$2,$3,$4,$5)
    RETURNING number_plate, manufacturer, model, year, capacity`;
      const busvalues = [
        'XCV102',
        'TOYOTA',
        'Sienna',
        2011,
        12,
      ];
      console.log('Creating Admin');
      await db.query(adminQuery, values);
      console.log('Creating bus');
      await db.query(busesQuery, busvalues);
      console.log('Admin Created');
    } catch (error) {
      console.log(error);
    }
  },
};

export default Migration;

Migration.migrate();
