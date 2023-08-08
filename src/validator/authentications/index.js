/* eslint-disable linebreak-style */
const {
  PostAuthenticationsPayloadScheme,
  PutAuthenticationsPayloadScheme,
  DeleteAuthenticationsPayloadScheme,
} = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AuthenticationsValidator = {
  validatePostAuthenticationPayload: (payload) => {
    // eslint-disable-next-line max-len
    const validationResult = PostAuthenticationsPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validatePutAuthenticationPayload: (payload) => {
    // eslint-disable-next-line max-len
    const validationResult = PutAuthenticationsPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateDeleteAuthenticationPayload: (payload) => {
    const validationResult =
        DeleteAuthenticationsPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AuthenticationsValidator;
