import React from 'react';
import { Layout } from 'antd';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import ParkingSlots from './components/ParkingSlots';
import ParkingAssignment from './components/ParkingAssignment';
import Unparking from './components/UnParking';
import { SideBar } from './components/templates'; // Import Sidebar component

const { Content } = Layout;

const App = () => {
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <SideBar />
        <Layout>
          <Content style={{ margin: '16px' }}>
            <Switch>
              <Route path="/" exact component={ParkingSlots} />
              <Route path="/parking-assignment" component={ParkingAssignment} />
              <Route path="/unparking" component={Unparking} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};
export default App;
