/* eslint-disable */
import React from 'react';
import { Link } from 'react-router-dom';
import './Navigation.css';

function Navigation() {
  return (
    <div className="nav-bar">
      <div className="left"><Link to="/myport">logo</Link></div>
      <div className="center">
        <Link to="/myport">my포폴</Link>
        <Link to="/board" style={{ marginLeft: '20px' }}>Board</Link>
      </div>
      <Link to = "/signup" className="right">
        로그아웃
      </Link>
    </div>
  );
}

export default Navigation;
