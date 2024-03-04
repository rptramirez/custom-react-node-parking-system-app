import React, { useState, useEffect } from 'react';
import { Form, Select, Button, message, Space, TimePicker } from 'antd';
import axios from 'axios';
import moment from 'moment';
const { Option } = Select;

const API_URL = 'http://localhost:3000/api';

const Unparking = () => {
  const [entryPoints, setEntryPoints] = useState([]);
  const [slots, setSlots] = useState([]);
  const [exitTimes, setExitTimes] = useState([]);

  useEffect(() => {
    fetchParkingData();
  }, []);

  const fetchParkingData = async () => {
    try {
      const response = await axios.get(`${API_URL}/parking-slots`);
      const parkingData = response.data;

      // Extract entry points, slots, and exit times from parking data
      const entryPoints = parkingData.map(entry => entry.entryPoint);
      const slots = parkingData.reduce((acc, entry) => acc.concat(entry.slots), []);
      // Example exit times
      const exitTimes = []; // You can populate this array with your desired time options

      setEntryPoints(entryPoints);
      setSlots(slots);
      setExitTimes(exitTimes);
    } catch (error) {
      console.error('Error fetching parking data:', error);
      message.error('Failed to fetch parking data. Please try again later.');
    }
  };

  const handleFormSubmit = async (values) => {
    try {
      // Make API request to remove parking slot
      const response = await axios.post(`${API_URL}/unpark`, values);
  
      const { fee } = response.data;

      // Display success message with fee
      message.success(`Unparked successfully. Please pay amount of: ${fee}`);
    } catch (error) {
      // Handle errors
      console.error('Unparking error:', error);
      if (error.response && error.response.data && error.response.data.error) {
        message.error(error.response.data.error);
      } else {
        message.error('An error occurred while unparking the vehicle');
      }
    }
  };
  
  return (
    <div style={{ padding: '16px' }}>
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h1>Unparking</h1>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Form
          onFinish={handleFormSubmit}
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: '400px' }}
        >
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            <Form.Item
              label="Entry Point"
              name="entryPoint"
              rules={[{ required: true, message: 'Please select entry point' }]}
            >
              <Select style={{ width: '200px' }}>
                {entryPoints.map(entry => (
                  <Option key={entry} value={entry}>{entry}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Slot"
              name="slot"
              rules={[{ required: true, message: 'Please select slot' }]}
            >
              <Select style={{ width: '200px' }}>
                {slots.map(slot => (
                  <Option key={slot.id} value={slot.id}>{slot.size}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Exit Time"
              name="exitTime"
              rules={[{ required: true, message: 'Please select exit time' }]}
            >
              <TimePicker style={{ width: '200px' }} format="HH:mm" />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Unpark Vehicle
              </Button>
            </Form.Item>
          </Space>
        </Form>
      </div>
    </div>
  );
};

export default Unparking;
