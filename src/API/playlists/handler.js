/* eslint-disable linebreak-style */
const ClientError = require('../../exceptions/ClientError');

// eslint-disable-next-line require-jsdoc
class PlaylistsHandler {
  // eslint-disable-next-line require-jsdoc
  constructor(playlistsService, songsService, validator) {
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._validator = validator;
  }

  // eslint-disable-next-line require-jsdoc
  async postPlaylistHandler(request, h) {
    try {
      this._validator.validatePlaylistPayload(request.payload);

      const {name} = request.payload;
      const {id: credentialId} = request.auth.credentials;

      // eslint-disable-next-line max-len
      const playlistId = await this._playlistsService.addPlaylist(name, credentialId);

      const response = h.response({
        status: 'success',
        data: {
          playlistId,
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
  async getPlaylistsHandler(request, h) {
    try {
      const {id: credentialId} = request.auth.credentials;
      // eslint-disable-next-line max-len
      const {playlists} = await this._playlistsService.getPlaylists(credentialId);

      const response = h.response({
        status: 'success',
        data: {
          playlists,
        },
      });
      response.code(200);
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
  async deletePlaylistByIdHandler(request, h) {
    try {
      const {id} = request.params;
      const {id: credentialId} = request.auth.credentials;

      await this._playlistsService.verifyPlaylistOwner(id, credentialId);
      await this._playlistsService.deletePlaylist(id);

      response.code(200);
      return {
        status: 'success',
        message: 'Playlist berhasil dihapus',
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
  async postPlaylistSongByIdHandler(request, h) {
    try {
      this._validator.validateSongPlaylistPayload(request.payload);

      const {songId} = request.payload;
      const {id: playlistId} = request.params;
      const {id: credentialId} = request.auth.credentials;

      await this._songsService.getSongById(songId);
      await this._playlistsService.verifyPlaylistAccess(
          playlistId, credentialId,
      );
      await this._playlistsService.addSongToPlaylist(playlistId, songId);
      await this._playlistsService.addActivity(
          playlistId, songId, credentialId, 'add',
      );

      const response = h.response({
        status: 'success',
        message: 'Musik berhasil ditambahkan ke dalam playlist',
      });
      response.code(201);
      return response;
    } catch (error) {
      console.log(error);
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
  async getPlaylistSongsByIdHandler(request, h) {
    try {
      const {id} = request.params;
      const {id: credentialId} = request.auth.credentials;
      // eslint-disable-next-line max-len
      const playlist = await this._playlistsService.getPlaylistSongsById(id, credentialId);

      response.code(200);
      return {
        status: 'success',
        data: {
          playlist,
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
  async deletePlaylistSongsByIdHandler(request, h) {
    try {
      this._validator.validateSongPlaylistPayload(request.payload);

      const {id} = request.params;
      const {songId} = request.payload;
      const {id: credentialId} = request.auth.credentials;

      await this._playlistsService.verifyPlaylistAccess(id, credentialId);
      await this._playlistsService.deleteSongFromPlaylist(id, songId);
      await this._playlistsService.addActivity(
          id, songId, credentialId, 'delete',
      );

      response.code(200);
      return {
        status: 'success',
        message: 'Musik berhasil dihapus dari playlist',
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
}

module.exports = PlaylistsHandler;
