import { useState } from 'react';
import Cookies from 'js-cookie';
import { Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './index.css';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showSubmitError, setShowSubmitError] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const jwtToken = Cookies.get('jwt_token');
  const navigate = useNavigate();

  const onSubmitSuccess = (jwtToken) => {
    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
    });
    navigate('/');
  };

  const onSubmitFailure = (errorMsg) => {
    setShowSubmitError(true);
    setErrorMsg(errorMsg);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = `${process.env.REACT_APP_API_URL}/api/auth/login`;
      const response = await axios.post(apiUrl, { email, password });
      const jwtToken = response.data.token;
      if (response.status === 200) {
        onSubmitSuccess(jwtToken);
      } else {
        onSubmitFailure(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setShowSubmitError(true);
      setErrorMsg(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleCreateAccount = () => {
    navigate('/singup'); // Navigate to the signup page
  };

  const renderPasswordField = () => (
    <>
      <label className="input-label" htmlFor="password">
        PASSWORD
      </label>
      <input
        type="password"
        id="password"
        className="password-input-field"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
    </>
  );

  const renderEmailField = () => (
    <>
      <label className="input-label" htmlFor="email">
        EMAIL
      </label>
      <input
        type="email"
        id="email"
        className="password-input-field"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
    </>
  );

  if (jwtToken) {
    return <Navigate to="/" />; // Redirect to home if already logged in
  }

  return (
    <div className="login-form-container">
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
      <form className="form-container" onSubmit={handleSubmit}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-logo-img.png"
          className="login-website-logo-desktop-img"
          alt="website logo"
        />
        <div className="input-container">{renderEmailField()}</div>
        <div className="input-container">{renderPasswordField()}</div>
        <button type="submit" className="login-button">
          Login
        </button>
        {showSubmitError && <p className="error-message">{errorMsg}</p>}
        <button className="button secondary" type="button" onClick={handleCreateAccount}>
          Create Account
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
