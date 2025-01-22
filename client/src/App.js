import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import LoginForm from './components/LoginForm';
import SingUp from './components/SingUp';
import Home from './components/Home';
import Products from './components/Products';
import ProductItemDetails from './components/ProductItemDetails';
import AdminAddProduct from './components/AdminAddProduct';
import Cart from './components/Cart';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import CartContext from './context/CartContext';
import Checkout from './components/Checkout';

import './App.css';

const App = () => {
  const [cartList, setCartList] = useState([]);
  const [IsAuthenticated, setIsAuthenticated] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = Cookies.get('jwt_token');
      
  
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
         
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          console.error(`Error fetching user role: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };
  
    fetchUserRole();
  }, [navigate]);
  

  const removeAllCartItems = () => setCartList([]);

  const incrementCartItemQuantity = (id) => {
    setCartList((prevCartList) =>
      prevCartList.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decrementCartItemQuantity = (id) => {
    setCartList((prevCartList) => {
      const product = prevCartList.find((item) => item.id === id);
      if (product && product.quantity > 1) {
        return prevCartList.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        return prevCartList.filter((item) => item.id !== id);
      }
    });
  };

  const removeCartItem = (id) => {
    setCartList((prevCartList) =>
      prevCartList.filter((item) => item.id !== id)
    );
  };

  const addCartItem = (product) => {
    setCartList((prevCartList) => {
      const existingProduct = prevCartList.find((item) => item.id === product.id);

      if (existingProduct) {
        return prevCartList.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      } else {
        return [...prevCartList, product];
      }
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartList,
        IsAuthenticated,
        addCartItem,
        removeCartItem,
        incrementCartItemQuantity,
        decrementCartItemQuantity,
        removeAllCartItems,
      }}
    >
      <Routes>
        <Route path="/singup" element={<SingUp />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><AdminAddProduct /></ProtectedRoute>} />
        <Route
          path="/products/:id"
          element={<ProtectedRoute><ProductItemDetails /></ProtectedRoute>}
        />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/check-out" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" />} />
      </Routes>
    </CartContext.Provider>
  );
};

export default App;
