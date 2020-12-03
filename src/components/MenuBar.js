import React, { useContext, useState, useEffect } from 'react';
import { Menu } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import { AuthContext } from '../context/auth';

function MenuBar() {
  const { user, logout } = useContext(AuthContext);
  const pathname = window.location.pathname;
  const [endpoint, setEndpoint] = useState("http://localhost:3001/")
  
  // useEffect(()=>{
  //   socket = socketIOClient(endpoint)
  // },[endpoint])
  const path = pathname === '/' ? 'home' : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const menuBar = user ? (
    <Menu pointing secondary size="massive" color="blue">
      <Menu.Item 
        name="home" 
        active={activeItem === 'home'}
        onClick={handleItemClick}
        as={Link} 
        to="/" />

      <Menu.Item 
        name="profile" 
        active={activeItem === 'profile'}
        onClick={handleItemClick}
        as={Link} 
        to="/profile" />
      <Menu.Item 
        name="create post" 
        active={activeItem === 'create post'}
        onClick={handleItemClick}
        as={Link} 
        to="/createpost" />
      <Menu.Menu position="right">
        <Menu.Item 
          name="logout" 
          onClick={logout} />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="blue">
      <Menu.Item
        name="home"
        active={activeItem === 'home'}
        onClick={handleItemClick}
        as={Link}
        to="/"
      />
      <Menu.Menu position="right">
        <Menu.Item
          name="login"
          active={activeItem === 'login'}
          onClick={handleItemClick}
          as={Link}
          to="/login"
        />
        <Menu.Item
          name="register"
          active={activeItem === 'register'}
          onClick={handleItemClick}
          as={Link}
          to="/register"
        />
      </Menu.Menu>
    </Menu>
  );

  return menuBar;
}

export default MenuBar;
