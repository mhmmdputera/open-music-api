/* eslint-disable linebreak-style */
const Hapi = require('@hapi/hapi');
require('dotenv').config();
const Jwt = require('@hapi/jwt');

const songs = require('./API/songs/index');
const SongsService = require('./Services/postgres/SongsService');
const SongsValidator = require('./validator/songs');

const albums = require('./API/albums/index');
const AlbumsService = require('./Services/postgres/AlbumsService');
const AlbumsValidator = require('./validator/albums');

const users = require('./API/users');
const UsersService = require('./Services/postgres/UsersService');
const UsersValidator = require('./validator/users');

const authentications = require('./API/authentications');
// eslint-disable-next-line max-len
const AuthenticationsService = require('./Services/postgres/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

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
  const authenticationsService = new AuthenticationsService();

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

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
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
