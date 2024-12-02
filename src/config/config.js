const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  database: process.env.DATABASE_URL,
  secretKey: process.env.SECRET_KEY
};