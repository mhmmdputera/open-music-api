/* eslint-disable linebreak-style */
const ClientError = require('../../exceptions/ClientError');

// eslint-disable-next-line require-jsdoc
class CollaborationsHandler {
  // eslint-disable-next-line max-len, require-jsdoc
  constructor(collaborationsService, playlistsService, usersService, validator) {
    this._collaborationsService = collaborationsService;
    this._playlistsService = playlistsService;
    this._usersService = usersService;
    this._validator = validator;

    this.postCollaborationHandler = this.postCollaborationHandler.bind(this);
    // eslint-disable-next-line max-len
    this.deleteCollaborationHandler = this.deleteCollaborationHandler.bind(this);
  }

  // eslint-disable-next-line require-jsdoc
  async postCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);

      const {id: credentialId} = request.auth.credentials;
      const {playlistId, userId} = request.payload;

      // eslint-disable-next-line max-len
      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);

      await this._usersService.getUserById(userId);

      // eslint-disable-next-line max-len
      const collaborationId = await this._collaborationsService.addCollaboration(playlistId, userId);

      const response = h.response({
        status: 'success',
        data: {
          collaborationId,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }

  // eslint-disable-next-line require-jsdoc
  async deleteCollaborationHandler(request, h) {
    try {
      this._validator.validateCollaborationPayload(request.payload);

      const {id: credentialId} = request.auth.credentials;
      const {playlistId, userId} = request.payload;

      // eslint-disable-next-line max-len
      await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
      await this._collaborationsService.deleteCollaboration(playlistId, userId);

      return {
        status: 'success',
        message: 'Kolaborasi berhasil dihapus',
      };
    } catch (error) {
      if (error instanceof ClientError) {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(error.statusCode);
        return response;
      }

      const response = h.response({
        status: 'error',
        message: 'Maaf, terjadi kesalahan pada server',
      });
      response.code(500);
      console.error(response);
      return response;
    }
  }
}

module.exports = CollaborationsHandler;
