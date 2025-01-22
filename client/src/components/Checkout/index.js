import React, { useContext, useState } from 'react';
import CartContext from '../../context/CartContext';
import './index.css';
import Header from '../Header';

const Checkout = () => {
  const { cartList } = useContext(CartContext);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  
  let total = 0;
  cartList.forEach(eachCartItem => {
    total += eachCartItem.price * eachCartItem.quantity;
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('Order placed successfully!');
  };

  return (
    <div className="checkout-container">
         <Header />
      <h1 className="checkout-header">Checkout</h1>
      
      {/* Cart summary */}
      <div className="cart-summary">
        <h2 className="order-summary-title">Order Summary</h2>
        <ul className="cart-items">
          {cartList.map((item, index) => (
            <li key={index} className="cart-item">
              {item.title} - Rs {item.price} x {item.quantity}
            </li>
          ))}
        </ul>
        <h3 className="total-price">
          Total: Rs {total} /-
        </h3>
      </div>

      {/* Shipping address */}
      <form onSubmit={handleSubmit} className="checkout-form">
        <div className="form-group">
          <label htmlFor="shippingAddress">Shipping Address</label>
          <textarea
            id="shippingAddress"
            name="shippingAddress"
            placeholder="Enter your shipping address"
            value={shippingAddress}
            onChange={(e) => setShippingAddress(e.target.value)}
            required
          />
        </div>

        {/* Payment method selection */}
        <div className="form-group">
          <label htmlFor="paymentMethod">Payment Method</label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
          >
            <option value="">Select a payment method</option>
            <option value="credit_card">Credit Card</option>
            <option value="paypal">PayPal</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>

        {/* Submit order */}
        <button type="submit" className="submit-button">
          Place Order
        </button>
      </form>
    </div>
  );
};

export default Checkout;
