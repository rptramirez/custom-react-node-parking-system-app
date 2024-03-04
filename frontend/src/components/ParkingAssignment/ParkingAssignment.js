import React, { useState, useEffect } from 'react';
import { Form, Button, Select, message } from 'antd';
import axios from 'axios';

const { Option } = Select;

const ParkingAssignment = () => {
  const [entryPoints, setEntryPoints] = useState([]);
  const [vehicleSize, setVehicleSize] = useState('');
  const [selectedEntryPoint, setSelectedEntryPoint] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [filteredSlots, setFilteredSlots] = useState([]);

  useEffect(() => {
    // Fetch entry points on component mount
    axios.get('http://localhost:3000/api/entry-points')
      .then(response => {
        setEntryPoints(response.data);
      })
      .catch(error => console.error(error));
    
    // Fetch available slots on component mount
    axios.get('http://localhost:3000/api/parking-slots')
      .then(response => {
        setAvailableSlots(response.data);
      })
      .catch(error => console.error(error));
  }, []);
  
  const handleEntryPointChange = (value) => {
    setSelectedEntryPoint(value);
  };

  const handleVehicleSizeChange = (value) => {
    setVehicleSize(value);
  };

  const handleFormSubmit = (values) => {
    const { entryPoint, parkingSlot } = values;
    // Make API request to assign parking slot
    axios.post('http://localhost:3000/api/assign-slot', { entryPoint, parkingSlot, vehicleSize })
      .then(() => {
        // Display success message
        message.success('Vehicle parked successfully.');
        // Refetch available slots after parking
        axios.get('http://localhost:3000/api/parking-slots')
          .then(response => {
            setAvailableSlots(response.data);
          })
          .catch(error => console.error(error));
      })
      .catch(error => {
        // Handle errors
        console.error('Parking assignment error:', error);
        message.error('Failed to park vehicle. Please try again later.');
      });
  };
  
  useEffect(() => {
    if (selectedEntryPoint && vehicleSize) {
      const entryPointSlots = availableSlots.find(slot => slot.entryPoint === selectedEntryPoint);
      if (entryPointSlots && entryPointSlots.slots.length > 0) {
        const filteredSlots = entryPointSlots.slots.filter(slot => {
          // Check if the slot size is suitable for the vehicle
          return !slot.occupied && slot.size === vehicleSize.toUpperCase();
        });
        setFilteredSlots(filteredSlots); // Update filtered slots state
      }
    }
  }, [selectedEntryPoint, vehicleSize, availableSlots]);
  
  return (
    <div>
      <h1 style={{ textAlign: 'center', marginBottom: '16px' }}>Parking Assignment</h1>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Form
          onFinish={handleFormSubmit}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: '400px' }}
        >
          <Form.Item
            label="Entry Point"
            name="entryPoint"
            rules={[{ required: true, message: 'Please select an entry point' }]}
          >
            <Select onChange={handleEntryPointChange} style={{ width: '200px' }}>
              {entryPoints.map(point => (
                <Option key={point} value={point}>{point}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Vehicle Size"
            name="vehicleSize"
            rules={[{ required: true, message: 'Please select a vehicle size' }]}
          >
            <Select onChange={handleVehicleSizeChange} style={{ width: '200px' }}>
              <Option value="SP">Small</Option>
              <Option value="MP">Medium</Option>
              <Option value="LP">Large</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Parking Slot"
            name="parkingSlot"
            rules={[{ required: true, message: 'Please select a parking slot' }]}
          >
            <Select style={{ width: '200px' }}>
              {filteredSlots.map(slot => (
                <Option key={slot.id} value={slot.id}>{slot.size}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Park Vehicle
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
  
};

export default ParkingAssignment;
