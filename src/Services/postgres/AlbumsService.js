/* eslint-disable linebreak-style */
const {nanoid} = require('nanoid');
const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

// eslint-disable-next-line require-jsdoc
class AlbumsService {
  // eslint-disable-next-line require-jsdoc
  constructor(cacheService) {
    this._pool = new Pool();
    this._cacheService = cacheService;
  }

  // eslint-disable-next-line require-jsdoc
  async addAlbum({name, year}) {
    const id = nanoid(16);

    const query = {
      text: 'INSERT INTO albums VALUES($1, $2, $3) RETURNING id',
      values: [id, name, year],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  // eslint-disable-next-line require-jsdoc
  async getAlbumById(id) {
    const queryGetAlbum = {
      text: 'SELECT * FROM albums WHERE id = $1',
      values: [id],
    };

    const queryGetSongs = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [id],
    };

    const albumResult = await this._pool.query(queryGetAlbum);
    const songsResult = await this._pool.query(queryGetSongs);

    if (!albumResult.rows.length) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    const album = albumResult.rows[0];
    const result = {
      id: album.id,
      name: album.name,
      year: album.year,
      coverUrl: album.cover,
      songs: songsResult.rows,
    };

    return result;
  }

  // eslint-disable-next-line require-jsdoc
  async editAlbumById(id, {name, year}) {
    const query = {
      text: 'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
      values: [name, year, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan.');
    }
  }

  // eslint-disable-next-line require-jsdoc
  async deleteAlbumById(id) {
    const query = {
      text: 'DELETE FROM albums WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan.');
    }
  }

  // eslint-disable-next-line require-jsdoc
  async editAlbumCoverById(id, path) {
    const query = {
      text: 'UPDATE albums SET cover = $1 WHERE id = $2 RETURNING id',
      values: [path, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan.');
    }
  }

  // eslint-disable-next-line require-jsdoc
  async addAlbumLikeById(albumId, userId) {
    const id = `like-${nanoid(16)}`;

    const queryCheckLike = {
      text: `SELECT id FROM user_album_likes 
      WHERE user_id = $1 AND album_id = $2`,
      values: [userId, albumId],
    };

    const resultCheck = await this._pool.query(queryCheckLike);

    if (!resultCheck.rows.length) {
      const query = {
        text: 'INSERT INTO user_album_likes VALUES($1, $2, $3) RETURNING id',
        values: [id, userId, albumId],
      };

      const result = await this._pool.query(query);

      if (!result.rows[0].id) {
        throw new InvariantError('Gagal menambahkan like');
      }
    } else {
      await this.deleteAlbumLikeById(albumId, userId);
    }

    await this._cacheService.delete(`album-likes:${albumId}`);
  }

  // eslint-disable-next-line require-jsdoc
  async deleteAlbumLikeById(albumId, userId) {
    const query = {
      text: `DELETE FROM user_album_likes 
      WHERE user_id = $1 AND album_id = $2 
      RETURNING id`,
      values: [userId, albumId],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal menghapus like');
    }
  }

  // eslint-disable-next-line require-jsdoc
  async getAlbumLikesById(albumId) {
    try {
      const result = await this._cacheService.get(`album-likes:${albumId}`);
      const likes = parseInt(result);
      return {
        cache: true,
        likes,
      };
    } catch (error) {
      const query = {
        text: 'SELECT COUNT(id) FROM user_album_likes WHERE album_id = $1',
        values: [albumId],
      };

      const result = await this._pool.query(query);

      if (!result.rows.length) {
        throw new NotFoundError('Gagal mengambil like');
      }

      const likes = parseInt(result.rows[0].count);
      await this._cacheService.set(`album-likes:${albumId}`, likes);
      return {
        cache: false,
        likes,
      };
    }
  }
}

module.exports = AlbumsService;
