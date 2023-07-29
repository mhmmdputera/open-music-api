/* eslint-disable linebreak-style */
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

/* eslint-disable linebreak-style */
// eslint-disable-next-line require-jsdoc
class AlbumsService {
  // eslint-disable-next-line require-jsdoc
  constructor() {
    this._albums = [];
  }

  // eslint-disable-next-line require-jsdoc
  addAlbum({name, year}) {
    const id = nanoid(16);
    // const insertedAt = new Date().toISOString();
    // const updatedAt = insertedAt;

    const newAlbum = {
      id, name, year,
    };

    this._albums.push(newAlbum);

    // eslint-disable-next-line max-len
    const isSuccess = this._albums.filter((album) => album.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Album gagal ditambahkan');
    }

    return id;
  }

  // eslint-disable-next-line require-jsdoc
  getAlbumById(id) {
    const album = this._albums.filter((el) => el.id === id)[0];

    if (!album) {
      throw new NotFoundError('Album tidak ditemukan');
    }

    return album;
  }

  // eslint-disable-next-line require-jsdoc
  editAlbumById(id, {name, year}) {
    const index = this._albums.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui album. Id tidak ditemukan.');
    }

    const updatedAt = new Date().toISOString();

    this._albums[index] = {
      ...this._albums[index],
      name,
      year,
      updatedAt,
    };
  }

  // eslint-disable-next-line require-jsdoc
  deleteAlbumById(id) {
    const index = this._albums.findIndex((album) => album.id === id);

    if (index === -1) {
      throw new NotFoundError('Album gagal dihapus. Id tidak ditemukan');
    }

    this._albums.splice(index, 1);
  }
}
module.exports = AlbumsService;
