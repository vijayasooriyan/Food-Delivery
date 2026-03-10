import React, { useState, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'


const Navbar = () => {

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('adminDarkMode') === 'true';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('adminDarkMode', darkMode);
  }, [darkMode]);

  return (
    <div className='navbar'>
        <img className='logo' src={assets.logo} alt='' />
        <div className='navbar-right-admin'>
          <button className='theme-toggle' onClick={() => setDarkMode(prev => !prev)} title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            {darkMode ? '\u2600\ufe0f' : '\ud83c\udf19'}
          </button>
          <img className='profile' src={assets.profile_image} alt='' />
        </div>
    </div>
  )
}

export default Navbar
