// dao/coasterDao.js
const { pool } = require('../utils/dbManager');

const CoasterDao = {
  async getTotal() {
    const [rows] = await pool.query(`SELECT COUNT(*) as total FROM coasters`);
    return rows[0]?.total || 0;
  },

  async getRandomOne() {
    const [rows] = await pool.query(`SELECT * FROM coasters ORDER BY RAND() LIMIT 1`);
    return rows[0];
  },

  async getFiltered({ difficulty = null, country = null, limit = 1 }) {
    let sql = `SELECT * FROM coasters WHERE 1=1`;
    const params = [];

    if (difficulty) {
      sql += ` AND difficulty = ?`;
      params.push(difficulty);
    }

    if (country) {
      sql += ` AND country = ?`;
      params.push(country);
    }

    sql += ` ORDER BY RAND() LIMIT ?`;
    params.push(limit);

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  async existsByName(name) {
    const [rows] = await pool.query(`SELECT id FROM coasters WHERE name = ?`, [name]);
    return rows.length > 0;
  },

  async insert({ name, alias, park, country, continent, type, manufacturer, year, height, speed, inversions, difficulty, image }) {
    const [result] = await pool.query(
      `INSERT INTO coasters (name, alias, park, country, continent, type, manufacturer, year, height, speed, inversions, difficulty, image) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, alias, park, country, continent, type, manufacturer, year, height, speed, inversions, difficulty, image]
    );
    return result.insertId;
  }
};

module.exports = CoasterDao;
