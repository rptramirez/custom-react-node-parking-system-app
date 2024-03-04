import React from 'react';
import { Layout, Menu } from 'antd';
import { Link, useRouteMatch } from 'react-router-dom';
import { LogoutOutlined } from '@ant-design/icons';
import services from '../../../services' // Import services configuration

const { Sider } = Layout;
const { SubMenu } = Menu;

const Sidebar = () => {
  const match = useRouteMatch();

  // Determine the selected keys based on the current route
  const matchNav = services.reduce((arr, service) => {
    if (
      !arr.includes(service.code) &&
      service.nav.find(({ path }) => match.path.includes(path))
    ) {
      arr.push(service.code);
    }
    return arr;
  }, []);

  return (
    <Sider width={200} theme="dark">
      <Menu
        mode="inline"
        defaultSelectedKeys={matchNav}
        style={{ height: '100%', borderRight: 0 }}
      >
        {services.map((service) => (
          <SubMenu key={service.code} icon={service.icon} title={service.name}>
            {service.nav.map((navItem) => (
              <Menu.Item key={navItem.path}>
                <Link to={navItem.path}>{navItem.label}</Link>
              </Menu.Item>
            ))}
          </SubMenu>
        ))}
      </Menu>
    </Sider>
  );
};

export default Sidebar;
