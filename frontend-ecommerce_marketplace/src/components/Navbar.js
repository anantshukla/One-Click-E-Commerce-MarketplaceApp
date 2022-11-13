import React, { useState, useEffect } from 'react';
import { Button } from './Button';
// import { LogoutButton } from './LogoutButton';
import { Link } from 'react-router-dom';
import './Navbar.css';
import './pages/Products.css';
import { getToken } from '../Utils/Common';
import { removeUserSession } from '../Utils/Common';
import { useHistory } from 'react-router-dom';


function Navbar(props) {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  
  const history = useHistory();

  // handle click event of logout button
  const handleLogout = () => {
    removeUserSession();
    history.push('/login');
    window.location.reload();
  }

  const showButton = () => {
    if (getToken()) {
      setButton(false);
    } else {
      setButton(true);
    }
  };


  useEffect(() => {
    showButton()
  }, []);

  window.addEventListener('resize', showButton);

  return (
    <>
      <nav className='navbar'>
        <div className='navbar-container'>
          <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
            One Click Buy
            <i class='fab fa-typo3' />
          </Link>
          <div className='menu-icon' onClick={handleClick}>
            <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
          </div>
          <ul className={click ? 'nav-menu active' : 'nav-menu'}>
            <li className='nav-item'>
              <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                Home
              </Link>
            </li>

            
            <li className='nav-item'>
              {getToken()? <p> </p> :
              <Link  to='/login' className='nav-links' onClick={closeMobileMenu} > Login </Link>}
            </li>
            <li className='nav-item'>
              <Link
                to='/products'
                className='nav-links'
                onClick={closeMobileMenu}
              >
                Products
              </Link>
            </li>

            <li>
              <Link
                to='/sign-up'
                className='nav-links-mobile'
                onClick={closeMobileMenu}
              >
                Sign Up
              </Link>
            </li>
          </ul>

          {getToken() ?
            <button className='button_logout' onClick={handleLogout} value="Logout" > LOG OUT </button>
            : (button && <Button buttonStyle='btn--outline'>SIGN UP</Button> )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
