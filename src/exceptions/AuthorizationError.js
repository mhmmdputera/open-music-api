/* eslint-disable linebreak-style */
const ClientError = require('./ClientError');

// eslint-disable-next-line require-jsdoc
class AuthorizationError extends ClientError {
  // eslint-disable-next-line require-jsdoc
  constructor(message) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

module.exports = AuthorizationError;
