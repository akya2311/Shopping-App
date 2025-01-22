const jwt = require('jsonwebtoken');
const config = require('../config/config');

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, config.jwtSecret, {
    expiresIn: '30d',
  });
};

module.exports = generateToken;
