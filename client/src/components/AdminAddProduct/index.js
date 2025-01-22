import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Cookies from 'js-cookie'; // Import js-cookie to access cookies

const AdminAddProduct = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    title: '',
    brand: '',
    price: '',
    image_url: '',
    rating: '',
    category: '',
    description: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const jwtToken = Cookies.get('jwt_token');
    const options = {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/products`, options);

      if (response.ok) {
        alert('Product added successfully');
        setProductData({
          title: '',
          brand: '',
          price: '',
          image_url: '',
          rating: '',
          category: '',
          description: '',
        }); // Reset the form after successful submission
        navigate('/admin'); // Redirect to the admin products page
      } else {
        const errorData = await response.json();
        console.error('Error response data:', errorData);
        alert(`Error adding product: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      // Handle errors from the fetch operation
      console.error('Network error:', error);
      alert('A network error occurred. Please try again later.');
    }
  };

  return (
    <>
      <Header />
      <div
        className="admin-add-product"
        style={{
          width: '400px',
          margin: '50px auto 100px',
          padding: '20px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
        }}
      >
         <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
        className="login-website-logo-mobile-img"
        alt="website logo"
      />
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-login-img.png"
        className="login-img"
        alt="website login"
      />
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Add New Product</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter product title"
              value={productData.title}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="brand">Brand</label>
            <input
              type="text"
              id="brand"
              name="brand"
              placeholder="Enter product brand"
              value={productData.brand}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="price">Price</label>
            <input
              type="number"
              id="price"
              name="price"
              placeholder="Enter product price"
              value={productData.price}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image_url">Image URL</label>
            <input
              type="url"
              id="image_url"
              name="image_url"
              placeholder="Enter image URL"
              value={productData.image_url}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="rating">Rating</label>
            <input
              type="number"
              id="rating"
              name="rating"
              placeholder="Enter product rating"
              value={productData.rating}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              id="category"
              name="category"
              placeholder="Enter product category"
              value={productData.category}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              placeholder="Enter product description"
              value={productData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="button primary"
            style={{
              display: 'block',
              width: '100%',
              padding: '10px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Add Product
          </button>
        </form>
      </div>
    </>
  );
};

export default AdminAddProduct;
