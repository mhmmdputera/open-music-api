/* eslint-disable linebreak-style */
const CollaborationsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'collaborations',
  version: '1.0.0',
  // eslint-disable-next-line max-len
  register: async (server, {collaborationsService, playlistsService, usersService, validator}) => {
    const collaborationHandler = new CollaborationsHandler(
        collaborationsService, playlistsService, usersService, validator,
    );
    server.route(routes(collaborationHandler));
  },
};
