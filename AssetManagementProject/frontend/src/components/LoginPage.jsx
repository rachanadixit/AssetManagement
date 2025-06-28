import React, { useState } from 'react';

// The LoginPage component handles user authentication.
const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Handles the form submission for login
  const handleLogin = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    // Hardcoded credentials for a single login
    const predefinedUsername = 'admin';
    const predefinedPassword = 'admin@123';

    // Basic validation
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }

    // Check credentials
    if (username === predefinedUsername && password === predefinedPassword) {
      setError(''); // Clear any previous errors
      onLoginSuccess(); // Call the success callback passed from App.jsx
    } else {
      setError('Invalid username or password.'); // Set error message for incorrect credentials
    }
  };

  return (
    <>
      {/* Plain CSS for the login page */}
      <style>
        {`
        body {
            margin: 0;
            padding: 0;
            overflow-x: hidden; /* Prevent horizontal scroll */
            font-family: 'Inter', sans-serif; /* Ensure Inter font is used */
        }

        .login-container {
          min-height: 100vh;
          width: 100vw; /* Ensure it takes full viewport width */
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #1a202c; /* Equivalent to bg-gray-900 */
          padding: 1rem; /* Equivalent to p-4 */
          box-sizing: border-box; /* Include padding in width */
        }

        .login-box {
          background-color: #2d3748; /* Equivalent to bg-gray-800 */
          padding: 2rem; /* Equivalent to p-8 */
          border-radius: 0.5rem; /* Equivalent to rounded-lg */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* Equivalent to shadow-xl */
          width: 100%;
          max-width: 28rem; /* Equivalent to max-w-md */
          border: 1px solid #4a5568; /* Equivalent to border border-gray-700 */
          box-sizing: border-box; /* Include padding and border in the element's total width and height */
        }

        .login-title {
          font-size: 2.25rem; /* Equivalent to text-3xl */
          font-weight: 700; /* Equivalent to font-bold */
          text-align: center;
          color: #fff; /* White text for the title */
          margin-bottom: 2rem; /* Equivalent to mb-8 */
        }

        .form-group {
          margin-bottom: 1.5rem; /* Equivalent to space-y-6 */
        }

        .form-label {
          display: block;
          color: #cbd5e0; /* Equivalent to text-gray-300 */
          font-size: 0.875rem; /* Equivalent to text-sm */
          font-weight: 600; /* Equivalent to font-semibold */
          margin-bottom: 0.5rem; /* Equivalent to mb-2 */
        }

        .form-input {
          width: 100%; /* Ensure input takes full width of its parent */
          padding: 0.75rem 1rem; /* Adjusted padding for better visual size */
          background-color: #4a5568; /* Equivalent to bg-gray-700 */
          color: #fff; /* Equivalent to text-white */
          border-radius: 0.375rem; /* Equivalent to rounded-md */
          border: 1px solid #667eea; /* Equivalent to border border-gray-600 */
          outline: none;
          box-sizing: border-box; /* Ensures padding and border are included in the element's total width and height */
        }

        .form-input:focus {
          border-color: #3182ce; /* Equivalent to focus:ring-blue-500 */
          box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.5); /* Equivalent to focus:ring-2 focus:ring-blue-500 */
        }

        .error-message {
          color: #fc8181; /* Equivalent to text-red-400 */
          font-size: 0.875rem; /* Equivalent to text-sm */
          text-align: center;
          margin-bottom: 1rem;
        }

        .login-button {
          width: 100%;
          background-color: #3182ce; /* Equivalent to bg-blue-600 */
          color: #fff; /* Equivalent to text-white */
          font-weight: 700; /* Equivalent to font-bold */
          padding: 0.75rem 1rem; /* Equivalent to py-3 px-4 */
          border-radius: 0.375rem; /* Equivalent to rounded-md */
          outline: none;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
        }

        .login-button:hover {
          background-color: #2b6cb0; /* Equivalent to hover:bg-blue-700 */
          transform: scale(1.02); /* Equivalent to hover:scale-105 */
        }

        .footer-text {
          color: #a0aec0; /* Equivalent to text-gray-400 */
          font-size: 0.875rem; /* Equivalent to text-sm */
          text-align: center;
          margin-top: 1.5rem; /* Equivalent to mt-6 */
        }
        `}
      </style>

      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">AssetFlow Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="form-input"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(''); // Clear error on input change
                }}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(''); // Clear error on input change
                }}
                required
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <button
              type="submit"
              className="login-button"
            >
              Login
            </button>
          </form>
          <p className="footer-text">
            &copy; 2025 AssetFlow. All rights reserved.
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
