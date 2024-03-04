import React from 'react';
import { RocketFilled, AimOutlined, ProfileOutlined, ShoppingCartOutlined, RiseOutlined, ShopFilled } from '@ant-design/icons';

const services = [
  {
    code: 'parking',
    name: 'Parking',
    link: '/parking', // Main link for the service
    icon: <RocketFilled style={{ color: '#06b7ab' }} />, // Icon for the service
    nav: [
      {
        path: '/', // Path for the main page of the service
        label: 'Parking Slots',
        icon: <AimOutlined />,
      },
      {
        path: '/parking-assignment', // Path for parking assignment
        label: 'Parking Assignment',
        icon: <AimOutlined />,
      },
      {
        path: '/unparking', // Path for unparking
        label: 'Unparking',
        icon: <AimOutlined />,
      },
    ],
  },
];

export default services;
