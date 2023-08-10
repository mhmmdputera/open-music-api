/* eslint-disable linebreak-style */
const routes = require('./routes');
const PlaylistsHandler = require('./handler');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, {playlistsService, songsService, validator}) => {
    const playlistHandler = new PlaylistsHandler(
        playlistsService, songsService, validator,
    );
    server.route(routes(playlistHandler));
  },
};
