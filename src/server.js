/* eslint-disable linebreak-style */
// require('dotenv').config();
const Hapi = require('@hapi/hapi');

const songs = require('./API/songs/index');
const SongsService = require('./Services/inMemory/SongsService');
const SongsValidator = require('./validator/songs');

const albums = require('./API/albums/index');
const AlbumsService = require('./Services/inMemory/AlbumsService');
const AlbumsValidator = require('./validator/albums');


const init = async () => {
  const server = Hapi.server({
    port: 5000,
    host: process.env.NODE_ENV !== 'production' ? 'localhost' : '0.0.0.0',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const songsService = new SongsService();
  const albumsService = new AlbumsService();

  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },

    plugin: albums,
    options: {
      albumsService,
      // storageService,
      validator: AlbumsValidator,
    },
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
