// components/DeleteParkingSlot.js
import React from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:3001/parkingSlots';

const DeleteParkingSlot = ({ id, onDelete }) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      onDelete(id);
    } catch (error) {
      console.error('Error deleting parking slot:', error);
    }
  };

  return (
    <div>
      <h2>Delete Parking Slot</h2>
      <button onClick={handleDelete}>Delete</button>
    </div>
  );
};

export default DeleteParkingSlot;
