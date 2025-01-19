const userModel = require('../models/userModel');
const fetch = require('node-fetch');
const categoryModel = require("../models/categoryModel");

const addUser = async (req, res) => {
    const query  = req.body;
        try {
            const found = await userModel.insertUser(query);
            res.status(200).json({ value: "Entry was successful." });

        } catch (error) {
            // Fehlercode 23505 (Duplicate Key)
            if (error.code === '23505') {
                res.status(200).json({
                    value: 'User already exists.',
                });
            }
        }
};

const loginUser = async (req, res) => {
    const query  = req.body;
    try {
        const found = await userModel.findUser(query);
        //hier cookie überprüfen
        res.status(200).json(found);

    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen der User' });
    }
};

const visitedSpot = async (req, res) => {
    const query  = req.body;
    try {
        const found = await userModel.visitedSpot(query);
        res.status(200).json(found);

    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Spot' });
    }
};

const spotsDropdown =async (req, res) =>{
    try{
        const spots = await userModel.spotsDropdown();
        res.status(200).json(spots);
    }catch (err) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Sights' });
    }
}

const addVisitedSpot = async (req, res) => {
    const query = req.body
    try {
        const found = await userModel.addVisitedSpot(query);
        res.status(200).json({ value: "Entry was successful." });

    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Eintragen' });
    }
};

const deleteVisitedSpot = async (req, res) => {
    try {
        const query = req.body;
        const deleted = await userModel.deleteVisitedSpot(query);
        res.status(200).json(deleted.rows)
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Löschen' });
    }
};

module.exports = { addUser, loginUser, visitedSpot, spotsDropdown, addVisitedSpot, deleteVisitedSpot};