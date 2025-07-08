// dao/userCoasterDao.js
const { pool } = require('../utils/dbManager');

const UserCoasterDao = {
  async insertIfNotExists({ username, coasterName }) {
    await pool.query(
      `INSERT IGNORE INTO user_coasters (username, coaster_id)
       SELECT ?, id FROM coasters WHERE LOWER(name) = ? OR LOWER(alias) = ?`,
      [username, coasterName.toLowerCase(), coasterName.toLowerCase()]
    );
  },

  async getCount({ username }) {
    const [rows] = await pool.query(
      `SELECT COUNT(*) as count FROM user_coasters WHERE username = ?`,
      [username]
    );
    return rows[0]?.count || 0;
  },

  async getRecentGuesses({ username, limit = 5 }) {
    const [rows] = await pool.query(
      `SELECT c.name, c.park, c.country 
       FROM user_coasters uc 
       JOIN coasters c ON uc.coaster_id = c.id 
       WHERE uc.username = ? 
       ORDER BY uc.id DESC 
       LIMIT ?`,
      [username, limit]
    );
    return rows;
  }
};

module.exports = UserCoasterDao;
