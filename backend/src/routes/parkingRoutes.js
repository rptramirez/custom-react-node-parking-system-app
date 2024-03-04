const express = require('express');
const router = express.Router(); // Create a router instance
const cors = require('cors');

const parkingController = require('../controllers/parkingController');

router.use(cors());

// Define routes for parking functionalities
router.get('/parking-slots', parkingController.getParkingSlots);
router.get('/entry-points', parkingController.getEntryPoints);
router.get('/parking-sizes', parkingController.getParkingSizes);
router.post('/assign-slot', parkingController.assignParkingSlot);
router.post('/unpark', parkingController.removeParkingSlot)


module.exports = router; // Export the router instance