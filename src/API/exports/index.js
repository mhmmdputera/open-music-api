/* eslint-disable linebreak-style */
const ExportsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'exports',
  version: '1.0.0',
  register: async (server, {exportsService, playlistsService, validator}) => {
    // eslint-disable-next-line max-len
    const exportsHandler = new ExportsHandler(exportsService, playlistsService, validator);
    server.route(routes(exportsHandler));
  },
};
