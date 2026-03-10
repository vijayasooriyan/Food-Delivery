import React, { useContext, useRef, useEffect, useCallback } from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'
import { useState } from 'react'
import {Link, useNavigate, useLocation} from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'


const Navbar = ({setShowLogin}) => {

    const [menu,setMenu] = useState("home");
    const [showSearch, setShowSearch] = useState(false);
    const [localQuery, setLocalQuery] = useState("");
    const {getTotalCartAmount,token,setToken,searchQuery,setSearchQuery,food_list,url,darkMode,toggleDarkMode} = useContext(StoreContext);
    const searchInputRef = useRef(null);
    const searchContainerRef = useRef(null);

    const navigate = useNavigate();
    const location = useLocation();

    const logout = () => {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
    }

    // Close search on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
                setShowSearch(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Debounce: update global searchQuery from localQuery
    useEffect(() => {
        const timer = setTimeout(() => setSearchQuery(localQuery), 250);
        return () => clearTimeout(timer);
    }, [localQuery, setSearchQuery]);

    // Sync localQuery if searchQuery cleared externally
    useEffect(() => {
        if (!searchQuery && localQuery) setLocalQuery("");
    }, [searchQuery]);

    const suggestions = localQuery.trim()
        ? food_list.filter(item =>
            item.name.toLowerCase().includes(localQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(localQuery.toLowerCase())
          ).slice(0, 6)
        : [];

    const openSearch = () => {
        setShowSearch(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
    };

    const closeSearch = () => {
        setShowSearch(false);
        setLocalQuery("");
        setSearchQuery("");
    };

    const scrollToResults = useCallback(() => {
        setTimeout(() => {
            document.getElementById('food-display')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    }, []);

    const handleSearchSubmit = () => {
        if (!localQuery.trim()) return;
        setSearchQuery(localQuery);
        setShowSearch(false);
        if (location.pathname !== '/') {
            navigate('/');
        }
        scrollToResults();
    };

    const handleSuggestionClick = (itemName) => {
        setLocalQuery(itemName);
        setSearchQuery(itemName);
        setShowSearch(false);
        if (location.pathname !== '/') {
            navigate('/');
        }
        scrollToResults();
    };

  return (
    <div className='navbar'>

     <Link to='/'><img src={assets.logo} alt="" className="logo" /></Link>

       
       <ul className="navbar-menu">
        <Link to='/' onClick={()=>setMenu("home")} className={menu==="home"?"active":""}>Home</Link>
        <a href='#explore-menu' onClick={()=>setMenu("menu")} className={menu==="menu"?"active":""}>Menu</a>
        <a href='#app-download' onClick={()=>setMenu("mobile-app")} className={menu==="mobile-app"?"active":""}>Mobile-app</a>
        <a href='#footer' onClick={()=>setMenu("contact-us")} className={menu==="contact-us"?"active":""}>Contact us</a>
       </ul>
       <div className="navbar-right">
          <div className="navbar-search" ref={searchContainerRef}>
            <img src={assets.search_icon} alt="" onClick={() => showSearch ? closeSearch() : openSearch()} />
            {showSearch && (
              <div className="search-bar">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search food..."
                  value={localQuery}
                  onChange={(e) => setLocalQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') closeSearch();
                    if (e.key === 'Enter') handleSearchSubmit();
                  }}
                />
                {localQuery && (
                  <span className="search-clear" onClick={() => { setLocalQuery(''); setSearchQuery(''); searchInputRef.current?.focus(); }}>&times;</span>
                )}
                {suggestions.length > 0 && (
                  <div className="search-dropdown">
                    {suggestions.map((item) => (
                      <div key={item._id} className="search-dropdown-item" onClick={() => handleSuggestionClick(item.name)}>
                        <img src={url + "/images/" + item.image} alt="" />
                        <div className="search-dropdown-text">
                          <p className="search-item-name">{item.name}</p>
                          <p className="search-item-meta">{item.category} &middot; ${item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          <button className="theme-toggle" onClick={toggleDarkMode} title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <div className="navbar-search-icon">
            <Link to='/cart'><img src={assets.basket_icon} alt="" /></Link>
            
            <div className={getTotalCartAmount()===0 ? "" :"dot"}></div>
          </div>


          {!token?<button onClick={()=>setShowLogin(true)}>Sign In</button>
           : <div className="navbar-profile">
                <img src={assets.profile_icon} alt="" />
                <ul className='nav-profile-dropdown'>
                      <li onClick={()=>navigate('/myorders')}><img src={assets.bag_icon} alt="" /><p>Orders</p></li>
                      <hr />
                      <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>
                </ul>
           </div>
             }


          
       </div>
    </div>
  )
}

export default Navbar
