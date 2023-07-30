/* eslint-disable linebreak-style */
const {Pool} = require('pg');
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

// eslint-disable-next-line require-jsdoc
class SongsService {
  // eslint-disable-next-line require-jsdoc
  constructor() {
    this._pool = new Pool();
  }

  // eslint-disable-next-line require-jsdoc
  async addSong({title, year, genre, performer, duration, albumId}) {
    const id = nanoid(16);

    const query = {
      // eslint-disable-next-line max-len
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id',
      values: [id, title, year, performer, genre, duration, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Musik gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  // eslint-disable-next-line require-jsdoc
  async getsongs() {
    return this._songs;
  }

  // eslint-disable-next-line require-jsdoc
  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return result.rows[0];
  }

  // eslint-disable-next-line require-jsdoc
  async editSongById(id, {title, year, genre, performer, duration, albumId}) {
    const query = {
      text: `UPDATE songs 
        SET
        title = $1,
        year = $2,
        genre = $3,
        performer = $4,
        duration = $5,
        album_id = $6 
        WHERE id = $7
        RETURNING id`,
      values: [title, year, genre, performer, duration, albumId, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui musik. Id tidak ditemukan.');
    }
  }

  // eslint-disable-next-line require-jsdoc
  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Musik gagal dihapus. Id tidak ditemukan.');
    }
  }
}

module.exports = SongsService;
