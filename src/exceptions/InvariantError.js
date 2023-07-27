/* eslint-disable linebreak-style */
const ClientError = require('./ClientError');

// eslint-disable-next-line require-jsdoc
class InvariantError extends ClientError {
  // eslint-disable-next-line require-jsdoc
  constructor(message) {
    super(message);
    this.name = 'InvariantError';
  }
}

module.exports = InvariantError;
