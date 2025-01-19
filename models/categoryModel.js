const pool = require('../config/database');

const selectAllCategories = async () =>{
    const queryText = 'SELECT "Category".name, COUNT("Sight".category) as count FROM "Sight" RIGHT JOIN "Category" ON "Sight".category="Category".name GROUP BY "Category".name ORDER BY COUNT(*) DESC';

    try {
        const result = await pool.query(queryText); // Anfrage an die Datenbank senden
        const categories = result.rows;
        return categories
    } catch (err) {
        console.error('Fehler beim Abrufen der Sights:', err);
        throw err; // Fehler weitergeben, damit er von der aufrufenden Funktion behandelt wird
    }
}

const selectCategoriesDropDown = async () => {
    const queryText = 'SELECT name FROM "Category" ORDER BY name';

    try{
        const result = await pool.query(queryText);
        const categories = result.rows;
        return categories
    }catch (err) {
        console.error('Fehler beim Abrufen der Sights:', err);
        throw err;
    }
}

const insertCategory = async (query) => {
    try {
        const values = [query.category]
        const queryText = 'INSERT INTO "Category" (Name) VALUES ($1)';
        const result = await pool.query(queryText, values);
        return result;

    } catch (error) {
        console.error('Fehler beim Eintrag:', error);
        throw error; // Fehler weitergeben
    }
};

const updateCategory = async (query) => {
    try {
        const values = [query.category, query.old]
        const queryText = 'UPDATE "Category" SET Name=$1 WHERE Name=$2';
        const result = await pool.query(queryText, values);
        return result;

    } catch (error) {
        console.error('Fehler beim Updaten:', error);
        throw error; // Fehler weitergeben
    }
};

const deleteCategory = async (query) =>{
    try{
        const queryText = 'DELETE FROM "Category" WHERE Name=$1'
        const result = await pool.query(queryText, [query])
        return result;
    }
    catch (error) {
        console.error('Fehler beim Löschen:', error);
        throw error; // Fehler weitergeben
    }
}

module.exports = { selectAllCategories, selectCategoriesDropDown, insertCategory, updateCategory, deleteCategory };