/* eslint-disable linebreak-style */
const ClientError = require('./ClientError');

// eslint-disable-next-line require-jsdoc
class AuthenticationError extends ClientError {
  // eslint-disable-next-line require-jsdoc
  constructor(message) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

module.exports = AuthenticationError;
