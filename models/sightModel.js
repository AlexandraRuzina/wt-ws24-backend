const pool  = require('../config/database');
const DOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const purify = DOMPurify(window);

// Funktion zur Bereinigung der Beschreibung
function sanitizeDescription(description) {
    return purify.sanitize(description, {
        ALLOWED_TAGS: [], // Keine HTML-Tags erlauben
        ALLOWED_ATTR: []  // Keine Attribute erlauben
    });
}

const selectAllSights = async () =>{
    const queryText = 'SELECT * FROM "Sight" ORDER BY Name';

    try {
        const result = await pool.query(queryText); // Anfrage an die Datenbank senden
        const sights = result.rows.map((sight) => ({
            ...sight,
        }));
        return sights
    } catch (err) {
        console.error('Fehler beim Abrufen der Sights:', err);
        throw err; // Fehler weitergeben, damit er von der aufrufenden Funktion behandelt wird
    }
}

const findSuchergebnisse = async (query) => {
    const queryLow = query.toLowerCase();
    try {

        const queryText = 'SELECT * FROM "Sight" WHERE LOWER(name) = $1 ORDER BY name';
        const result = await pool.query(queryText, [queryLow]);

        if (result.rows.length > 0) {
            console.log("Gefundene Ergebnisse nach Name:", result.rows);
            const resultFound = result.rows.map((sight) => ({
                ...sight,
            }));
            return resultFound
        } else {
            // Wenn keine Ergebnisse bei der ersten Abfrage, versuche die zweite Abfrage
            const queryText2 = 'SELECT * FROM "Sight" WHERE LOWER(category) = $1';
            const result2 = await pool.query(queryText2, [queryLow]);

            if (result2.rows.length > 0) {
                console.log("Gefundene Ergebnisse nach Kategorie:", result2.rows);
                const resultFound = result2.rows.map((sight) => ({
                    ...sight,
                }));
                return resultFound
            } else {
                // Wenn beide Abfragen keine Ergebnisse liefern, gebe eine leere Liste oder Fehlermeldung zurück
                console.log("Keine Ergebnisse gefunden");
                return []; // Leere Liste, um anzuzeigen, dass keine Ergebnisse gefunden wurden
            }
        }
    } catch (error) {
        console.error('Fehler bei der Suche:', error);
        throw error; // Fehler weitergeben
    }
};

const findFilterergebnisse = async (query) => {
    try {
        const values = query.category === 'All' ? [query.price] : [query.category, query.price];
        let queryText
        if(query.category === 'All'){
             queryText = 'SELECT * FROM "Sight" WHERE price <= $1 ORDER BY name';
        }
        else{
            queryText = 'SELECT * FROM "Sight" WHERE category = $1 AND price <= $2 ORDER BY name';
        }
        const result = await pool.query(queryText, values);

        if (result.rows.length > 0) {
            console.log("Gefundene Ergebnisse nach Name:", result.rows);
            const resultFound = result.rows.map((sight) => ({
                ...sight,
            }));
            return resultFound
        }
        else {
            // Wenn beide Abfragen keine Ergebnisse liefern, gebe eine leere Liste oder Fehlermeldung zurück
            console.log("Keine Ergebnisse gefunden");
            return []; // Leere Liste, um anzuzeigen, dass keine Ergebnisse gefunden wurden
        }

    } catch (error) {
        console.error('Fehler bei der Suche:', error);
        throw error; // Fehler weitergeben
    }
};

const insertSight = async (query) => {
    try {
        const sanitizedDescription = sanitizeDescription(query.description);
        console.log(sanitizedDescription)
        const values = [query.name, query.selectedCategory, query.price, sanitizedDescription, query.picture]
        const queryText = 'INSERT INTO "Sight" (Name, Category, Price, Description, Picture) VALUES ($1, $2, $3, $4, $5)';
        const result = await pool.query(queryText, values);
        return result;

    } catch (error) {
        console.error('Fehler bei der Suche:', error);
        throw error; // Fehler weitergeben
    }
};

const updateSight = async (query) => {
    try {
        const sanitizedDescription = sanitizeDescription(query.description);
        console.log(sanitizedDescription)
        const values = [query.name, query.category, query.price, sanitizedDescription, query.picture, query.sight]
        const queryText = 'UPDATE "Sight" SET Name = $1, Category = $2, Price = $3, Description = $4, Picture = $5 WHERE Name = $6';
        const result = await pool.query(queryText, values);
        return result;

    } catch (error) {
        console.error('Fehler bei der Suche:', error);
        throw error; // Fehler weitergeben
    }
};

const deleteSight = async (query) =>{
    try{
        console.log(query)
        const queryText = 'DELETE FROM "Sight" WHERE Name=$1'
        const result = await pool.query(queryText, [query])
        return result;
    }
    catch (error) {
        console.error('Fehler beim Löschen:', error);
        throw error; // Fehler weitergeben
    }
}


module.exports = { insertSight, updateSight, selectAllSights, findSuchergebnisse, findFilterergebnisse, deleteSight };