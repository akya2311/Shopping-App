import { useState, useEffect } from 'react';
import Cookies from 'js-cookie'; // Import js-cookie for cookie management
import { Bars } from 'react-loader-spinner'; // Import Bars loader
import ProductCard from '../ProductCard';
import './index.css';

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
};

const PrimeDealsSection = () => {
  const [primeDeals, setPrimeDeals] = useState([]);
  const [apiStatus, setApiStatus] = useState(apiStatusConstants.initial);

  useEffect(() => {
    getPrimeDeals();
  }, []);

  const getPrimeDeals = async () => {
    setApiStatus(apiStatusConstants.inProgress);

    const apiUrl = `${process.env.REACT_APP_API_URL}/api/prime_deals`;
    const token = Cookies.get('jwt_token'); // Retrieve JWT token from cookies

    if (!token) {
      console.error('JWT token is missing. Please log in again.');
      setApiStatus(apiStatusConstants.failure);
      return;
    }

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    };

    try {
      const response = await fetch(apiUrl, options);
      
      if (response.ok) {
        const fetchedData = await response.json();
        
        const updatedData = fetchedData.map(product => ({
          title: product.title,
          brand: product.brand,
          price: product.price,
          id: product.id,
          imageUrl: product.image_url,
          rating: product.rating,
        }));
       
        setPrimeDeals(updatedData);
        setApiStatus(apiStatusConstants.success);
      } else {
        console.error(`Failed to fetch prime deals. Status code: ${response.status}`);
        setApiStatus(apiStatusConstants.failure);
      }
    } catch (error) {
      console.error('Error fetching prime deals:', error.message);
      setApiStatus(apiStatusConstants.failure);
    }
  };

  const renderPrimeDealsListView = () => (
    <div>
      <h1 className="primedeals-list-heading">Exclusive Prime Deals</h1>
      <ul className="products-list">
        {primeDeals.map(product => (
          <ProductCard productData={product} key={product.id} />
        ))}
      </ul>
    </div>
  );

  const renderPrimeDealsFailureView = () => (
    <div className="primedeals-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/exclusive-deals-banner-img.png"
        alt="Register for exclusive prime deals"
        className="register-prime-img"
        onError={(e) => {
          e.target.onerror = null; // Prevent infinite loop if fallback fails
          e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Available"; // Fallback image
        }}
      />

    </div>
  );

  const renderLoadingView = () => (
    <div className="primedeals-loader-container">
      <Bars color="#0b69ff" height={50} width={50} /> {/* Use Bars loader here */}
    </div>
  );

  const renderView = () => {
    switch (apiStatus) {
      case apiStatusConstants.success:
        return renderPrimeDealsListView();
      case apiStatusConstants.failure:
        return renderPrimeDealsFailureView();
      case apiStatusConstants.inProgress:
        return renderLoadingView();
      default:
        return null;
    }
  };

  return <div className="prime-deals-section">{renderView()}</div>;
};

export default PrimeDealsSection;
