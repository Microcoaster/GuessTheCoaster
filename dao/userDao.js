// dao/userDao.js
const { pool } = require('../utils/dbManager');

const UserDao = {
  async insertIfNotExists({ username, guildId }) {
    await pool.query(
      `INSERT IGNORE INTO users (username, credits, streak, best_streak, contributor, competition_winner, guild_id)
       VALUES (?, 0, 0, 0, 0, 0, ?)`,
      [username, guildId]
    );
  },

  async updateCompetitionWinner({ username }) {
    await pool.query(
      `UPDATE users SET credits = credits + 5, competition_winner = 1 WHERE username = ?`,
      [username]
    );
  },

  async insertClassicIfNotExists({ username, guildId }) {
    await pool.query(
      `INSERT IGNORE INTO users (username, credits, streak, best_streak, guild_id)
       VALUES (?, 0, 0, 0, ?)`,
      [username, guildId]
    );
  },

  async updateClassicStats({ username, creditGain }) {
    await pool.query(
      `UPDATE users SET credits = credits + ?, streak = streak + 1, last_played = NOW() WHERE username = ?`,
      [creditGain, username]
    );
  },

  async getStats({ username }) {
    const [rows] = await pool.query(
      `SELECT credits, streak, best_streak FROM users WHERE username = ?`,
      [username]
    );
    return rows[0];
  },

  async updateBestStreak({ username, streak }) {
    await pool.query(
      `UPDATE users SET best_streak = ? WHERE username = ?`,
      [streak, username]
    );
  },

  async getProfile({ username }) {
    const [rows] = await pool.query(
      `SELECT credits, streak, best_streak, contributor, competition_winner, has_completed FROM users WHERE username = ?`,
      [username]
    );
    return rows[0];
  },

  async getLeaderboard({ type = 'credits', limit = 10 }) {
    let orderBy = 'credits DESC';
    if (type === 'streak') orderBy = 'best_streak DESC';
    
    const [rows] = await pool.query(
      `SELECT username, credits, streak, best_streak, contributor, competition_winner 
       FROM users 
       ORDER BY ${orderBy} 
       LIMIT ?`,
      [limit]
    );
    return rows;
  },

  async isContributor({ username }) {
    const [rows] = await pool.query(
      `SELECT contributor FROM users WHERE username = ?`,
      [username]
    );
    return rows[0]?.contributor === 1;
  },

  async setContributor({ username, guildId }) {
    await pool.query(
      `INSERT INTO users (username, credits, streak, best_streak, contributor, guild_id) 
       VALUES (?, 0, 0, 0, 1, ?) 
       ON DUPLICATE KEY UPDATE contributor = 1`,
      [username, guildId]
    );
  },

  async resetStreak({ username }) {
    await pool.query(
      `UPDATE users SET streak = 0 WHERE username = ?`,
      [username]
    );
  }
};

module.exports = UserDao;
