/* eslint-disable linebreak-style */
const Joi = require('joi');

const CollaborationsPayloadScheme = Joi.object({
  playlistId: Joi.string().required(),
  userId: Joi.string().required(),
});

module.exports = {CollaborationsPayloadScheme};
