DROP DATABASE IF EXISTS quickcredit_testdb;
CREATE DATABASE quickcredit_testdb;
\c quickcredit_testdb;

  CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    firstname VARCHAR(128) NOT NULL,
    lastname VARCHAR(128) NOT NULL,
    address VARCHAR(128) NOT NULL,
    password TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unverified',
    isadmin BOOLEAN DEFAULT false
  );


  DROP TYPE IF EXISTS loan_status;
  CREATE TYPE loan_status as ENUM ('pending', 'approved', 'rejected');
  CREATE TABLE IF NOT EXISTS loans(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) REFERENCES users(email) ON DELETE CASCADE,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status loan_status DEFAULT 'pending',
    repaid BOOLEAN DEFAULT false,
    tenor INTEGER NOT NULL,
    amount FLOAT NOT NULL,
    paymentInstallment FLOAT NOT NULL,
    balance FLOAT NOT NULL,
    interest FLOAT NOT NULL
  );


  CREATE TABLE IF NOT EXISTS repayments(
    id SERIAL PRIMARY KEY,
    createdOn TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    loanId INTEGER REFERENCES loans(id) on DELETE CASCADE,
    amount FLOAT NOT NULL
  );


