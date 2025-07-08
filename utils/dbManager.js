/**
 * Module d'initialisation de la base de données
 *
 * Ce module configure un pool de connexions MySQL en utilisant mysql2/promise,
 * et fournit des fonctions pour obtenir et fermer une connexion partagée.
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('\x1b[38;5;4m🔍  Tentative de connexion MySQL avec les paramètres suivants :\x1b[0m');
console.log('\x1b[38;5;6mDB_HOST:\x1b[0m', process.env.DB_HOST || 'localhost');
console.log('\x1b[38;5;6mDB_PORT:\x1b[0m', process.env.DB_PORT || 3306);
console.log('\x1b[38;5;6mDB_USER:\x1b[0m', process.env.DB_USER || 'root');
console.log('\x1b[38;5;6mDB_PASS:\x1b[0m', process.env.DB_PASS ? '******' : 'non défini');
console.log('\x1b[38;5;6mDB_NAME:\x1b[0m', process.env.DB_NAME || 'microcoaster_bot');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || 'password',
  database: process.env.DB_NAME || 'microcoaster_bot',
  waitForConnections: true,
  connectionLimit: 5,
  queueLimit: 0,
  multipleStatements: true,
  charset: 'utf8mb4',
  connectTimeout: 300000, // 5 minutes
});

// Test de connexion au démarrage
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log('\x1b[38;5;2m✅ Connexion au pool MySQL réussie !\x1b[0m');
    connection.release();
  } catch (error) {
    console.error('\x1b[38;5;1m❌ Échec de la connexion MySQL:', error.message, '\x1b[0m');
    console.error('\x1b[38;5;3m💡 Vérifiez vos variables d\'environnement dans le fichier .env\x1b[0m');
  }
})();

// Gestionnaire de connexion centralisé
let sharedConnection = null;

/**
 * Obtenir une connexion partagée à la base de données
 * Crée une nouvelle connexion si nécessaire ou si l'ancienne n'est plus valide
 */
async function getSharedConnection() {
  try {
    if (sharedConnection) {
      try {
        await sharedConnection.execute('SELECT 1');
        return sharedConnection;
      } catch {
        console.log("\x1b[38;5;3m🔄 Connexion expirée, création d'une nouvelle...\x1b[0m");
        sharedConnection = null;
      }
    }
    console.log("\x1b[38;5;4m🔗 Création d'une nouvelle connexion partagée...\x1b[0m");
    sharedConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || 'password',
      database: process.env.DB_NAME || 'microcoaster_bot',
      charset: 'utf8mb4',
      connectTimeout: 300000,
    });
    console.log('\x1b[38;5;2m✅ Connexion partagée établie\x1b[0m');
    return sharedConnection;
  } catch (error) {
    console.error(`\x1b[38;5;1m❌ Erreur lors de la création de la connexion partagée: ${error.message}\x1b[0m`);
    throw error;
  }
}

/**
 * Fermer proprement la connexion partagée
 */
async function closeSharedConnection() {
  if (sharedConnection) {
    try {
      await sharedConnection.end();
      console.log('\x1b[38;5;4m🔒 Connexion partagée fermée\x1b[0m');
    } catch (error) {
      console.error(`\x1b[38;5;1m❌ Erreur lors de la fermeture: ${error.message}\x1b[0m`);
    } finally {
      sharedConnection = null;
    }
  }
}

module.exports = {
  pool,
  getSharedConnection,
  closeSharedConnection
};
