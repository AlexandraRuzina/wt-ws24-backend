require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: true  // Bei Neon muss dies true sein!
    },
});

// Wrapper-Funktion für pool.query
const query = async (queryText, values) => {
    try {
        return await pool.query(queryText, values); // Führt die Abfrage aus und gibt das Ergebnis zurück
    } catch (err) {
        console.error('Datenbankfehler:', err);
        throw err; // Fehler weitergeben
    }
};

module.exports = {pool, query};

