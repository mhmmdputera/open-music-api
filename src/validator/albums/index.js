/* eslint-disable linebreak-style */
const InvariantError = require('../../exceptions/InvariantError');
const {AlbumsPayloadScheme} = require('./schema');

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumsPayloadScheme.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumsValidator;
