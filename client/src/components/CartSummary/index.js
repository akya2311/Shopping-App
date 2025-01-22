import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../../context/CartContext';
import './index.css';

const CartSummary = () => {
  const navigate = useNavigate();
  const { cartList } = useContext(CartContext); // Use useContext instead of CartContext.Consumer
  
  let total = 0;
  cartList.forEach(eachCartItem => {
    total += eachCartItem.price * eachCartItem.quantity;
  });

  const handleCheckout = () => {
    // You can perform any additional actions here, such as saving the cart data or processing the order
    navigate('/check-out'); // Navigate to the checkout page
  };

  return (
    <>
      <div className="cart-summary-container">
        <h1 className="order-total-value">
          <span className="order-total-label">Order Total:</span> Rs {total} /-
        </h1>
        <p className="total-items">{cartList.length} Items in cart</p>
        
        <button
          type="button"
          className="checkout-button d-sm-none"
          onClick={handleCheckout} // Add onClick handler here
        >
          Checkout
        </button>
      </div>

      <button
        type="button"
        className="checkout-button d-lg-none"
        onClick={handleCheckout} // Add onClick handler here
      >
        Checkout
      </button>
    </>
  );
};

export default CartSummary;
