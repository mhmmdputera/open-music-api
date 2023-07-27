/* eslint-disable linebreak-style */
const ClientError = require('../../exceptions/ClientError');
/* eslint-disable linebreak-style */
// eslint-disable-next-line require-jsdoc
class AlbumsHandler {
  // eslint-disable-next-line require-jsdoc
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
  }

  // eslint-disable-next-line require-jsdoc
  postAlbumHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);

      const {name, year} = request.payload;
      const albumId = this._albumsService.addAlbum({name, year});

      const response = h.response({
        status: 'success',
        data: {
          albumId,
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
  getAlbumByIdHandler(request, h) {
    try {
      this._validator.validateAlbumPayload(request.payload);

      const {id} = request.params;
      const album = this._albumsService.getAlbumById(id);

      return {
        status: 'success',
        data: {
          album,
        },
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
      console.error(error);
      return response;
    }
  }
  // eslint-disable-next-line require-jsdoc
  putAlbumByIdHandler(request, h) {
    try {
      const {id} = request.params;
      const {name, year} = request.payload;

      this._albumsService.editAlbumById(id, {name, year});
      return {
        status: 'success',
        message: 'Album berhasil diperbarui',
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
      return response;
    }
  }
  // eslint-disable-next-line require-jsdoc
  deleteAlbumByIdHandler(request, h) {
    try {
      const {id} = request.params;
      this._albumsService.deleteAlbumById(id);

      return {
        status: 'success',
        message: 'Album berhasil dihapus',
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
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      response.code(500);
      console.error(error);
      return response;
    }
  }
}

module.exports = AlbumsHandler;
