import React from 'react';
import { NavLink } from 'react-router-dom';

export default function () {
  return (
    <div className='NavBar'>
      <h2>Figure Search Engine</h2>

      <span>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/profile'>Profile</NavLink>
      </span>
    </div>
  );
}
