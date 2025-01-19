const pool = require('../config/database');
const bcrypt = require('bcryptjs');

const hashPassword = async (plainPassword) => {
    try {
        const saltRounds = 10; // Anzahl der Salt-Runden (je höher, desto sicherer, aber langsamer)
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        console.log("Hashed Password:", hashedPassword);
        return hashedPassword;
    } catch (error) {
        console.error("Error while hashing password:", error);
    }
};

const insertUser = async (query) => {
    try {
        const hashedPassword = await hashPassword(query.password);
        const values = [query.username, query.email, hashedPassword]
        const queryText = 'INSERT INTO "User" (Username, Email, Password) VALUES ($1, $2, $3)';
        const result = await pool.query(queryText, values);
        return result;

    } catch (error) {
        console.error('Fehler bei der Suche:', error);
        throw error; // Fehler weitergeben
    }
};

const findUser = async (query) => {
    try {
        const values = [query.username]
        const queryText = 'SELECT * FROM "User" WHERE Username=$1';
        const result = await pool.query(queryText, values);
        if (result.rows.length === 0) {
            return { success: false, message: "User not found" };
        }

        const user = result.rows[0];
        const hashedPassword = user.password;
        const isMatch = await bcrypt.compare(query.password, hashedPassword);

        if (isMatch) {
            return { success: true, message: "Login succesful"};
        } else {
            return { success: false, message: "Wrong password" };
        }

    } catch (error) {
        console.error('Fehler beim Login:', error);
        throw error; // Fehler weitergeben
    }
};

const visitedSpot = async (query) => {
    try {
        const queryText = 'SELECT "Spot" FROM "VisitedSpots" WHERE "user"=$1';
        const result = await pool.query(queryText, [query.query]);
        console.log(result)
        return result
    } catch (error) {
        console.error('Fehler beim Laden der Spots:', error);
        throw error; // Fehler weitergeben
    }
};

const spotsDropdown = async (query) => {
    const queryText = `
    WITH visited AS (
        SELECT "Spot" FROM "VisitedSpots"
    )
    SELECT name 
    FROM "Sight"
    WHERE name NOT IN (SELECT "Spot" FROM visited)
    ORDER BY name`;

    try{
        const result = await pool.query(queryText);
        const spots = result.rows;
        return spots
    }catch (err) {
        console.error('Fehler beim Abrufen der Sights:', err);
        throw err;
    }

};

const addVisitedSpot = async (query) => {
    try {
        const values = [query.selectedSpot, query.username]
        const queryText = 'INSERT INTO "VisitedSpots" ("Spot", "user") VALUES ($1, $2)';
        const result = await pool.query(queryText, values);
        return result;

    } catch (error) {
        console.error('Fehler beim Eintrag:', error);
        throw error; // Fehler weitergeben
    }
};

const deleteVisitedSpot = async (query) =>{
    try{
        const values = [query.selectedSpot, query.username]
        const queryText = 'DELETE FROM "VisitedSpots" WHERE "Spot"=$1 AND "user"=$2'
        const result = await pool.query(queryText, values)
        return result;
    }
    catch (error) {
        console.error('Fehler beim Löschen:', error);
        throw error; // Fehler weitergeben
    }
}

module.exports = { insertUser, findUser, visitedSpot, spotsDropdown, addVisitedSpot, deleteVisitedSpot};