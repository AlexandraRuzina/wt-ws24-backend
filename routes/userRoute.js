const express = require('express');
const userController = require('../controllers/userController');
const router = express.Router();

router.post('/addUser', userController.addUser);
router.post('/loginUser', userController.loginUser);
router.post('/visited', userController.visitedSpot);
router.get('/spots', userController.spotsDropdown);
router.post('/addVisitedSpot', userController.addVisitedSpot);
router.post('/deleteVisitedSpot', userController.deleteVisitedSpot);

module.exports = router;