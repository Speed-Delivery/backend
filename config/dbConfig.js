// config/dbConfig.js
require('dotenv').config();

module.exports = {
  dbUri: process.env.MONGODB_URI
};