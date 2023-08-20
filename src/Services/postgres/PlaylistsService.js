/* eslint-disable linebreak-style */
const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const {nanoid} = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

// eslint-disable-next-line require-jsdoc
class PlaylistsService {
  // eslint-disable-next-line require-jsdoc
  constructor(collaborationsService, cacheService) {
    this._pool = new Pool();
    this._collaborationsService = collaborationsService;
    this._cacheService = cacheService;
  }

  // eslint-disable-next-line require-jsdoc
  async addPlaylist({name, owner}) {
    const id = `user-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    await this._cacheService.delete(`playlist:${owner}`);
    return result.rows[0].id;
  }

  // eslint-disable-next-line require-jsdoc
  async getPlaylists(userId) {
    try {
      const result = await this._cacheService.get(`playlist:${userId}`);
      const playlists = JSON.parse(result);
      return {
        cache: true,
        playlists,
      };
    } catch (error) {
      const query = {
        text: `SELECT p.id, p.name, u.username
        FROM playlists p
        INNER JOIN users u
        ON p.owner = u.id
        WHERE p.owner = $1
  
        UNION
        
        SELECT p.id, p.name, u.username
        FROM collaborations c
        INNER JOIN playlists p
        ON c.playlist_id = p.id
        INNER JOIN users u
        ON p.owner = u.id
        WHERE c.user_id = $1`,
        values: [userId],
      };

      const result = await this._pool.query(query);

      await this._cacheService.set(
          `playlist:${userId}`,
          JSON.stringify(result.rows),
      );

      return {
        cache: false,
        playlists: result.rows,
      };
    }
  }

  // eslint-disable-next-line require-jsdoc
  async getPlaylistById(playlistId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    return result.rows[0];
  }

  // eslint-disable-next-line require-jsdoc
  async deletePlaylist(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id, owner',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal dihapus. Id tidak ditemukan.');
    }

    const {owner} = result.rows[0];
    await this._cacheService.delete(`playlist:${owner}`);
  }

  // eslint-disable-next-line require-jsdoc
  async addSongToPlaylist(playlistId, songId) {
    const id = `playlist_item-${nanoid(16)}`;
    const query = {
      text: 'INSERT INTO playlist_songs VALUES ($1, $2, $3) RETURNING id',
      values: [id, playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Musik gagal ditambahkan kedalam playlist');
    }
  }

  // eslint-disable-next-line require-jsdoc
  async getPlaylistSongsById(playlistId, userId) {
    await this.verifyPlaylistAccess(playlistId, userId);

    const queryGetPlaylist = {
      // eslint-disable-next-line max-len
      text: `SELECT p.id, p.name, u.username FROM playlists p INNER JOIN users u ON p.owner = u.id WHERE p.id = $1`,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(queryGetPlaylist);

    if (!playlistResult.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const queryGetSongs = {
      // eslint-disable-next-line max-len
      text: `SELECT s.id, s.title, s.performer FROM songs s INNER JOIN playlist_songs p ON p.song_id = s.id WHERE p.playlist_id = $1`,
      values: [playlistId],
    };
    const songsResult = await this._pool.query(queryGetSongs);

    const playlist = playlistResult.rows[0];
    const result = {
      id: playlist.id,
      name: playlist.name,
      username: playlist.username,
      songs: songsResult.rows,
    };

    return result;
  }

  // eslint-disable-next-line require-jsdoc
  async deleteSongFromPlaylist(playlistId, songId) {
    const query = {
      text: `DELETE FROM playlist_songs 
      WHERE playlist_id = $1 AND song_id = $2
      RETURNING id`,
      values: [playlistId, songId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Musik gagal dihapus dari playlist');
    }
  }

  // eslint-disable-next-line require-jsdoc
  async verifyPlaylistOwner(playlistId, userId) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [playlistId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }

    const playlist = result.rows[0];

    if (playlist.owner !== userId) {
      throw new AuthorizationError('Anda tidak memiliki akses resource ini');
    }
  }

  // eslint-disable-next-line require-jsdoc
  async verifyPlaylistAccess(playlistId, userId) {
    try {
      await this.verifyPlaylistOwner(playlistId, userId);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      try {
        // eslint-disable-next-line max-len
        await this._collaborationsService.verifyCollaborator(playlistId, userId);
      } catch (error) {
        throw error;
      }
    }
  }
}

module.exports = PlaylistsService;
