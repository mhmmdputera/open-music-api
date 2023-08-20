/* eslint-disable linebreak-style */
const Hapi = require('@hapi/hapi');
require('dotenv').config();
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

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

const collaborations = require('./API/collaborations');
// eslint-disable-next-line max-len
const CollaborationsService = require('./Services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations');

const playlists = require('./API/playlists/index.js');
const PlaylistsValidator = require('./validator/playlists/index.js');
const PlaylistsService = require('./Services/postgres/PlaylistsService.js');

const _exports = require('./API/exports');
const ProducerService = require('./Services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

const StorageService = require('./Services/storage/StorageService');


const CacheService = require('./Services/redis/CacheService');


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

  const cacheService = new CacheService();
  const collaborationsService = new CollaborationsService(cacheService);
  const songsService = new SongsService();
  const albumsService = new AlbumsService(cacheService);
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const playlistsService =
    new PlaylistsService(collaborationsService, cacheService);
  const storageService = new StorageService(
      path.join(__dirname, '/api/albums/file/images/album_cover'),
  );

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
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
        storageService,
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
    {
      plugin: playlists,
      options: {
        playlistsService,
        songsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        usersService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: _exports,
      options: {
        exportsService: ProducerService,
        playlistsService,
        validator: ExportsValidator,
      },
    },
  ]);

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
