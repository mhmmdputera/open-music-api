/* eslint-disable linebreak-style */
const {Pool} = require('pg');

// eslint-disable-next-line require-jsdoc
class AuthenticationsService {
  // eslint-disable-next-line require-jsdoc
  constructor() {
    this._pool = new Pool();
  }

  // eslint-disable-next-line require-jsdoc
  async addRefreshToken(token) {
    const query = {
      text: 'INSERT INTO authentications VALUES($1)',
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
