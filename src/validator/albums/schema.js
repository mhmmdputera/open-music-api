/* eslint-disable linebreak-style */
const Joi = require('joi');

const AlbumsPayloadScheme = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

const AlbumImageCoverHeadersSchema = Joi.object({
  'content-type': Joi.string().valid(
      'image/apng',
      'image/avif',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/webp',
  ).required(),
}).unknown();

module.exports = {AlbumsPayloadScheme, AlbumImageCoverHeadersSchema};
