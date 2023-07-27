/* eslint-disable linebreak-style */
const Joi = require('joi');

const AlbumsPayloadScheme = Joi.object({
  name: Joi.string().required(),
  year: Joi.number().required(),
});

module.exports = {AlbumsPayloadScheme};
