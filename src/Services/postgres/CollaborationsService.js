/* eslint-disable linebreak-style */
const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const AuthorizationError = require('../../exceptions/AuthorizationError');

// eslint-disable-next-line require-jsdoc
class CollaborationsService {
  // eslint-disable-next-line require-jsdoc
  constructor() {
    this._pool = new Pool();
  }

  // eslint-disable-next-line require-jsdoc
  async addCollaboration(playlistId, userId) {
    const id = `collab-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO collaborations VALUES($1, $2, $3) RETURNING id',
      values: [id, playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  // eslint-disable-next-line require-jsdoc
  async deleteCollaboration(playlistId, userId) {
    const query = {
      // eslint-disable-next-line max-len
      text: `DELETE FROM collaborations WHERE playlist_id = $1 AND user_id = $2 RETURNING id`,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Kolaborasi gagal dihapus');
    }
  }

  // eslint-disable-next-line require-jsdoc
  async verifyCollaborator(playlistId, userId) {
    const query = {
      // eslint-disable-next-line max-len
      text: `SELECT * FROM collaborations WHERE playlist_id = $1 AND user_id = $2`,
      values: [playlistId, userId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new AuthorizationError('Kolaborasi gagal diverifikasi');
    }
  }
}

module.exports = CollaborationsService;
