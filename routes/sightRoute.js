const express = require('express');
const sightController = require('../controllers/sightController');
const router = express.Router();

router.post('/addSight', sightController.addSight);
router.post('/updateSight', sightController.updateSight);
router.get('/allSights', sightController.getAllSights);
router.post('/search', sightController.findSuchergebnisse);
router.post('/filter', sightController.findFilterergebnisse);
router.delete('/deleteSight', sightController.deleteSight);

console.log("Wurde aufgerufen")

module.exports = router;