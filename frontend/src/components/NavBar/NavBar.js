import React from 'react';
import { Link } from 'react-router-dom';

export default function () {
  return (
    <div className='NavBar'>
      <h2>Figure Search Engine</h2>

      <span>
        <Link to='/'>Home</Link>
        <Link to='/profile'>Profile</Link>
      </span>
    </div>
  );
}
