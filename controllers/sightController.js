const sightModel = require('../models/sightModel');
const fetch = require('node-fetch');
require('dotenv').config();

const GOOGLE_MAPS_API_KEY = process.env.API_KEY;

const getAllSights = async (req, res) => {
    try {
        const sights = await sightModel.selectAllSights(); // Funktion aufrufen, um die Sights zu holen
        res.status(200).json(sights); // Konvertierung der Datensätze in JSON
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Sights' }); // Fehlerbehandlung
    }
};

const deleteSight = async (req, res) => {
    try {
        const { name } = req.body;
        const sights = await sightModel.deleteSight(name);
        res.status(200).json(sights.rows)
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Löschen' });
    }
};

const findSuchergebnisse = async (req, res) => {
    const { query } = req.body;
    console.log("Suchanfrage erhalten:", query);

    try {
        const found = await sightModel.findSuchergebnisse(query);

        if (found.length > 0) {
            res.status(200).json(found);
        } else {
            // Keine Ergebnisse gefunden
            res.status(404).json({ message: "Keine Ergebnisse gefunden" });
        }

    } catch (err) {
        console.error('Fehler beim Abrufen der Sights:', err);
        res.status(500).json({ error: 'Fehler beim Abrufen der Sights' }); // Fehlerbehandlung
    }
};

const findFilterergebnisse = async (req, res) => {
    const query  = req.body;
    console.log("Suchanfrage erhalten:", query);

    try {

        const found = await sightModel.findFilterergebnisse(req.body);

        if (found.length > 0) {
            res.status(200).json(found);
        } else {
            // Keine Ergebnisse gefunden
            res.status(404).json({ message: "Keine Ergebnisse gefunden" });
        }

    } catch (err) {
        console.error('Fehler beim Abrufen der Sights:', err);
        res.status(500).json({ error: 'Fehler beim Abrufen der Sights' }); // Fehlerbehandlung
    }
};

const addSight = async (req, res) => {
    const query  = req.body;
    const { name, price, selectedCategory, picture, description } = req.body
    if (isNaN(price) || price < 0 || price > 100) {
        return res.status(400).json({ value: "The price is not a valid number." });
    }

    console.log(`Name: ${name}`)
    inBarca = await validateSpotLocation(name)
    validUrl = await isValidURL(picture)
    console.log(validUrl)
    if(inBarca && (validUrl || picture==="")) {
        try {
            const found = await sightModel.insertSight(query);
            res.status(200).json({ value: "Entry was successful." }); // Rückgabe der gefundenen Ergebnisse als JSON

        } catch (error) {
            // Fehlercode 23505 (Duplicate Key)
            if (error.code === '23505') {
                res.status(200).json({
                    value: 'A sight with this name already exists.',
                });
            }
            if (error.code === '23503') {
                res.status(400).json({
                    value: 'Category not found',
                });
            }
        }
    }
    else if(inBarca && (!validUrl && picture!=="")){
        res.status(200).json({ value: "The provided URL is invalid." });
    }
    else if (!inBarca && (validUrl || picture==="")){
        res.status(200).json({ value: "The specified location is not in Barcelona."});
    }else if (!inBarca && (!validUrl && picture!=="")){
        res.status(200).json({ value: "The specified location is not in Barcelona, and the URL is invalid."});
    }
};

const updateSight = async (req, res) => {
    const query  = req.body;
    const { name, price, category, picture, description, sight } = req.body
    if (isNaN(price) || price < 0 || price > 100) {
        return res.status(400).json({ value: "The price is not a valid number." });
    }
    console.log(`Name: ${name}`)
    inBarca = await validateSpotLocation(name)
    validUrl = await isValidURL(picture)
    console.log(validUrl)
    if(inBarca && (validUrl || picture==="")) {
        try {
            const found = await sightModel.updateSight(query);
            res.status(200).json({ value: "Update was successful." }); // Rückgabe der gefundenen Ergebnisse als JSON

        } catch (error) {
            // Fehlercode 23505 (Duplicate Key)
            if (error.code === '23505') {
                res.status(200).json({
                    value: 'A sight with this name already exists.',
                });
            }

            if (error.code === '23503') {
                res.status(400).json({
                    value: 'Category not found',
                });
            }
        }
    }
    else if(inBarca && (!validUrl && picture!=="")){
        res.status(200).json({ value: "The provided URL is invalid." });
    }
    else if (!inBarca && (validUrl || picture==="")){
        res.status(200).json({ value: "The specified location is not in Barcelona."});
    }else if (!inBarca && (!validUrl && picture!=="")){
        res.status(200).json({ value: "The specified location is not in Barcelona, and the URL is invalid."});
    }
};

async function validateSpotLocation(name) {
    const encodedAddress = encodeURIComponent(name);
    console.log(encodedAddress)
    const geocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GOOGLE_MAPS_API_KEY}`;

    try {
        const response = await fetch(geocodingUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const address = data.results[0].formatted_address;
        console.log("Formatted Address:", address);
        if (address.includes("Barcelona")) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.error("Error validating location:", error);
    }
}

async function isValidURL(urlString) {
    try {
        if (!urlString.endsWith('.png') && !urlString.endsWith('.jpg')){
            return false;
        }
        const url = new URL(urlString);
        const response = await fetch(url);
        if (response.ok) {
            return true
        } else {
            console.log(`Fehler: ${response.status} - ${response.statusText}`);
            return false
        }
    } catch (e) {
        return false;
    }
}


module.exports = { addSight,updateSight, getAllSights, findSuchergebnisse, findFilterergebnisse, deleteSight };