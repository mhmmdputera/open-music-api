/* eslint-disable linebreak-style */
/* eslint-disable require-jsdoc */
/* eslint-disable linebreak-style */
const {nanoid} = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class SongsService {
  constructor() {
    this._songs = [];
  }

  addSong({title, year, performer, genre, albumId}) {
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newSong = {
      title,
      year: Number(year),
      performer,
      genre,
      duration: Number(duration),
      id,
      albumId,
      insertedAt,
      updatedAt,
    };

    this._songs.push(newSong);

    const isSuccess = this._songs.filter((song) => song.id === id).length > 0;

    if (!isSuccess) {
      throw new InvariantError('Musik gagal ditambahkan');
    }

    return id;
  }

  getSongs() {
    return this._songs;
  }

  // eslint-disable-next-line require-jsdoc
  getSongById(id) {
    const song = this._songs.filter((el) => el.id === id)[0];

    if (!song) {
      throw new NotFoundError('Music tidak ditemukan');
    }

    return song;
  }

  // eslint-disable-next-line require-jsdoc
  editSongById(id, {title, year, performer, genre, duration, albumId}) {
    const index = this._songs.findIndex((song) => song.id === id);

    if (index === -1) {
      throw new NotFoundError('Gagal memperbarui Music. Id tidak ditemukan');
    }

    const updatedAt = new Date().toISOString();

    this._songs[index] = {
      ...this._songs[index],
      title,
      year: Number(year),
      performer,
      genre,
      duration: Number(duration),
      albumId,
      updatedAt,
    };
  }

  // eslint-disable-next-line require-jsdoc
  deleteSongById(id) {
    const index = this._songs.findIndex((song) => song.id === id);

    if (index === -1) {
      throw new NotFoundError('Music gagal dihapus. Id tidak ditemukan');
    }

    this._songs.splice(index, 1);
  }
}

module.exports = SongsService;
