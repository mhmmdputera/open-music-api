/* eslint-disable linebreak-style */
const ClientError = require('../../exceptions/ClientError');

// eslint-disable-next-line require-jsdoc
class ExportsHandler {
  // eslint-disable-next-line require-jsdoc
  constructor(exportsService, playlistsService, validator) {
    this._exportsService = exportsService;
    this._playlistsService = playlistsService;
    this._validator = validator;

    // eslint-disable-next-line max-len
    this.postExportPlaylistHandler = this.postExportPlaylistHandler.bind(this);
  }

  // eslint-disable-next-line require-jsdoc
  async postExportPlaylistHandler(request, h) {
    try {
      this._validator.validateExportPlaylistPayload(request.payload);
      const {id: userId} = request.auth.credentials;

      const {playlistId} = request.params;
      await this._playlistsService.verifyPlaylistOwner(playlistId, userId);

      const message = {
        playlistId,
        targetEmail: request.payload.targetEmail,
      };

      // eslint-disable-next-line max-len
      await this._exportsService.sendMessage('export:playlist', JSON.stringify(message));
      const response = h.response({
        status: 'success',
        message: 'Permintaan Anda sedang kami proses',
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
}

module.exports = ExportsHandler;
