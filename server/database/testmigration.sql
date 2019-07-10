DROP DATABASE IF EXISTS wayfarer_testdb;
CREATE DATABASE wayfarer_testdb;
\c wayfarer_testdb;

  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(128) NOT NULL,
    last_name VARCHAR(128) NOT NULL,
    password TEXT NOT NULL,
    is_admin BOOLEAN DEFAULT false
  );


  CREATE TABLE IF NOT EXISTS buses(
    id SERIAL PRIMARY KEY,
    number_plate VARCHAR(128) NOT NULL,
    manufacturer VARCHAR(128) NOT NULL,
    model VARCHAR(128) NOT NULL,
    year INTEGER NOT NULL,
    capacity INTEGER NOT NULL
  );


  CREATE TABLE IF NOT EXISTS trips(
    id SERIAL PRIMARY KEY,
    bus_id INTEGER REFERENCES buses(id) on DELETE CASCADE,
    origin VARCHAR(128) NOT NULL,
    destination VARCHAR(128) NOT NULL,
    trip_date DATE NOT NULL,
    fare FLOAT NOT NULL,
    status VARCHAR(50) DEFAULT 'active'
  );

  CREATE TABLE IF NOT EXISTS bookings(
    id SERIAL PRIMARY KEY,
    trip_id INTEGER REFERENCES trips(id) on DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) on DELETE CASCADE,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    seat_number INTEGER NOT NULL

  );

  INSERT INTO users(
    email, first_name, last_name, password, is_admin)
    VALUES(
    'victoradmin@wayfarer.com',
    'Victor',
    'Admin',
    '$2b$10$wzLmW0y./nfew45DThKKDOzcyse7IL5zYZ30ei8bc5.FFANiDYRJW',
    true
  );

  INSERT INTO buses(
    number_plate, manufacturer, model, year, capacity)
    VALUES(
    'XCV102',
    'TOYOTA',
    'Sienna',
    2011,
    12
  );
    


