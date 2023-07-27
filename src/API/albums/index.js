/* eslint-disable linebreak-style */
const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, {albumsService, validator}) => {
    const albumHandler = new AlbumsHandler(albumsService, validator);
    server.route(routes(albumHandler));
  },
};
