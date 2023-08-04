/* eslint-disable linebreak-style */
// require('dotenv').config();
const Hapi = require('@hapi/hapi');
require('dotenv').config();

const songs = require('./API/songs/index');
const SongsService = require('./Services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

const albums = require('./API/albums/index');
const AlbumsService = require('./Services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');

const users = require('./API/users');
const UsersService = require('./Services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  const songsService = new SongsService();
  const albumsService = new AlbumsService();
  const usersService = new UsersService();

  await server.register([
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: albums,
      options: {
        albumsService,
        // storageService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
