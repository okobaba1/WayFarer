"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pg = require("pg");

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

_dotenv["default"].config();

var _process$env = process.env,
    DB_USER = _process$env.DB_USER,
    DB_PASSWORD = _process$env.DB_PASSWORD,
    DB_NAME = _process$env.DB_NAME,
    DB_PORT = _process$env.DB_PORT,
    DB_TEST = _process$env.DB_TEST;
var connection;
var devConfig = {
  user: DB_USER,
  database: DB_NAME,
  password: DB_PASSWORD,
  port: DB_PORT,
  max: 10,
  idleTimeoutMillis: 3000
};
var testConfig = {
  user: DB_USER,
  database: DB_TEST,
  password: DB_PASSWORD,
  port: DB_PORT,
  max: 10,
  idleTimeoutMillis: 3000
};

if (process.env.NODE_ENV === 'production') {
  connection = {
    connectionString: process.env.DATABASE_URL,
    ssl: true
  };
} else if (process.env.NODE_ENV === 'test') {
  connection = testConfig;
} else {
  connection = devConfig;
}

var dbconnection = new _pg.Pool(connection);
var _default = dbconnection;
exports["default"] = _default;