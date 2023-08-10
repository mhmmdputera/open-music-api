/* eslint-disable linebreak-style */
const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const {nanoid} = require('nanoid');
const NotFoundError = require('../../exceptions/NotFoundError');

// eslint-disable-next-line require-jsdoc
class PlaylistsService {
  // eslint-disable-next-line require-jsdoc
  constructor() {
    this._pool = new Pool();
  }

  // eslint-disable-next-line require-jsdoc
  async addPlaylist({name, owner}) {
    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3) RETURNING id',
      values: [id, name, owner],
    };

    const id = `user-${nanoid(16)}`;

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    await this._cacheService.delete(`playlist:${owner}`);
    return result.rows[0].id;
  }

  // eslint-disable-next-line require-jsdoc
  async getPlaylists(userId) {
    const query = {
      // eslint-disable-next-line max-len
      text: 'SELECT p.id, p.name, u.username FROM playlists p INNER JOIN users u ON p.owner = u.id WHERE p.owner = $1',
      values: [userId],
    };

    const result = await this._pool.query(query);

    return {
      playlists: result.rows,
    };
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
  }
}

module.exports = PlaylistsService;
