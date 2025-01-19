const express = require('express');
const categoryController = require('../controllers/categoryController');
const router = express.Router();

router.get('/allCategories', categoryController.getAllCategories);
router.get('/categoriesDropDown', categoryController.getCategoriesDropDown);
router.post('/addCategory', categoryController.addCategory);
router.post('/updateCategory', categoryController.updateCategory);
router.delete('/deleteCategory', categoryController.deleteCategory);

module.exports = router;