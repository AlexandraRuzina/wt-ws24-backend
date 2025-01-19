const categoryModel = require('../models/categoryModel');
const sightModel = require("../models/sightModel");

const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryModel.selectAllCategories(); // Funktion aufrufen, um die Sights zu holen
        res.status(200).json(categories); // Konvertierung der Datensätze in JSON
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Sights' }); // Fehlerbehandlung
    }
};

const getCategoriesDropDown = async(req, res) => {
    try{
        const categories = await categoryModel.selectCategoriesDropDown();
        res.status(200).json(categories);
    }catch (err) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Sights' });
    }
}

const addCategory = async (req, res) => {
    const query = req.body
    try {
        const found = await categoryModel.insertCategory(query);
        res.status(200).json({ value: "Entry was successful." });

    } catch (error) {
        if (error.code === '23505') {
            res.status(200).json({
                value: 'A category with this name already exists.',
            });
        }
    }
};

const updateCategory = async (req, res) => {
    const query = req.body
    try {
        const found = await categoryModel.updateCategory(query);
        res.status(200).json({ value: "Update was successful." });

    } catch (error) {
        if (error.code === '23505') {
            res.status(200).json({
                value: 'A category with this name already exists.',
            });
        }
    }
};

const deleteCategory = async (req, res) => {
    try {
        const { category } = req.body;
        const categories = await categoryModel.deleteCategory(category);
        res.status(200).json(categories.rows)
    } catch (err) {
        res.status(500).json({ error: 'Fehler beim Löschen' });
    }
};

module.exports = {getAllCategories, getCategoriesDropDown, addCategory, updateCategory, deleteCategory};