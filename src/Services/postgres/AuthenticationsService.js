/* eslint-disable linebreak-style */
const {Pool} = require('pg');
const InvariantError = require('../../exceptions/InvariantError');

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

  // eslint-disable-next-line require-jsdoc
  async verifyRefreshToken(token) {
    const query = {
      text: 'SELECT * FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new InvariantError('Refresh token tidak valid');
    }
  }

  // eslint-disable-next-line require-jsdoc
  async deleteRefreshToken(token) {
    const query = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this._pool.query(query);
  }
}

module.exports = AuthenticationsService;
