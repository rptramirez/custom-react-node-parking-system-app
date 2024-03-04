const Axios = require('axios');
const moment = require('moment');
const uuid = require('uuid');

const API_URL = 'http://localhost:3001';

const jsonServer = require('json-server');
const router = jsonServer.router('db.json');

// Function to calculate parking fees
function calculateParkingFee(hoursParked, slotSize) {
  let totalFee = 0;

  // Flat rate for the first 3 hours
  totalFee += 40;

  // Calculate exceeding hourly rate
  if (hoursParked > 3) {
    let hourlyRate;
    switch (slotSize) {
      case 'SP':
        hourlyRate = 20;
        break;
      case 'MP':
        hourlyRate = 60;
        break;
      case 'LP':
        hourlyRate = 100;
        break;
    }

    // Calculate fee for exceeding hours
    totalFee += Math.ceil(hoursParked - 3) * hourlyRate;

    // Calculate fee for full 24-hour chunks
    const full24HourChunks = Math.floor(hoursParked / 24);
    totalFee += full24HourChunks * 5000;
  }

  return totalFee;
}

// Function to handle vehicle leaving and returning within one hour
function adjustParkingFeeForReturnWithinOneHour(hoursParked, lastExitTime) {
  const timeDifference = moment().diff(lastExitTime, 'minutes');
  if (timeDifference <= 60) {
    return 0; // No additional charge within one hour
  } else {
    return hoursParked;
  }
}

let lastExitTime = moment(); // Initialize last exit time

// Controller function to get current parking status
const getParkingSlots = async (req, res) => {
  try {
    const parkingData = router.db.getState().parkingSlots;

    // Extract parked slots from each entry point
    const parkedCars = parkingData.map(entry => {
      const availableSlots = entry.slots.filter(slot => !slot.occupied);
      return { entryPoint: entry.entryPoint, slots: availableSlots };
    });

    res.json(parkedCars);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const assignParkingSlot = async (req, res) => {
  const { entryPoint, parkingSlot, vehicleSize } = req.body;

  // Find the selected entry point and parking slot
  const entryPointData = router.db.get('parkingSlots').find({ entryPoint }).value();
  const selectedSlot = entryPointData.slots.find(slot => slot.id === parkingSlot);

  // Check if the selected slot exists and is not occupied
  if (selectedSlot && !selectedSlot.occupied && selectedSlot.size === vehicleSize.toUpperCase()) {
    // Mark the slot as occupied
    selectedSlot.occupied = true;

    // Update the server's data
    router.db.get('parkingSlots')
      .find({ entryPoint })
      .assign(entryPointData)
      .write();

    res.status(200).json({ message: 'Vehicle parked successfully' });
  } else {
    res.status(400).json({ error: 'Invalid parking slot selection' });
  }
};

// Controller function to get parking sizes
const getParkingSizes = async (req, res) => {
  try {
    const parkingSizes = router.db.getState().parkingSizes;
    res.json(parkingSizes);
  } catch (error) {
    console.error('error', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Controller function to get entry points
const getEntryPoints = async (req, res) => {
  try {
    const entryPoints = router.db.getState().entryPoints;
    res.json(entryPoints);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeParkingSlot = async (req, res) => {
  const { entryPoint, slot, exitTime } = req.body;
  try {
    // Retrieve parking slots data from the JSON database
    const parkingData = router.db.getState().parkingSlots;

    // Find the entry point
    const entryToUpdate = parkingData.find(entry => entry.entryPoint === entryPoint);
    if (!entryToUpdate) {
      return res.status(400).json({ error: 'Entry point not found' });
    }

    // Find the slot within the entry point
    const slotToUpdate = entryToUpdate.slots.find(s => s.id === slot);
    if (!slotToUpdate) {
      return res.status(400).json({ error: 'Slot not found' });
    }

    // Update the occupied status of the slot to false
    slotToUpdate.occupied = false;

    // Update the server's data using JSON database methods
    router.db.get('parkingSlots')
      .find({ entryPoint })
      .assign(entryToUpdate)
      .write();

    // Ensure exitTime is in valid format (ISO 8601)
    const exitTimeMoment = moment(exitTime); // Parse ISO 8601 format directly
    if (!exitTimeMoment.isValid()) {
      return res.status(400).json({ error: 'Invalid exit time format' });
    }

    // Format exit time into ISO format for better compatibility
    const formattedExitTime = exitTimeMoment.format('YYYY-MM-DDTHH:mm:ss.SSSZ');

    // Calculate hours parked
    const hoursParked = moment().diff(formattedExitTime, 'hours');
    // Check if the vehicle returned within one hour
    const adjustedHoursParked = adjustParkingFeeForReturnWithinOneHour(
      hoursParked,
      formattedExitTime
    );
    // Calculate parking fee
    const fee = calculateParkingFee(adjustedHoursParked, slotToUpdate.size);

    // Send response with the fee
    res.json({ fee });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getParkingSlots,
  assignParkingSlot,
  getParkingSizes,
  getEntryPoints,
  removeParkingSlot,
};
