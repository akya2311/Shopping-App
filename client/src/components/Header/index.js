import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import CartContext from '../../context/CartContext';

import './index.css';

const Header = () => {
  const navigate = useNavigate();
  const { cartList, IsAuthenticated } = useContext(CartContext); 

 
  const onClickLogout = () => {
    Cookies.remove('jwt_token');
    navigate('/login');
  };

  return (
    <nav className="nav-header">
      <div className="nav-content">
        {/* Mobile View Logo and Logout */}
        <div className="nav-bar-mobile-logo-container">
          <Link to="/">
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
              alt="website logo"
            />
          </Link>
          <button
            type="button"
            className="nav-mobile-btn"
            onClick={onClickLogout}
            aria-label="Logout"
          >
            <img
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-log-out-img.png"
              alt="Logout"
              className="nav-bar-img"
            />
          </button>
        </div>

        {/* Desktop View Navigation */}
        <div className="nav-bar-large-container">
          <Link to="/">
            <img
              className="website-logo"
              src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
              alt="website logo"
            />
          </Link>
          <ul className="nav-menu">
            <li className="nav-menu-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link to="/products" className="nav-link">
                Products
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link to="/cart" className="nav-link">
                Cart
                {cartList.length > 0 && (
                  <span className="cart-count-badge">{cartList.length}</span>
                )}
              </Link>
            </li>
            {/* Admin Section */}
            {IsAuthenticated && (
              <li className="nav-menu-item">
                <Link to="/admin" className="nav-link">
                  Admin
                </Link>
              </li>
            )}
          </ul>
          <button
            type="button"
            className="logout-desktop-btn"
            onClick={onClickLogout}
            aria-label="Logout"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className="nav-menu-mobile">
        <ul className="nav-menu-list-mobile">
          <li className="nav-menu-item-mobile">
            <Link to="/" className="nav-link">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-home-icon.png"
                alt="Navigate to home"
                className="nav-bar-img"
              />
            </Link>
          </li>
          <li className="nav-menu-item-mobile">
            <Link to="/products" className="nav-link">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-products-icon.png"
                alt="Navigate to products"
                className="nav-bar-img"
              />
            </Link>
          </li>
          <li className="nav-menu-item-mobile">
            <Link to="/cart" className="nav-link">
              <img
                src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-cart-icon.png"
                alt="Navigate to cart"
                className="nav-bar-img"
              />
              {cartList.length > 0 && (
                <span className="cart-count-badge">{cartList.length}</span>
              )}
            </Link>
          </li>
          {/* Admin Section in Mobile View */}
          {IsAuthenticated && (
            <li className="nav-menu-item-mobile">
              <Link to="/admin" className="nav-link">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-admin-icon.png"
                  alt="Navigate to admin"
                  className="nav-bar-img"
                />
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Header;
