/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
const ClientError = require('./ClientError');

class NotFoundError extends ClientError {
  constructor(message) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

module.exports = NotFoundError;
