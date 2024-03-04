import React, { useState, useEffect } from 'react';
import { Table } from 'antd';
import axios from 'axios';

const ParkingSlots = () => {
  const [parkingSlots, setParkingSlots] = useState([]);

  useEffect(() => {
    fetchParkingSlots();
  }, []);

  const fetchParkingSlots = () => {
    axios.get('http://localhost:3000/api/parking-slots')
      .then(response => {
        console.log('Parking slots fetched successfully:', response.data);
        setParkingSlots(response.data);
      })
      .catch(error => {
        console.error('Error fetching parking slots:', error);
      });
  };

  const columns = [
    {
      title: 'Entry Point',
      dataIndex: 'entryPoint',
      key: 'entryPoint',
    },
    {
      title: 'Size',
      dataIndex: 'slots',
      key: 'size',
      render: (_, record) => {
        return record.slots.map(slot => (
          <div key={slot.id}>{slot.size}</div>
        ));
      },
    },
    {
      title: 'Occupied',
      dataIndex: 'slots',
      key: 'occupied',
      render: (_, record) => {
        return record.slots.map(slot => (
          <div key={slot.id}>{slot.occupied ? 'Yes' : 'No'}</div>
        ));
      },
    },
    {
      title: 'Distance',
      dataIndex: 'slots',
      key: 'distance',
      render: (_, record) => {
        return record.slots.map(slot => (
          <div key={slot.id}>{slot.distance}</div>
        ));
      },
    },
  ];
  

  return (
    <div>
      <h1>Parking Slots</h1>
      <Table dataSource={parkingSlots} columns={columns} />
    </div>
  );
};

export default ParkingSlots;
