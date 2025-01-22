import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Cookies from 'js-cookie';
import { BsPlusSquare, BsDashSquare } from 'react-icons/bs';
import { Bars } from 'react-loader-spinner';
import CartContext from '../../context/CartContext';
import Header from '../Header';
import SimilarProductItem from '../SimilarProductItem';
import './index.css';
const ProductItemDetails = () => {
  const [productData, setProductData] = useState(null);
  const [similarProductsData, setSimilarProductsData] = useState([]);
  const [apiStatus, setApiStatus] = useState('INITIAL');
  const [quantity, setQuantity] = useState(1);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const { IsAuthenticated } = useContext(CartContext); // Access IsAuthenticated from CartContext
  const { id } = useParams();
  const navigate = useNavigate();
  const fetchProductData = useCallback(async () => {
   
    setApiStatus('IN_PROGRESS');
    try {
      const jwtToken = Cookies.get('jwt_token');
      if (!jwtToken) throw new Error('User is not authenticated');

      const productApiUrl = `${process.env.REACT_APP_API_URL}/api/products/${id}`;
      const options = {
        headers: { Authorization: `Bearer ${jwtToken}` },
        method: 'GET',
      };

      const response = await fetch(productApiUrl, options);
      if (!response.ok) throw new Error('Failed to fetch product data');

      const data = await response.json();
      setProductData({
        id: data.id,
        title: data.title,
        brand: data.brand,
        price: data.price,
        rating: data.rating,
        description: data.description,
        imageUrl: data.image_url,
        availability: data.availability,
        totalReviews: data.total_reviews,
        category: data.category,
      });

      const similarApiUrl = `${process.env.REACT_APP_API_URL}/api/products?category=${data.category}`;
      const similarResponse = await fetch(similarApiUrl, options);
      const similarData = await similarResponse.json();

      setSimilarProductsData(similarData.products);
      setApiStatus('SUCCESS');
    } catch (error) {
      console.error(error.message);
      setApiStatus('FAILURE');
    }
  }, [id]);

  useEffect(() => {
    fetchProductData();
  }, [fetchProductData]);

  const handleDeleteProduct = async (productId) => {
    const jwtToken = Cookies.get('jwt_token');
    const apiUrl = `${process.env.REACT_APP_API_URL}/api/products/${productId}`;
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'DELETE',
    };
    const response = await fetch(apiUrl, options);
    if (response.ok) {
      navigate('/products');
      // On success, fetch the products again to update the list

    } else {
      console.error('Failed to delete product');
    }
  };

  const handleAddToCart = (addCartItem) => {
    addCartItem({ ...productData, quantity });
    setIsAddedToCart(true);

    setTimeout(() => setIsAddedToCart(false), 3000);
  };

  const onIncrementQuantity = () => setQuantity(prevQuantity => prevQuantity + 1);
  const onDecrementQuantity = () => setQuantity(prevQuantity => Math.max(1, prevQuantity - 1));




  if (apiStatus === 'IN_PROGRESS') {
    return (
      <div className="products-details-loader-container">
        <Bars height="80" width="80" color="#4fa94d" ariaLabel="loading" />
      </div>
    );
  }

  if (apiStatus === 'FAILURE') {
    return (
      <div className="product-details-error-view-container">
        <p>Failed to fetch product details.</p>
      </div>
    );
  }

  const handleUpdateClick = () => setIsEditing(true);


  const handleSaveClick = async () => {
    try {
      const jwtToken = Cookies.get('jwt_token');
      const updateApiUrl = `${process.env.REACT_APP_API_URL}/api/products/${id}`;
      const options = {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      };
      const response = await fetch(updateApiUrl, options);
      if (response.ok) {
        alert('Product updated successfully!');
        setIsEditing(false);
        fetchProductData(); // Refresh the product details
      } else {
        throw new Error('Failed to update product');
      }
    } catch (error) {
      console.error(error.message);
      alert('Error updating product');
    }
  };




  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedData((prevData) => ({ ...prevData, [name]: value }));
  };


  return (
    <>
      <Header />
      <div className="product-item-details-container">
        {productData && (
          <CartContext.Consumer>
            {({ addCartItem }) => (
              <div className="product-details-success-view">
                <div className="product-details-container">
                  <img src={productData.imageUrl} alt="product" className="product-image" />
                  <div className="product">
                    {isEditing ? (
                      <div className="edit-template">
                        <h2 className="edit-product-header">Update Product Details</h2>

                        <div className="edit-form-container">
                          <p className="form-field">
                            <strong>Title:</strong>
                            <input
                              type="text"
                              name="title"
                              value={updatedData.title}
                              onChange={handleInputChange}
                              className="edit-input"
                              placeholder="Enter product title"
                            />
                          </p>
                          <p className="form-field">
                            <strong>Description:</strong>
                            <input
                              type="text"
                              name="description"
                              value={updatedData.description}
                              onChange={handleInputChange}
                              className="edit-input"
                              placeholder="Enter product description"
                            />
                          </p>
                          <p className="form-field">
                            <strong>Price:</strong>
                            <input
                              type="number"
                              name="price"
                              value={updatedData.price}
                              onChange={handleInputChange}
                              className="edit-input"
                              placeholder="Enter price"
                            />
                          </p>

                          <div className="edit-buttons">
                            <button onClick={handleSaveClick} className="save-button">
                              Save
                            </button>
                            <button onClick={() => setIsEditing(false)} className="cancel-button">
                              Cancel
                            </button>
                          </div>
                        </div>
                      </div>

                    ) : (<>
                      <h1 className="product-name">{productData.title}</h1>
                      <p className="price-details">Rs {productData.price}/-</p>

                      <div className="rating-and-reviews-count">
                        <div className="rating-container">
                          <p className="rating">{productData.rating}</p>
                          <img
                            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                            alt="product rating star"
                            className="star"
                          />
                        </div>
                        <p className="reviews-count">{productData.totalReviews} Reviews</p>
                      </div>

                      <p className="product-description">{productData.description}</p>

                      <div className="label-value-container">
                        <p className="label">Available:</p>
                        <p className="value">In Stock</p>
                      </div>

                      <div className="label-value-container">
                        <p className="label">Brand:</p>
                        <p className="value">{productData.brand}</p>
                      </div>
                    </>
                    )}
                    <hr className="horizontal-line" />
                    {!IsAuthenticated && (
                      <>
                        <div className="quantity-container">
                          <button
                            type="button"
                            className="quantity-controller-button"
                            onClick={onDecrementQuantity}
                            data-testid="minus"
                          >
                            <BsDashSquare className="quantity-controller-icon" />
                          </button>
                          <p className="quantity">{quantity}</p>
                          <button
                            type="button"
                            className="quantity-controller-button"
                            onClick={onIncrementQuantity}
                            data-testid="plus"
                          >
                            <BsPlusSquare className="quantity-controller-icon" />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="button add-to-cart-btn"
                          onClick={() => handleAddToCart(addCartItem)}
                        >
                          {isAddedToCart ? 'ADDED TO CART' : 'ADD TO CART'}
                        </button>
                      </>
                    )}
                    {IsAuthenticated && (
                      <>


                        <div className="quantity-container">
                          <button
                            type="button"
                            className="quantity-controller-button"
                            onClick={onDecrementQuantity}
                            data-testid="minus"
                          >
                            <BsDashSquare className="quantity-controller-icon" />
                          </button>
                          <p className="quantity">{quantity}</p>
                          <button
                            type="button"
                            className="quantity-controller-button"
                            onClick={onIncrementQuantity}
                            data-testid="plus"
                          >
                            <BsPlusSquare className="quantity-controller-icon" />
                          </button>
                        </div>
                        <button
                          type="button"
                          className="button add-to-cart-btn"
                          onClick={() => handleAddToCart(addCartItem)}
                        >
                          {isAddedToCart ? 'ADDED TO CART' : 'ADD TO CART'}
                        </button>



                        <button
                          type="button"
                          className="btn btn-success update-btn update-button mb-4 me-5 shadow-lg border-0 custom-button"
                          onClick={handleUpdateClick}
                        >
                          UPDATE
                        </button>
                        <button
                          type="button"
                          className="btn btn-danger delete-btn mb-4 shadow-lg border-0 custom-button"
                          onClick={() => handleDeleteProduct(productData.id)} // Wrap the function in an anonymous function
                        >
                          DELETE
                        </button>

                      </>

                    )}
                  </div>
                </div>
                <h1 className="similar-products-heading">Similar Products</h1>
                <ul className="similar-products-list">
                  {similarProductsData.map(eachSimilarProduct => (
                    <SimilarProductItem
                      productDetails={eachSimilarProduct}
                      key={eachSimilarProduct.id}
                    />
                  ))}
                </ul>
              </div>
            )}
          </CartContext.Consumer>
        )}
      </div>
    </>
  );
};

export default ProductItemDetails;
