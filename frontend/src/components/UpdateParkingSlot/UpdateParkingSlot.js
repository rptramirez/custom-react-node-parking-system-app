// components/UpdateParkingSlot.js
import React, { useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/parkingSlots';

const UpdateParkingSlot = ({ id, onUpdate }) => {
  const [distance, setDistance] = useState('');
  const [size, setSize] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${API_URL}/${id}`, { distance, size });
      onUpdate(response.data);
      setDistance('');
      setSize('');
    } catch (error) {
      console.error('Error updating parking slot:', error);
    }
  };

  return (
    <div>
      <h2>Update Parking Slot</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Distance" value={distance} onChange={(e) => setDistance(e.target.value)} />
        <input type="text" placeholder="Size" value={size} onChange={(e) => setSize(e.target.value)} />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UpdateParkingSlot;
