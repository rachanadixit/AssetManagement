import React, { useState, useEffect, useMemo } from 'react';
// Recharts components imports are now expected to work after npm install
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

// Inlined LoginPage component
const LoginPage = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    // Hardcoded credentials for a single login
    const predefinedUsername = 'admin';
    const predefinedPassword = 'Haier@123';

    if (username === predefinedUsername && password === predefinedPassword) {
      onLoginSuccess();
    } else {
      setErrorMessage('Invalid username or password.');
    }
  };

  return (
    <>
      <style>
        {`
        body {
            margin: 0;
            padding: 0;
            overflow-x: hidden; /* Prevent horizontal scroll */
            font-family: 'Inter', sans-serif;
            height: 100%; /* Ensure body takes full height */
            width: 100%; /* Ensure body takes full width */
        }
        html {
            height: 100%; /* Ensure html takes full height */
            width: 100%; /* Ensure html takes full width */
        }
        #root { /* If your React app is mounted to a #root div, ensure it also takes full height and width */
            height: 100%;
            width: 100%;
        }

        .login-container {
          min-height: 100vh; /* Full viewport height */
          width: 100vw;    /* Full viewport width */
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #1a202c;
          padding: 1rem;
          box-sizing: border-box;
        }

        .login-box {
          background-color: #2d3748;
          padding: 2rem;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          width: 100%;
          max-width: 28rem;
          border: 1px solid #4a5568;
          box-sizing: border-box;
        }

        .login-title {
          font-size: 2.25rem;
          font-weight: 700;
          text-align: center;
          color: #fff;
          margin-bottom: 2rem;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          color: #cbd5e0;
          font-size: 0.875rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .form-input {
          width: 90%;
          padding: 0.5rem 1rem;
          background-color: #4a5568;
          color: #fff;
          border-radius: 0.375rem;
          border: 1px solid #667eea;
          outline: none;
        }

        .form-input:focus {
          border-color: #3182ce;
          box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.5);
        }

        .error-message {
          color: #fc8181;
          font-size: 0.875rem;
          text-align: center;
          margin-bottom: 1rem;
        }

        .login-button {
          width: 100%;
          background-color: #3182ce;
          color: #fff;
          font-weight: 700;
          padding: 0.75rem 1rem;
          border-radius: 0.375rem;
          outline: none;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease-in-out, transform 0.3s ease-in-out;
        }

        .login-button:hover {
          background-color: #2b6cb0;
          transform: scale(1.02);
        }

        .footer-text {
          color: #a0aec0;
          font-size: 0.875rem;
          text-align: center;
          margin-top: 1.5rem;
        }
        `}
      </style>
      <div className="login-container">
        <div className="login-box">
          <h2 className="login-title">AssetFlow Login</h2>
          <form onSubmit={handleSubmit}>
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
                  setErrorMessage('');
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
                  setErrorMessage('');
                }}
                required
              />
            </div>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
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

// Inlined AssetForm component
function AssetForm({ onSave, onCancel, initialData = {} }) {
  const [formData, setFormData] = useState({
    asset_code: '',
    serial_number: '',
    capital_date: '',
    year: '',
    asset_type: '',
    asset_description: '',
    make: '',
    model: '',
    status: 'Active',
    department: '',
    division: '',
    plant_code: '',
    warranty_status: 'In Warranty',
    expiry_date: '',
    category_name: '',
    location_name: '',
    user_id: '',
  });

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const backendUrl = 'http://localhost:5000';

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const usersRes = await fetch(`${backendUrl}/api/users`);
        if (!usersRes.ok) throw new Error(`HTTP error! Users status: ${usersRes.status}`);
        const usersData = await usersRes.json();
        setUsers(usersData);

        const initialFormState = {
            asset_code: '',
            serial_number: '',
            capital_date: '',
            year: '',
            asset_type: '',
            asset_description: '',
            make: '',
            model: '',
            status: 'Active',
            department: '',
            division: '',
            plant_code: '',
            warranty_status: 'In Warranty',
            expiry_date: '',
            category_name: '',
            location_name: '',
            user_id: '',
            ...initialData
        };

        if (initialFormState.capital_date) {
            initialFormState.capital_date = initialFormState.capital_date.split('T')[0];
        }
        if (initialFormState.expiry_date) {
            initialFormState.expiry_date = initialFormState.expiry_date.split('T')[0];
        }

        if (initialData.id) {
            initialFormState.category_name = initialData.category_name || '';
            initialFormState.location_name = initialData.location_name || '';
        }

        setFormData(initialFormState);

      } catch (e) {
        console.error("AssetForm: Failed to fetch form dependencies (users):", e);
        setError("Failed to load users for assignment. Please check backend.");
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchDependencies();
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      const method = initialData.id ? 'PUT' : 'POST';
      const url = initialData.id ? `${backendUrl}/api/assets/${initialData.id}` : `${backendUrl}/api/assets`;

      const dataToSend = { ...formData };
      if (dataToSend.capital_date) {
        dataToSend.capital_date = dataToSend.capital_date === '' ? null : dataToSend.capital_date;
      } else {
          dataToSend.capital_date = null;
      }
      if (dataToSend.expiry_date) {
        dataToSend.expiry_date = dataToSend.expiry_date === '' ? null : dataToSend.expiry_date;
      } else {
          dataToSend.expiry_date = null;
      }

      if (dataToSend.year) {
        dataToSend.year = parseInt(dataToSend.year);
      } else {
        dataToSend.year = null;
      }

      if (dataToSend.user_id) {
        dataToSend.user_id = parseInt(dataToSend.user_id);
      } else {
        dataToSend.user_id = null;
      }

      console.log("AssetForm: Submitting data:", dataToSend);

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      console.log("AssetForm: Submission response result:", result);

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      onSave();
    } catch (e) {
      console.error("AssetForm: Failed to save asset:", e);
      setSubmitError(e.message || "An unexpected error occurred during submission.");
    }
  };

  if (loadingUsers) {
    return <div className="asset-form-loading">Loading form data...</div>;
  }

  if (error) {
    return (
      <div className="asset-form-error-container">
        <strong className="asset-form-error-strong">Error:</strong>
        <span className="asset-form-error-span"> {error}</span>
        <div className="asset-form-error-buttons">
          <button
            onClick={onCancel}
            className="asset-form-error-button"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
        .asset-form-wrapper {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 2rem;
          width: 100%;
          box-sizing: border-box;
          min-height: calc(100vh - 12rem);
        }

        .asset-form-container {
          background-color: #fff;
          padding: 2rem;
          border-radius: 0.75rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border: 1px solid #bfdbfe;
          max-width: 56rem; /* Keeps form a reasonable width */
          width: 100%;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }

        .asset-form-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 2rem;
          text-align: center;
        }

        .asset-form-error-box {
          background-color: #fee2e2;
          border: 1px solid #f87171;
          color: #b91c1c;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          position: relative;
          margin-bottom: 1rem;
        }

        .asset-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          column-gap: 2rem;
          row-gap: 1.5rem;
        }

        @media (min-width: 768px) {
          .asset-form-grid {
            grid-template-columns: 1fr 1fr;
          }
          .asset-form-actions {
            grid-column: span 2 / span 2;
          }
        }

        .form-label {
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.25rem;
        }

        .required-star {
          color: #ef4444;
        }

        .form-input, .form-select, .form-textarea {
          margin-top: 0.25rem;
          display: block;
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid #d1d5db;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          padding: 0.625rem;
          font-size: 0.875rem;
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(49, 130, 206, 0.5);
        }

        .asset-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem;
          margin-top: 2rem;
        }

        .button-cancel, .button-submit {
          font-weight: 700;
          padding: 0.625rem 1.25rem;
          border-radius: 0.5rem;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          transition: all 0.3s ease-in-out;
          transform: scale(1);
          outline: none;
          border: none;
          cursor: pointer;
        }

        .button-cancel {
          background-color: #d1d5db;
          color: #1f2937;
        }
        .button-cancel:hover {
          background-color: #9ca3af;
          transform: scale(1.05);
        }
        .button-cancel:focus {
          box-shadow: 0 0 0 2px rgba(209, 213, 219, 0.5);
        }

        .button-submit {
          background-color: #3b82f6;
          color: #fff;
        }
        .button-submit:hover {
          background-color: #2563eb;
          transform: scale(1.05);
        }
        .button-submit:focus {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
        `}
      </style>

      <div className="asset-form-wrapper">
        <div className="asset-form-container">
          <h3 className="asset-form-title">{initialData.id ? 'Edit Asset' : 'Add New Asset'}</h3>
          {submitError && (
            <div className="asset-form-error-box" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {submitError}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="asset-form-grid">
            <div className="form-field">
              <label htmlFor="asset_code" className="form-label">Asset Code <span className="required-star">*</span></label>
              <input type="text" name="asset_code" id="asset_code" value={formData.asset_code} onChange={handleChange} required className="form-input" />
            </div>
            <div className="form-field">
              <label htmlFor="serial_number" className="form-label">Serial Number <span className="required-star">*</span></label>
              <input type="text" name="serial_number" id="serial_number" value={formData.serial_number} onChange={handleChange} required className="form-input" />
            </div>
            <div className="form-field">
              <label htmlFor="capital_date" className="form-label">Capital Date</label>
              <input type="date" name="capital_date" id="capital_date" value={formData.capital_date} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-field">
              <label htmlFor="year" className="form-label">Year</label>
              <input type="number" name="year" id="year" value={formData.year} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-field">
              <label htmlFor="asset_type" className="form-label">Asset Type</label>
              <input type="text" name="asset_type" id="asset_type" value={formData.asset_type} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-field">
              <label htmlFor="asset_description" className="form-label">Asset Description</label>
              <textarea name="asset_description" id="asset_description" value={formData.asset_description} onChange={handleChange} rows="2" className="form-textarea"></textarea>
            </div>
            <div className="form-field">
              <label htmlFor="make" className="form-label">Make</label>
              <input type="text" name="make" id="make" value={formData.make} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-field">
              <label htmlFor="model" className="form-label">Model</label>
              <input type="text" name="model" id="model" value={formData.model} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-field">
              <label htmlFor="status" className="form-label">Status</label>
              <select name="status" id="status" value={formData.status} onChange={handleChange} className="form-select">
                <option value="Active">Active</option>
                <option value="In Repair">In Repair</option>
                <option value="Pending Scrap Approval">Pending Scrap Approval</option>
                <option value="Disposed">Disposed</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="department" className="form-label">Department</label>
              <input type="text" name="department" id="department" value={formData.department} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-field">
              <label htmlFor="division" className="form-label">Division</label>
              <input type="text" name="division" id="division" value={formData.division} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-field">
              <label htmlFor="plant_code" className="form-label">Plant Code</label>
              <input type="text" name="plant_code" id="plant_code" value={formData.plant_code} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-field">
              <label htmlFor="warranty_status" className="form-label">Warranty Status</label>
              <select name="warranty_status" id="warranty_status" value={formData.warranty_status} onChange={handleChange} className="form-select">
                <option value="In Warranty">In Warranty</option>
                <option value="Out of Warranty">Out of Warranty</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="expiry_date" className="form-label">Expiry Date</label>
              <input type="date" name="expiry_date" id="expiry_date" value={formData.expiry_date} onChange={handleChange} className="form-input" />
            </div>
            <div className="form-field">
              <label htmlFor="category_name" className="form-label">Category <span className="required-star">*</span></label>
              <input type="text" name="category_name" id="category_name" value={formData.category_name} onChange={handleChange} required className="form-input" placeholder="e.g., Laptop, Desktop" />
            </div>
            <div className="form-field">
              <label htmlFor="location_name" className="form-label">Location <span className="required-star">*</span></label>
              <input type="text" name="location_name" id="location_name" value={formData.location_name} onChange={handleChange} required className="form-input" placeholder="e.g., Main Office - Floor 1" />
            </div>
            <div className="form-field">
              <label htmlFor="user_id" className="form-label">Assigned User (Optional)</label>
              <select name="user_id" id="user_id" value={formData.user_id || ''} onChange={handleChange} className="form-select">
                <option value="">None</option>
                {users.map(user => (<option key={user.id} value={user.id}>{user.name} ({user.emp_id})</option>))}
              </select>
            </div>
            <div className="asset-form-actions">
              <button type="button" onClick={onCancel} className="button-cancel">Cancel</button>
              <button type="submit" className="button-submit">{initialData.id ? 'Update Asset' : 'Add Asset'}</button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// Inlined AssetsPage component
function AssetsPage({ setAssetLoadError }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [assetToEdit, setAssetToEdit] = useState(null);

  const backendUrl = 'http://localhost:5000';

  const fetchAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUrl}/api/assets`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAssets(data);
    } catch (e) {
      console.error("Failed to fetch assets:", e);
      setError("Failed to load assets. Please check the backend server.");
      setAssetLoadError("Failed to load assets for display.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const handleAddAsset = () => {
    setAssetToEdit({});
    setShowForm(true);
  };

  const handleEditAsset = (asset) => {
    setAssetToEdit(asset);
    setShowForm(true);
  };

  const handleDeleteAsset = async (assetId) => {
    console.log("Confirm: Are you sure you want to delete this asset?");
    const isConfirmed = window.confirm("Are you sure you want to delete this asset?");
    if (!isConfirmed) {
      return;
    }
    try {
      const response = await fetch(`${backendUrl}/api/assets/${assetId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      fetchAssets();
    } catch (e) {
      console.error("Failed to delete asset:", e);
      setError(`Error deleting asset: ${e.message}`);
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setAssetToEdit(null);
    fetchAssets();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setAssetToEdit(null);
  };

  if (loading && !showForm) {
    return (
      <div className="assets-page-loading">
        Loading assets...
      </div>
    );
  }

  if (error && !showForm) {
    return (
      <div className="assets-page-error">
        {error}
      </div>
    );
  }

  return (
    <>
      <style>
        {`
        .assets-page-container {
          width: 100%; /* Take full width of parent */
          box-sizing: border-box; /* Include padding in element's total width */
          font-family: 'Inter', sans-serif;
        }

        .content-area-wrapper { /* New wrapper for centering content */
          max-width: 80rem; /* Max width for content */
          margin: 0 auto; /* Center horizontally */
          padding: 1rem 1rem; /* Padding for inner content */
        }
        @media (min-width: 640px) {
          .content-area-wrapper {
            padding: 1.5rem 2rem; /* More padding on larger screens */
          }
        }


        .assets-page-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 1.5rem;
          text-align: center;
        }

        .add-asset-button {
          background-color: #3b82f6;
          color: #fff;
          font-weight: 700;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
          transition: all 0.3s ease-in-out;
          transform: scale(1);
          outline: none;
          border: none;
          cursor: pointer;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }

        .add-asset-button:hover {
          background-color: #2563eb;
          transform: scale(1.05);
        }

        .add-asset-button:focus {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }

        .no-assets-message {
          color: #4b5563;
          text-align: center;
          padding-top: 2rem;
          padding-bottom: 2rem;
        }

        .assets-table-wrapper {
          overflow-x: auto;
          background-color: #fff;
          border-radius: 0.75rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border: 1px solid #bfdbfe;
        }

        .assets-table {
          min-width: 100%;
          border-collapse: collapse;
        }

        .assets-table thead {
          background-color: #eff6ff;
        }

        .assets-table th {
          padding: 0.75rem 1.5rem;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 600;
          color: #1d4ed8;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 1px solid #bfdbfe;
        }

        .assets-table tbody {
          background-color: #fff;
        }

        .assets-table tr {
          border-bottom: 1px solid #e5e7eb;
        }

        .assets-table tr:nth-child(even) {
          background-color: #eff6ff;
        }

        .assets-table tr:hover {
          background-color: #dbeafe;
          transition: background-color 0.15s ease-in-out;
        }

        .assets-table td {
          padding: 1rem 1.5rem;
          white-space: nowrap;
          font-size: 0.875rem;
          color: #374151;
        }

        .assets-table td:first-child {
          font-weight: 500;
          color: #111827;
        }

        .assets-table td:last-child {
          text-align: right;
          font-weight: 500;
        }

        .action-button {
          font-weight: 600;
          cursor: pointer;
          border: none;
          background: none;
          padding: 0;
          margin: 0;
          text-decoration: none;
          transition: color 0.15s ease-in-out;
        }

        .edit-button {
          color: #2563eb;
          margin-right: 1rem;
        }

        .edit-button:hover {
          color: #1e40af;
          text-decoration: underline;
        }

        .delete-button {
          color: #dc2626;
        }

        .delete-button:hover {
          color: #991b1b;
          text-decoration: underline;
        }

        .assets-page-loading, .assets-page-error {
          text-align: center;
          padding: 1.5rem;
          color: #4b5563;
        }

        .assets-page-error {
          color: #dc2626;
          font-weight: 700;
        }
        `}
      </style>

      <div className="assets-page-container">
        {showForm ? (
          <AssetForm
            onSave={handleFormSave}
            onCancel={handleFormCancel}
            initialData={assetToEdit}
          />
        ) : (
          <div className="content-area-wrapper"> {/* Apply wrapper for content centering */}
            <h2 className="assets-page-title">Asset List</h2>
            <button
              onClick={handleAddAsset}
              className="add-asset-button"
            >
              Add New Asset
            </button>

            {assets.length === 0 ? (
              <p className="no-assets-message">No assets found. Add some assets to get started!</p>
            ) : (
              <div className="assets-table-wrapper">
                <table className="assets-table">
                  <thead>
                    <tr>
                      <th>Asset Code</th>
                      <th>Serial Number</th>
                      <th>Asset Type</th>
                      <th>Make</th>
                      <th>Model</th>
                      <th>Assigned User</th>
                      <th>Status</th>
                      <th>Expiry Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assets.map((asset) => {
                      return (
                        <tr key={asset.id}>
                          <td>{asset.asset_code}</td>
                          <td>{asset.serial_number}</td>
                          <td>{asset.asset_type}</td>
                          <td>{asset.make}</td>
                          <td>{asset.model}</td>
                          <td>{asset.user_name || 'N/A'}</td>
                          <td>{asset.status}</td>
                          <td>{asset.expiry_date || 'N/A'}</td>
                          <td>
                            <button
                              onClick={() => handleEditAsset(asset)}
                              className="action-button edit-button"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteAsset(asset.id)}
                              className="action-button delete-button"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// Inlined UserForm component
function UserForm({ onSave, onCancel, initialData = {} }) {
  const [formData, setFormData] = useState({
    emp_id: '',
    emp_code: '', // New field
    name: '',
    email: '',
    role: 'Employee',
    department: '', // New field
    division: '', // New field
    join_date: '', // New field
    status: 'Active', // New field (initially was a general status)
    location: '', // New field
    phone_number: '', // New field
    designation: '', // New field
    reporting_manager: '', // New field
  });

  const [submitError, setSubmitError] = useState(null); // For errors during form submission

  const backendUrl = 'http://localhost:5000'; // Your Flask backend URL

  // Effect to populate form when initialData changes (for edit mode)
  useEffect(() => {
    // Format join_date for input type="date"
    const formattedJoinDate = initialData.join_date ? new Date(initialData.join_date).toISOString().split('T')[0] : '';
    
    // Explicitly set each field to its initialData value or a default
    setFormData({
      emp_id: initialData.emp_id || '',
      emp_code: initialData.emp_code || '',
      name: initialData.name || '',
      email: initialData.email || '',
      role: initialData.role || 'Employee',
      department: initialData.department || '',
      division: initialData.division || '',
      join_date: formattedJoinDate, // Use the formatted date directly
      status: initialData.status || 'Active',
      location: initialData.location || '',
      phone_number: initialData.phone_number || '',
      designation: initialData.designation || '',
      reporting_manager: initialData.reporting_manager || '',
    });
  }, [initialData]); // Re-run if initialData changes (e.g., when switching from Add to Edit)


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    // Prepare data to send, ensuring dates are in 'YYYY-MM-DD' format if present
    const dataToSend = { ...formData };
    if (dataToSend.join_date) {
        dataToSend.join_date = dataToSend.join_date === '' ? null : dataToSend.join_date;
    } else {
        dataToSend.join_date = null;
    }

    try {
      const method = initialData.id ? 'PUT' : 'POST';
      const url = initialData.id ? `${backendUrl}/api/users/${initialData.id}` : `${backendUrl}/api/users`;

      console.log("UserForm: Submitting data:", dataToSend);

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();
      console.log("UserForm: Submission response result:", result);

      if (!response.ok) {
        throw new Error(result.error || `HTTP error! status: ${response.status}`);
      }

      onSave(); // Call the onSave function passed from parent (UsersPage)
    } catch (e) {
      console.error("UserForm: Failed to save user:", e);
      setSubmitError(e.message || "An unexpected error occurred during submission.");
    }
  };

  return (
    <>
      <style>
        {`
        .user-form-wrapper {
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 2rem;
          width: 100%;
          box-sizing: border-box;
          min-height: calc(100vh - 12rem);
        }

        .user-form-container {
          background-color: #fff;
          padding: 2rem;
          border-radius: 0.75rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border: 1px solid #bfdbfe;
          max-width: 40rem; /* Consistent max-width for forms */
          width: 100%;
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }

        .user-form-title {
          font-size: 1.875rem;
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 2rem;
          text-align: center;
        }

        .user-form-error-box {
          background-color: #fee2e2;
          border: 1px solid #f87171;
          color: #b91c1c;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          position: relative;
          margin-bottom: 1rem;
        }

        .user-form-grid {
          display: grid;
          grid-template-columns: 1fr;
          column-gap: 2rem; /* Increased gap */
          row-gap: 1.5rem; /* Increased gap */
        }

        @media (min-width: 768px) {
          .user-form-grid {
            grid-template-columns: 1fr 1fr;
          }
          .user-form-actions {
            grid-column: span 2 / span 2;
          }
        }

        .form-label { /* Reused from AssetForm */
          display: block;
          font-size: 0.875rem;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.25rem;
        }

        .required-star { /* Reused from AssetForm */
          color: #ef4444;
        }

        .form-input, .form-select { /* Reused and extended from AssetForm */
          margin-top: 0.25rem;
          display: block;
          width: 100%;
          border-radius: 0.375rem;
          border: 1px solid #d1d5db;
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          padding: 0.625rem; /* Equivalent to Tailwind p-2.5 */
          font-size: 0.875rem; /* Equivalent to Tailwind sm:text-sm */
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus, .form-select:focus { /* Reused from AssetForm */
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
        }

        .user-form-actions { /* Reused from AssetForm */
          display: flex;
          justify-content: flex-end;
          gap: 1rem; /* Equivalent to Tailwind space-x-4 */
          margin-top: 2rem; /* Equivalent to Tailwind mt-8 */
        }

        .button-cancel, .button-submit { /* Reused from AssetForm */
          font-weight: 700;
          padding: 0.625rem 1.25rem; /* Equivalent to Tailwind py-2.5 px-5 */
          border-radius: 0.5rem; /* Equivalent to Tailwind rounded-lg */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* Equivalent to Tailwind shadow-md */
          transition: all 0.3s ease-in-out;
          transform: scale(1); /* Ensures transition starts from original size */
          outline: none;
          border: none; /* No border for these buttons from Tailwind classes */
          cursor: pointer;
        }

        .button-cancel {
          background-color: #d1d5db; /* Equivalent to Tailwind bg-gray-300 */
          color: #1f2937; /* Equivalent to Tailwind text-gray-800 */
        }
        .button-cancel:hover {
          background-color: #9ca3af; /* Equivalent to Tailwind hover:bg-gray-400 */
          transform: scale(1.05); /* Equivalent to Tailwind hover:scale-105 */
        }
        .button-cancel:focus {
          box-shadow: 0 0 0 2px rgba(209, 213, 219, 0.5); /* Equivalent to focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 */
        }

        .button-submit {
          background-color: #2563eb; /* Equivalent to Tailwind bg-blue-600 */
          color: #fff; /* Equivalent to Tailwind text-white */
        }
        .button-submit:hover {
          background-color: #1d4ed8; /* Equivalent to Tailwind hover:bg-blue-700 */
          transform: scale(1.05); /* Equivalent to Tailwind hover:scale-105 */
        }
        .button-submit:focus {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); /* Equivalent to focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 */
        }
        `}
      </style>

      <div className="user-form-wrapper">
        <div className="user-form-container">
          <h3 className="user-form-title">{initialData.id ? 'Edit User' : 'Add New User'}</h3>
          {submitError && (
            <div className="user-form-error-box" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {submitError}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="user-form-grid">
            {/* Employee ID */}
            <div>
              <label htmlFor="emp_id" className="form-label">Employee ID <span className="required-star">*</span></label>
              <input
                type="text"
                name="emp_id"
                id="emp_id"
                value={formData.emp_id}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            {/* Employee Code (New) */}
            <div>
              <label htmlFor="emp_code" className="form-label">Employee Code <span className="required-star">*</span></label>
              <input
                type="text"
                name="emp_code"
                id="emp_code"
                value={formData.emp_code}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            {/* Name */}
            <div>
              <label htmlFor="name" className="form-label">Name <span className="required-star">*</span></label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="form-label">Email <span className="required-star">*</span></label>
              <input
                type="email"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            {/* Department (New) */}
            <div>
              <label htmlFor="department" className="form-label">Department</label>
              <input
                type="text"
                name="department"
                id="department"
                value={formData.department}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Division (New) */}
            <div>
              <label htmlFor="division" className="form-label">Division</label>
              <input
                type="text"
                name="division"
                id="division"
                value={formData.division}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Join Date (New) */}
            <div>
              <label htmlFor="join_date" className="form-label">Join Date</label>
              <input
                type="date"
                name="join_date"
                id="join_date"
                value={formData.join_date}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Status (New) */}
            <div>
              <label htmlFor="status" className="form-label">Status</label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="On Leave">On Leave</option>
              </select>
            </div>

            {/* Location (New) */}
            <div>
              <label htmlFor="location" className="form-label">Location</label>
              <input
                type="text"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Phone Number (New) */}
            <div>
              <label htmlFor="phone_number" className="form-label">Phone Number</label>
              <input
                type="text"
                name="phone_number"
                id="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Designation (New) */}
            <div>
              <label htmlFor="designation" className="form-label">Designation</label>
              <input
                type="text"
                name="designation"
                id="designation"
                value={formData.designation}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Reporting Manager (New) */}
            <div>
              <label htmlFor="reporting_manager" className="form-label">Reporting Manager</label>
              <input
                type="text"
                name="reporting_manager"
                id="reporting_manager"
                value={formData.reporting_manager}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Role (Existing but styled) */}
            <div>
              <label htmlFor="role" className="form-label">Role</label>
              <select
                name="role"
                id="role"
                value={formData.role}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Employee">Employee</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
              </select>
            </div>


            {/* Form Actions */}
            <div className="user-form-actions">
              <button
                type="button"
                onClick={onCancel}
                className="button-cancel"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="button-submit"
              >
                {initialData.id ? 'Update User' : 'Add User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

// Inlined UsersPage component
function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [userToEdit, setUserToEdit] = useState(null); // State to hold user data if editing

  const backendUrl = 'http://localhost:5000';

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUrl}/api/users`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setUsers(data);
    } catch (e) {
      console.error("Failed to fetch users:", e);
      setError("Failed to load users. Please check the backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setUserToEdit({}); // Empty object for new user
    setShowForm(true);
  };

  const handleEditUser = (user) => {
    setUserToEdit(user); // Set data for editing
    setShowForm(true);
  };

  const handleDeleteUser = async (userId) => {
    console.log("Confirm: Are you sure you want to delete this user?");
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (!isConfirmed) {
      return;
    }
    try {
      const response = await fetch(`${backendUrl}/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      fetchUsers();
    } catch (e) {
      console.error("Failed to delete user:", e);
      setError(`Error deleting user: ${e.message}`);
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setUserToEdit(null);
    fetchUsers();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setUserToEdit(null);
  };

  if (loading && !showForm) { return <div className="users-page-loading">Loading users...</div>; }
  if (error && !showForm) { return <div className="users-page-error">{error}</div>; }

  return (
    <>
      <style>
        {`
        .users-page-container {
          width: 100%; /* Take full width of parent */
          box-sizing: border-box; /* Include padding in element's total width */
          font-family: 'Inter', sans-serif;
          color: #1f2937;
        }
        .content-area-wrapper { /* Re-using the content wrapper from AssetsPage */
          max-width: 80rem; /* Max width for content */
          margin: 0 auto; /* Center horizontally */
          padding: 1rem 1rem; /* Padding for inner content */
        }
        @media (min-width: 640px) {
          .content-area-wrapper {
            padding: 1.5rem 2rem; /* More padding on larger screens */
          }
        }
        .users-page-title { font-size: 1.875rem; font-weight: 700; color: #1f2937; margin-bottom: 1.5rem; text-align: center; }
        .add-user-button {
          background-color: #3b82f6;
          color: #fff;
          font-weight: 700;
          padding: 0.75rem 1.5rem;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          margin-bottom: 2rem;
          transition: all 0.3s ease-in-out;
          transform: scale(1);
          outline: none;
          border: none;
          cursor: pointer;
          display: block;
          margin-left: auto;
          margin-right: auto;
        }
        .add-user-button:hover {
          background-color: #2563eb;
          transform: scale(1.05);
        }
        .add-user-button:focus {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
        }
        .no-users-message { color: #4b5563; text-align: center; padding: 2rem 0; }
        .users-table-wrapper { overflow-x: auto; background-color: #fff; border-radius: 0.75rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); border: 1px solid #bfdbfe; }
        .users-table { min-width: 100%; border-collapse: collapse; }
        .users-table thead { background-color: #eff6ff; }
        .users-table th { padding: 0.75rem 1.5rem; text-align: left; font-size: 0.75rem; font-weight: 600; color: #1d4ed8; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #bfdbfe; }
        .users-table tbody { background-color: #fff; }
        .users-table tr { border-bottom: 1px solid #e5e7eb; }
        .users-table tr:nth-child(even) { background-color: #eff6ff; }
        .users-table tr:hover { background-color: #dbeafe; transition: background-color 0.15s ease-in-out; }
        .users-table td { padding: 1rem 1.5rem; white-space: nowrap; font-size: 0.875rem; color: #374151; }
        .users-table td:first-child { font-weight: 500; color: #111827; }
        .action-button-base { font-weight: 600; cursor: pointer; border: none; background: none; padding: 0; margin: 0; text-decoration: none; transition: color 0.15s ease-in-out; }
        .user-edit-button { color: #2563eb; margin-right: 1rem; }
        .user-edit-button:hover { color: #1e40af; text-decoration: underline; }
        .user-delete-button { color: #dc2626; }
        .user-delete-button:hover { color: #991b1b; text-decoration: underline; }
        .users-page-loading, .users-page-error { text-align: center; padding: 1.5rem; color: #4b5563; }
        .users-page-error { color: #dc2626; font-weight: 700; }
        `}
      </style>
      <div className="users-page-container">
        {showForm ? (
          <UserForm onSave={handleFormSave} onCancel={handleFormCancel} initialData={userToEdit} />
        ) : (
          <div className="content-area-wrapper"> {/* Apply wrapper for content centering */}
            <h2 className="users-page-title">User List</h2>
            <button onClick={handleAddUser} className="add-user-button">Add New User</button>
            {users.length === 0 ? (
              <p className="no-users-message">No users found.</p>
            ) : (
              <div className="users-table-wrapper">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Employee ID</th>
                      <th>Employee Code</th> {/* New column */}
                      <th>Name</th>
                      <th>Email</th>
                      <th>Department</th> {/* New column */}
                      <th>Division</th> {/* New column */}
                      <th>Join Date</th> {/* New column */}
                      <th>Status</th> {/* New column */}
                      <th>Location</th> {/* New column */}
                      <th>Phone</th> {/* New column */}
                      <th>Designation</th> {/* New column */}
                      <th>Reporting Manager</th> {/* New column */}
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td>{user.emp_id}</td>
                        <td>{user.emp_code || 'N/A'}</td> {/* Display new field */}
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>{user.department || 'N/A'}</td> {/* Display new field */}
                        <td>{user.division || 'N/A'}</td> {/* Display new field */}
                        <td>{user.join_date ? new Date(user.join_date).toLocaleDateString() : 'N/A'}</td> {/* Display new field */}
                        <td>{user.status || 'N/A'}</td> {/* Display new field */}
                        <td>{user.location || 'N/A'}</td> {/* Display new field */}
                        <td>{user.phone_number || 'N/A'}</td> {/* Display new field */}
                        <td>{user.designation || 'N/A'}</td> {/* Display new field */}
                        <td>{user.reporting_manager || 'N/A'}</td> {/* Display new field */}
                        <td>{user.role}</td>
                        <td>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="action-button-base user-edit-button"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="action-button-base user-delete-button"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

// Inlined ScrapDisposalPage component
function ScrapDisposalPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = 'http://localhost:5000';

  const fetchScrapDisposalAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUrl}/api/assets`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const filteredAssets = data.filter(asset =>
        asset.status === 'Pending Scrap Approval' || asset.status === 'Disposed'
      );
      setAssets(filteredAssets);
    } catch (e) {
      console.error("Failed to fetch scrap/disposal assets:", e);
      setError("Failed to load scrap/disposal assets. Please check the backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScrapDisposalAssets();
  }, []);

  const handleUpdateStatus = async (assetId, currentStatus) => {
    let newStatus;
    console.log("Confirm: Mark this asset as Disposed/Revert to Active?");
    const isConfirmed = window.confirm(
      currentStatus === 'Pending Scrap Approval'
        ? "Mark this asset as Disposed?"
        : "Revert this asset to Active status?"
    );
    if (!isConfirmed) return;

    newStatus = currentStatus === 'Pending Scrap Approval' ? 'Disposed' : 'Active';

    try {
      const assetResponse = await fetch(`${backendUrl}/api/assets/${assetId}`);
      if (!assetResponse.ok) {
        const errorData = await assetResponse.json();
        throw new Error(`Failed to fetch asset for update: ${assetResponse.status} - ${errorData.error || assetResponse.statusText}`);
      }
      const assetToUpdate = await assetResponse.json();

      const payload = {
        ...assetToUpdate,
        capital_date: assetToUpdate.capital_date ? new Date(assetToUpdate.capital_date).toISOString().split('T')[0] : null,
        expiry_date: assetToUpdate.expiry_date ? new Date(assetToUpdate.expiry_date).toISOString().split('T')[0] : null,
        status: newStatus,
      };

      const response = await fetch(`${backendUrl}/api/assets/${assetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status} - ${response.statusText}`);
      }
      fetchScrapDisposalAssets();
    } catch (e) {
      console.error("Failed to update asset status:", e);
      setError(`Error updating asset status: ${e.message}`);
    }
  };

  const handleDeleteAsset = async (assetId) => {
    console.log("Confirm: Are you sure you want to permanently delete this asset?");
    const isConfirmed = window.confirm("Are you sure you want to permanently delete this asset?");
    if (!isConfirmed) return;
    try {
      const response = await fetch(`${backendUrl}/api/assets/${assetId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      fetchScrapDisposalAssets();
    } catch (e) {
      console.error("Failed to delete asset:", e);
      setError(`Error deleting asset: ${e.message}`);
    }
  };

  if (loading) { return <div className="scrap-disposal-loading">Loading scrap/disposal assets...</div>; }
  if (error) { return <div className="scrap-disposal-error">{error}</div>; }

  return (
    <>
      <style>
        {`
        .scrap-disposal-container { width: 100%; /* Take full width of parent */ box-sizing: border-box; /* Include padding in element's total width */ font-family: 'Inter', sans-serif; color: #1f2937; }
        .content-area-wrapper { /* Re-using the content wrapper for consistent centering */
          max-width: 80rem; /* Max width for content */
          margin: 0 auto; /* Center horizontally */
          padding: 1rem 1rem; /* Padding for inner content */
        }
        @media (min-width: 640px) { .content-area-wrapper { padding: 1.5rem 2rem; } }
        .scrap-disposal-title { font-size: 1.875rem; font-weight: 700; color: #1f2937; margin-bottom: 1.5rem; text-align: center; }
        .no-assets-message { color: #4b5563; text-align: center; padding: 2rem 0; }
        .assets-table-wrapper { overflow-x: auto; background-color: #fff; border-radius: 0.5rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06); border: 1px solid #e5e7eb; }
        .assets-table { min-width: 100%; border-collapse: collapse; }
        .assets-table thead { background-color: #eff6ff; }
        .assets-table th { padding: 0.75rem 1.5rem; text-align: left; font-size: 0.75rem; font-weight: 500; color: #1d4ed8; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #e5e7eb; }
        .assets-table tbody { background-color: #fff; }
        .assets-table tr { border-bottom: 1px solid #e5e7eb; }
        .assets-table tr:nth-child(even) { background-color: #f9fafb; }
        .assets-table tr:hover { background-color: #e0f2fe; transition: background-color 0.15s ease-in-out; }
        .assets-table td { padding: 1rem 1.5rem; white-space: nowrap; font-size: 0.875rem; color: #374151; }
        .assets-table td:first-child { font-weight: 500; color: #111827; }
        .assets-table td:last-child { text-align: right; font-weight: 500; }
        .status-badge { padding: 0.25rem 0.5rem; display: inline-flex; font-size: 0.75rem; line-height: 1.25rem; font-weight: 600; border-radius: 9999px; }
        .status-badge-disposed { background-color: #e5e7eb; color: #374151; }
        .status-badge-pending { background-color: #fefcbf; color: #92400e; }
        .action-button-base { font-weight: 600; cursor: pointer; border: none; background: none; padding: 0; margin: 0; text-decoration: none; transition: color 0.15s ease-in-out; }
        .action-button-mark { color: #2563eb; margin-right: 1rem; }
        .action-button-mark:hover { color: #1e40af; text-decoration: underline; }
        .action-button-mark:disabled { color: #6b7280; cursor: not-allowed; }
        .action-button-delete { color: #dc2626; }
        .action-button-delete:hover { color: #991b1b; text-decoration: underline; }
        .scrap-disposal-loading, .scrap-disposal-error { text-align: center; padding: 1.5rem; color: #4b5563; }
        .scrap-disposal-error { color: #dc2626; font-weight: 700; }
        `}
      </style>
      <div className="scrap-disposal-container">
        <div className="content-area-wrapper"> {/* Apply wrapper for content centering */}
          <h2 className="scrap-disposal-title">Scrap & Disposal List</h2>
          {assets.length === 0 ? (
            <p className="no-assets-message">No assets currently marked for scrap or disposal.</p>
          ) : (
            <div className="assets-table-wrapper">
              <table className="assets-table">
                <thead>
                  <tr>
                    <th>Asset Code</th>
                    <th>Serial Number</th>
                    <th>Asset Type</th>
                    <th>Status</th>
                    <th>Assigned User</th>
                    <th>Category</th>
                    <th>Location</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr key={asset.id}>
                      <td>{asset.asset_code}</td>
                      <td>{asset.serial_number}</td>
                      <td>{asset.asset_type}</td>
                      <td>
                        <span className={`status-badge ${
                          asset.status === 'Disposed' ? 'status-badge-disposed' : 'status-badge-pending'
                        }`}>
                          {asset.status}
                        </span>
                      </td>
                      <td>{asset.user_name || 'N/A'}</td>
                      <td>{asset.category_name || 'N/A'}</td>
                      <td>{asset.location_name || 'N/A'}</td>
                      <td>
                        <button
                          onClick={() => handleUpdateStatus(asset.id, asset.status)}
                          className={`action-button-base action-button-mark ${
                            asset.status === 'Disposed' ? 'action-button-mark:disabled' : ''
                          }`}
                          disabled={asset.status === 'Disposed'}
                        >
                          {asset.status === 'Pending Scrap Approval' ? 'Mark Disposed' : 'Revert to Active'}
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="action-button-base action-button-delete"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Inlined WarrantyAlertsPage component
function WarrantyAlertsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const backendUrl = 'http://localhost:5000';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const hasExpired = (expiryDateString) => {
    if (!expiryDateString) return false;
    const expiryDate = new Date(expiryDateString);
    const today = new Date();
    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return expiryDate < today;
  };

  const isExpiringSoon = (expiryDateString, daysThreshold = 30) => {
    if (!expiryDateString) return false;
    const expiryDate = new Date(expiryDateString);
    const today = new Date();
    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysThreshold);
    futureDate.setHours(0, 0, 0, 0);
    return expiryDate >= today && expiryDate <= futureDate;
  };

  useEffect(() => {
    const fetchWarrantyAssets = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${backendUrl}/api/assets`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        const relevantAssets = data.filter(asset =>
          asset.warranty_status === 'In Warranty' && (hasExpired(asset.expiry_date) || isExpiringSoon(asset.expiry_date))
        );
        setAssets(relevantAssets);
      } catch (e) {
        console.error("Failed to fetch warranty alerts assets:", e);
        setError("Failed to load warranty alerts. Please check the backend server.");
      } finally {
        setLoading(false);
      }
    };
    fetchWarrantyAssets();
  }, []);

  if (loading) { return <div className="warranty-alerts-loading">Loading warranty alerts...</div>; }
  if (error) { return <div className="warranty-alerts-error">{error}</div>; }

  return (
    <>
      <style>
        {`
        .warranty-alerts-container { width: 100%; /* Take full width of parent */ box-sizing: border-box; /* Include padding in element's total width */ font-family: 'Inter', sans-serif; color: #1f2937; }
        .content-area-wrapper { /* Re-using the content wrapper for consistent centering */
          max-width: 80rem; /* Max width for content */
          margin: 0 auto; /* Center horizontally */
          padding: 1rem 1rem; /* Padding for inner content */
        }
        @media (min-width: 640px) { .content-area-wrapper { padding: 1.5rem 2rem; } }
        .warranty-alerts-title { font-size: 1.875rem; font-weight: 700; color: #1f2937; margin-bottom: 1.5rem; text-align: center; }
        .no-alerts-message { color: #4b5563; text-align: center; padding: 2rem 0; }
        .alerts-table-wrapper { overflow-x: auto; background-color: #fff; border-radius: 0.75rem; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05); border: 1px solid #bfdbfe; }
        .alerts-table { min-width: 100%; border-collapse: collapse; }
        .alerts-table thead { background-color: #eff6ff; }
        .alerts-table th { padding: 0.75rem 1.5rem; text-align: left; font-size: 0.75rem; font-weight: 600; color: #1d4ed8; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #bfdbfe; }
        .alerts-table tbody { background-color: #fff; }
        .alerts-table tr { border-bottom: 1px solid #e5e7eb; }
        .alerts-table tr:nth-child(even) { background-color: #eff6ff; }
        .alerts-table tr:hover { background-color: #dbeafe; transition: background-color 0.15s ease-in-out; }
        .alerts-table td { padding: 1rem 1.5rem; white-space: nowrap; font-size: 0.875rem; color: #374151; }
        .alerts-table td:first-child { font-weight: 500; color: #111827; }
        .status-pill-expired { background-color: #fef2f2; color: #ef4444; padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: 500; font-size: 0.75rem; }
        .status-pill-expiring { background-color: #fffbeb; color: #f59e0b; padding: 0.25rem 0.75rem; border-radius: 9999px; font-weight: 500; font-size: 0.75rem; }
        .warranty-alerts-loading, .warranty-alerts-error { text-align: center; padding: 1.5rem; color: #4b5563; }
        .warranty-alerts-error { color: #dc2626; font-weight: 700; }
        `}
      </style>
      <div className="warranty-alerts-container">
        <div className="content-area-wrapper"> {/* Apply wrapper for content centering */}
          <h2 className="warranty-alerts-title">Warranty Alerts</h2>
          {assets.length === 0 ? (
            <p className="no-alerts-message">No warranty alerts at this time.</p>
          ) : (
            <div className="alerts-table-wrapper">
              <table className="alerts-table">
                <thead>
                  <tr>
                    <th>Asset Code</th>
                    <th>Serial Number</th>
                    <th>Asset Type</th>
                    <th>Assigned User</th>
                    <th>Warranty Status</th>
                    <th>Expiry Date</th>
                    <th>Alert Status</th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((asset) => (
                    <tr key={asset.id}>
                      <td>{asset.asset_code}</td>
                      <td>{asset.serial_number}</td>
                      <td>{asset.asset_type}</td>
                      <td>{asset.user_name || 'N/A'}</td>
                      <td>{asset.warranty_status}</td>
                      <td>{formatDate(asset.expiry_date)}</td>
                      <td>
                        {hasExpired(asset.expiry_date) ? (
                          <span className="status-pill-expired">Expired</span>
                        ) : isExpiringSoon(asset.expiry_date) ? (
                          <span className="status-pill-expiring">Expiring Soon</span>
                        ) : (
                          'N/A'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Inlined ReportsPage component
function ReportsPage() {
  const [allAssets, setAllAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterWarrantyStatus, setFilterWarrantyStatus] = useState('');
  const [filterExpiryDateRange, setFilterExpiryDateRange] = useState('');

  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);

  const backendUrl = 'http://localhost:5000';

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const isExpiringSoon = (expiryDateString, daysThreshold = 30) => {
    if (!expiryDateString) return false;
    const expiryDate = new Date(expiryDateString);
    const today = new Date();
    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysThreshold);
    futureDate.setHours(0, 0, 0, 0);
    return expiryDate >= today && expiryDate <= futureDate;
  };

  const hasExpired = (expiryDateString) => {
    if (!expiryDateString) return false;
    const expiryDate = new Date(expiryDateString);
    const today = new Date();
    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return expiryDate < today;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const assetsRes = await fetch(`${backendUrl}/api/assets`);
        if (!assetsRes.ok) throw new Error(`HTTP error! Assets status: ${assetsRes.status}`);
        const assetsData = await assetsRes.json();
        setAllAssets(assetsData);

        const uniqueCategories = [...new Set(assetsData.map(asset => asset.category_name).filter(Boolean))];
        const uniqueLocations = [...new Set(assetsData.map(asset => asset.location_name).filter(Boolean))];

        const usersRes = await fetch(`${backendUrl}/api/users`);
        if (!usersRes.ok) throw new Error(`HTTP error! Users status: ${usersRes.status}`);
        const usersData = await usersRes.json();
        setUsers(usersData);

        setCategories(uniqueCategories);
        setLocations(uniqueLocations);

      } catch (e) {
        console.error("Failed to fetch data for reports:", e);
        setError("Failed to load report data. Please check the backend server.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAssets = useMemo(() => {
    let tempAssets = allAssets;
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      tempAssets = tempAssets.filter(asset =>
        (asset.asset_code && asset.asset_code.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (asset.serial_number && asset.serial_number.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (asset.asset_type && asset.asset_type.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (asset.asset_description && asset.asset_description.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (asset.make && asset.make.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (asset.model && asset.model.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (asset.category_name && asset.category_name.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (asset.location_name && asset.location_name.toLowerCase().includes(lowerCaseSearchTerm)) ||
        (asset.assigned_user && asset.user_name && asset.user_name.toLowerCase().includes(lowerCaseSearchTerm))
      );
    }
    if (filterStatus) { tempAssets = tempAssets.filter(asset => asset.status === filterStatus); }
    if (filterCategory) { tempAssets = tempAssets.filter(asset => asset.category_name === filterCategory); }
    if (filterLocation) { tempAssets = tempAssets.filter(asset => asset.location_name === filterLocation); }
    if (filterUser) {
      if (filterUser === 'null') { tempAssets = tempAssets.filter(asset => asset.user_id === null); }
      else { tempAssets = tempAssets.filter(asset => String(asset.user_id) === filterUser); }
    }
    if (filterWarrantyStatus) { tempAssets = tempAssets.filter(asset => asset.warranty_status === filterWarrantyStatus); }
    if (filterExpiryDateRange) {
      if (filterExpiryDateRange === 'expired') { tempAssets = tempAssets.filter(asset => hasExpired(asset.expiry_date)); }
      else if (filterExpiryDateRange === 'expiring_30_days') { tempAssets = tempAssets.filter(asset => isExpiringSoon(asset.expiry_date, 30) && !hasExpired(asset.expiry_date)); }
      else if (filterExpiryDateRange === 'not_expiring_soon') { tempAssets = tempAssets.filter(asset => !isExpiringSoon(asset.expiry_date, 30) && !hasExpired(asset.expiry_date)); }
    }
    return tempAssets;
  }, [allAssets, searchTerm, filterStatus, filterCategory, filterLocation, filterUser, filterWarrantyStatus, filterExpiryDateRange]);

  const summaryStats = useMemo(() => {
    const totalAssets = allAssets.length;
    const assignedAssets = allAssets.filter(asset => asset.user_id !== null).length;
    const notAssignedAssets = totalAssets - assignedAssets;
    const expiredAssets = allAssets.filter(asset => hasExpired(asset.expiry_date)).length;
    const expiringSoonAssets = allAssets.filter(asset => isExpiringSoon(asset.expiry_date, 30) && !hasExpired(asset.expiry_date)).length;
    return { totalAssets, assignedAssets, notAssignedAssets, expiredAssets, expiringSoonAssets, };
  }, [allAssets]);

  const assetsByStatusData = useMemo(() => {
    const counts = {};
    allAssets.forEach(asset => { counts[asset.status] = (counts[asset.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [allAssets]);

  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0054'];

  const assetsByCategoryData = useMemo(() => {
    const counts = {};
    allAssets.forEach(asset => {
      const categoryName = asset.category_name || 'Uncategorized';
      counts[categoryName] = (counts[categoryName] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [allAssets]);

  const handleDownloadReport = () => {
    if (filteredAssets.length === 0) { console.warn("No data to download. Please apply filters that yield results."); return; }
    const headers = ['Asset Code', 'Serial Number', 'Asset Type', 'Make', 'Model', 'Assigned User', 'Status', 'Category', 'Location', 'Warranty Status', 'Expiry Date', 'Capital Date', 'Year', 'Asset Description', 'Department', 'Division', 'Plant Code'];
    const csvRows = filteredAssets.map(asset => [
      `"${asset.asset_code || ''}"`, `"${asset.serial_number || ''}"`, `"${asset.asset_type || ''}"`, `"${asset.make || ''}"`, `"${asset.model || ''}"`,
      `"${asset.user_name || 'N/A'}"`, `"${asset.status || ''}"`, `"${asset.category_name || 'N/A'}"`, `"${asset.location_name || 'N/A'}"`,
      `"${asset.warranty_status || ''}"`, `"${formatDate(asset.expiry_date) || 'N/A'}"`, `"${formatDate(asset.capital_date) || 'N/A'}"`,
      `"${asset.year || ''}"`, `"${asset.asset_description || ''}"`, `"${asset.department || ''}"`, `"${asset.division || ''}"`, `"${asset.plant_code || ''}"`
    ].join(','));
    const csvContent = [headers.map(header => `"${header}"`).join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'asset_report.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) { return (<div className="reports-loading-message">Loading data for reports...</div>); }
  if (error) { return (<div className="reports-error-message">{error}</div>); }

  return (
    <>
      <style>
        {`
        .reports-page-container {
          padding: 1rem; /* Equivalent to p-4 */
          max-width: 90rem; /* Adjusted for wider report content */
          margin-left: auto;
          margin-right: auto;
          font-family: 'Inter', sans-serif;
          color: #1f2937; /* Default text color for general content */
        }

        @media (min-width: 640px) { /* sm breakpoint */
          .reports-page-container {
            padding: 1.5rem; /* Equivalent to sm:p-6 */
          }
        }

        .reports-page-title {
          font-size: 1.875rem; /* Equivalent to text-3xl */
          font-weight: 700; /* Equivalent to font-bold */
          color: #1f2937; /* Equivalent to text-gray-800 */
          margin-bottom: 2rem; /* Equivalent to mb-8 */
          text-align: center;
        }

        /* Summary Statistics Cards */
        .summary-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); /* Responsive grid */
          gap: 1.5rem; /* Equivalent to gap-6 */
          margin-bottom: 2.5rem; /* Equivalent to mb-10 */
        }

        @media (min-width: 640px) { /* sm breakpoint */
          .summary-cards-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (min-width: 1024px) { /* lg breakpoint */
          .summary-cards-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (min-width: 1280px) { /* xl breakpoint */
          .summary-cards-grid {
            grid-template-columns: repeat(5, 1fr);
          }
        }

        .summary-card-base {
          padding: 1.25rem; /* Equivalent to p-5 */
          border-radius: 0.75rem; /* Equivalent to rounded-xl */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* Equivalent to shadow-md */
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        }

        .summary-card-blue {
          background-color: #3b82f6; /* Equivalent to bg-blue-600 */
          color: #fff; /* Equivalent to text-white */
        }

        .summary-card-white {
          background-color: #fff; /* Equivalent to bg-white */
          color: #1e40af; /* Equivalent to text-blue-800 */
          border: 1px solid #bfdbfe; /* Equivalent to border border-blue-100 */
        }

        .summary-card-red {
          background-color: #fee2e2; /* Equivalent to bg-red-100 */
          color: #991b1b; /* Equivalent to text-red-800 */
          border: 1px solid #fecaca; /* Equivalent to border border-red-200 */
        }

        .summary-card-yellow {
          background-color: #fffbeb; /* Equivalent to bg-yellow-100 */
          color: #92400e; /* Equivalent to text-yellow-800 */
          border: 1px solid #fde68a; /* Equivalent to border border-yellow-200 */
        }

        .summary-card-value {
          font-size: 2.25rem; /* Equivalent to text-4xl */
          font-weight: 800; /* Equivalent to font-extrabold */
        }

        .summary-card-label {
          font-size: 0.875rem; /* Equivalent to text-sm */
          font-weight: 600; /* Equivalent to font-semibold */
        }

        /* Charts Section */
        .charts-grid {
          display: grid;
          grid-template-columns: 1fr; /* Default for mobile */
          gap: 2rem; /* Equivalent to gap-8 */
          margin-bottom: 2.5rem; /* Equivalent to mb-10 */
        }

        @media (min-width: 1024px) { /* lg breakpoint */
          .charts-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        .chart-card {
          background-color: #fff;
          padding: 1.5rem; /* Equivalent to p-6 */
          border-radius: 0.75rem; /* Equivalent to rounded-xl */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* Equivalent to shadow-lg */
          border: 1px solid #bfdbfe; /* Equivalent to border border-blue-100 */
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .chart-title {
          font-size: 1.25rem; /* Equivalent to text-xl */
          font-weight: 700; /* Equivalent to font-bold */
          color: #1d4ed8; /* Equivalent to text-blue-700 */
          margin-bottom: 1rem; /* Equivalent to mb-4 */
        }

        .no-chart-data {
          color: #4b5563; /* Equivalent to text-gray-600 */
          text-align: center;
          padding: 1rem 0; /* Equivalent to py-4 */
        }

        /* Filter Section */
        .filter-card {
          background-color: #fff;
          padding: 1.5rem; /* Equivalent to p-6 */
          border-radius: 0.75rem; /* Equivalent to rounded-xl */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* Equivalent to shadow-lg */
          border: 1px solid #bfdbfe; /* Equivalent to border border-blue-100 */
          margin-bottom: 2rem; /* Equivalent to mb-8 */
        }

        .filter-title {
          font-size: 1.25rem; /* Equivalent to text-xl */
          font-weight: 700; /* Equivalent to font-bold */
          color: #1d4ed8; /* Equivalent to text-blue-700 */
          margin-bottom: 1.25rem; /* Equivalent to mb-5 */
        }

        .filter-grid {
          display: grid;
          grid-template-columns: 1fr; /* Default for mobile */
          gap: 1rem; /* Equivalent to gap-4 */
        }

        @media (min-width: 768px) { /* md breakpoint */
          .filter-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (min-width: 1024px) { /* lg breakpoint */
          .filter-grid {
            grid-template-columns: 1fr 1fr 1fr;
          }
        }

        @media (min-width: 1280px) { /* xl breakpoint */
          .filter-grid {
            grid-template-columns: 1fr 1fr 1fr 1fr;
          }
        }

        .filter-label {
          display: block;
          font-size: 0.875rem; /* Equivalent to text-sm */
          font-weight: 500; /* Equivalent to font-medium */
          color: #374151; /* Equivalent to text-gray-700 */
          margin-bottom: 0.25rem; /* Equivalent to mb-1 */
        }

        .filter-input, .filter-select {
          margin-top: 0.25rem; /* Equivalent to mt-1 */
          display: block;
          width: 100%;
          border-radius: 0.375rem; /* Equivalent to rounded-md */
          border: 1px solid #d1d5db; /* Equivalent to border-gray-300 */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* Equivalent to shadow-sm */
          padding: 0.625rem; /* Equivalent to p-2.5 */
          font-size: 0.875rem; /* Equivalent to sm:text-sm */
          box-sizing: border-box;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .filter-input:focus, .filter-select:focus {
          border-color: #3b82f6; /* Equivalent to focus:border-blue-500 */
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5); /* Equivalent to focus:ring-blue-500 */
        }

        .clear-filters-button-wrapper {
          display: flex;
          align-items: flex-end; /* Align button to bottom of its grid cell */
        }

        .clear-filters-button {
          background-color: #d1d5db; /* Equivalent to bg-gray-300 */
          color: #1f2937; /* Equivalent to text-gray-800 */
          font-weight: 700; /* Equivalent to font-bold */
          padding: 0.625rem 1.25rem; /* py-2.5 px-5 */
          border-radius: 0.5rem; /* rounded-lg */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
          transition: all 0.3s ease-in-out;
          width: 100%; /* w-full */
          outline: none;
          border: none;
          cursor: pointer;
        }

        .clear-filters-button:hover {
          background-color: #9ca3af; /* hover:bg-gray-400 */
        }

        .clear-filters-button:focus {
          box-shadow: 0 0 0 2px rgba(209, 213, 219, 0.5); /* focus:ring-2 focus:ring-gray-300 */
        }

        /* Filtered Assets Table and Download Button Section */
        .filtered-assets-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem; /* Equivalent to mb-4 */
        }

        .filtered-assets-title {
          font-size: 1.5rem; /* Equivalent to text-2xl */
          font-weight: 700; /* Equivalent to font-bold */
          color: #1f2937; /* Equivalent to text-gray-800 */
        }

        .download-button {
          background-color: #10b981; /* Equivalent to bg-green-600 */
          color: #fff; /* Equivalent to text-white */
          font-weight: 700; /* Equivalent to font-bold */
          padding: 0.625rem 1.25rem; /* py-2.5 px-5 */
          border-radius: 0.5rem; /* rounded-lg */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
          transition: all 0.3s ease-in-out;
          transform: scale(1); /* Ensures transition starts from original size */
          outline: none;
          border: none;
          cursor: pointer;
        }

        .download-button:hover {
          background-color: #059669; /* hover:bg-green-700 */
          transform: scale(1.05); /* hover:scale-105 */
        }

        .download-button:focus {
          box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.5); /* focus:ring-2 focus:ring-green-500 */
        }

        .no-filtered-assets-message {
          color: #4b5563; /* Equivalent to text-gray-600 */
          text-align: center;
          padding: 2rem 0; /* Equivalent to py-8 */
        }

        /* Tables */
        .assets-table-wrapper {
          overflow-x: auto; /* For horizontal scrolling on small screens */
          background-color: #fff; /* bg-white */
          border-radius: 0.75rem; /* rounded-xl */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* shadow-lg */
          border: 1px solid #bfdbfe; /* border border-blue-100 */
        }

        .assets-table {
          min-width: 100%; /* Ensure table takes full width of wrapper */
          border-collapse: collapse;
        }

        .assets-table thead {
          background-color: #eff6ff; /* bg-blue-50 */
        }

        .assets-table th {
          padding: 0.75rem 1.5rem; /* py-3 px-6 */
          text-align: left;
          font-size: 0.75rem; /* text-xs */
          font-weight: 600; /* font-semibold */
          color: #1d4ed8; /* text-blue-700 */
          text-transform: uppercase;
          letter-spacing: 0.05em; /* tracking-wider */
          border-bottom: 1px solid #bfdbfe; /* border-b border-blue-100 */
        }

        .assets-table tbody {
          background-color: #fff; /* bg-white */
        }

        .assets-table tr {
          border-bottom: 1px solid #e5e7eb; /* border-b border-gray-200 */
        }

        .assets-table tr:nth-child(even) {
          background-color: #eff6ff; /* bg-blue-50 */
        }

        .assets-table tr:hover {
          background-color: #dbeafe; /* hover:bg-blue-100 */
          transition: background-color 0.15s ease-in-out;
        }

        .assets-table td {
          padding: 1rem 1.5rem; /* py-4 px-6 */
          white-space: nowrap; /* prevent text wrapping in cells */
          font-size: 0.875rem; /* text-sm */
          color: #374151; /* text-gray-700 */
        }

        .assets-table td:first-child {
          font-weight: 500; /* font-medium */
          color: #111827; /* text-gray-900 */
        }

        /* Loading and Error Messages */
        .reports-loading-message, .reports-error-message {
          text-align: center;
          padding: 1.5rem; /* p-6 */
          color: #4b5563; /* text-gray-600 */
        }

        .reports-error-message {
          color: #dc2626; /* text-red-600 */
          font-weight: 700; /* font-bold */
        }
        `}
      </style>

      <div className="reports-page-container">
        <h2 className="reports-page-title">Asset Reports & Analytics</h2>
        <div className="summary-cards-grid">
          <div className="summary-card-base summary-card-blue">
            <p className="summary-card-value">{summaryStats.totalAssets}</p>
            <p className="summary-card-label">Total Assets</p>
          </div>
          <div className="summary-card-base summary-card-white">
            <p className="summary-card-value">{summaryStats.assignedAssets}</p>
            <p className="summary-card-label">Assigned Assets</p>
          </div>
          <div className="summary-card-base summary-card-white">
            <p className="summary-card-value">{summaryStats.notAssignedAssets}</p>
            <p className="summary-card-label">Not Assigned</p>
          </div>
          <div className="summary-card-base summary-card-red">
            <p className="summary-card-value">{summaryStats.expiredAssets}</p>
            <p className="summary-card-label">Expired Warranties</p>
          </div>
          <div className="summary-card-base summary-card-yellow">
            <p className="summary-card-value">{summaryStats.expiringSoonAssets}</p>
            <p className="summary-card-label">Expiring Soon (30 days)</p>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h3 className="chart-title">Assets by Status</h3>
            {assetsByStatusData.length > 0 ? (
              // ResponsiveContainer is crucial for making Recharts responsive within its parent
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={assetsByStatusData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    labelLine={false}
                    // Custom label to show name and percentage
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {assetsByStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-chart-data">No status data to display.</p>
            )}
          </div>

          <div className="chart-card">
            <h3 className="chart-title">Assets by Category</h3>
            {assetsByCategoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={assetsByCategoryData}
                  margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-15} textAnchor="end" height={60} interval={0} />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#82ca9d" name="Number of Assets" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-chart-data">No category data to display.</p>
            )}
          </div>
        </div>

        <div className="filter-card">
          <h3 className="filter-title">Filter Assets</h3>
          <div className="filter-grid">
            <div>
              <label htmlFor="searchTerm" className="filter-label">Search Keyword</label>
              <input
                type="text"
                id="searchTerm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Code, Serial, Type, Description..."
                className="filter-input"
              />
            </div>
            <div>
              <label htmlFor="filterStatus" className="filter-label">Status</label>
              <select
                id="filterStatus"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="">All Statuses</option>
                <option value="Active">Active</option>
                <option value="In Repair">In Repair</option>
                <option value="Pending Scrap Approval">Pending Scrap Approval</option>
                <option value="Disposed">Disposed</option>
              </select>
            </div>
            <div>
              <label htmlFor="filterCategory" className="filter-label">Category</label>
              <select
                id="filterCategory"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="filter-select"
              >
                <option value="">All Categories</option>
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="filterLocation" className="filter-label">Location</label>
              <select
                id="filterLocation"
                value={filterLocation}
                onChange={(e) => setFilterLocation(e.target.value)}
                className="filter-select"
              >
                <option value="">All Locations</option>
                {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="filterUser" className="filter-label">Assigned User</label>
              <select
                id="filterUser"
                value={filterUser}
                onChange={(e) => setFilterUser(e.target.value)}
                className="filter-select"
              >
                <option value="">All Users</option>
                <option value="null">Not Assigned</option>
                {users.map(user => <option key={user.id} value={user.id}>{user.name}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="filterWarrantyStatus" className="filter-label">Warranty Status</label>
              <select
                id="filterWarrantyStatus"
                value={filterWarrantyStatus}
                onChange={(e) => setFilterWarrantyStatus(e.target.value)}
                className="filter-select"
              >
                <option value="">All Warranty Statuses</option>
                <option value="In Warranty">In Warranty</option>
                <option value="Out of Warranty">Out of Warranty</option>
              </select>
            </div>
            <div>
              <label htmlFor="filterExpiryDateRange" className="filter-label">Warranty Expiry</label>
              <select
                id="filterExpiryDateRange"
                value={filterExpiryDateRange}
                onChange={(e) => setFilterExpiryDateRange(e.target.value)}
                className="filter-select"
              >
                <option value="">All</option>
                <option value="expired">Expired</option>
                <option value="expiring_30_days">Expiring in 30 Days</option>
                <option value="not_expiring_soon">Not Expiring Soon</option>
              </select>
            </div>
            <div className="clear-filters-button-wrapper">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('');
                  setFilterCategory('');
                  setFilterLocation('');
                  setFilterUser('');
                  setFilterWarrantyStatus('');
                  setFilterExpiryDateRange('');
                }}
                className="clear-filters-button"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        <div className="filtered-assets-header">
          <h3 className="filtered-assets-title">Filtered Assets ({filteredAssets.length} results)</h3>
          <button
            onClick={handleDownloadReport}
            className="download-button"
          >
            Download Report (CSV)
          </button>
        </div>

        {filteredAssets.length === 0 ? (
          <p className="no-filtered-assets-message">No assets match your current filters.</p>
        ) : (
          <div className="assets-table-wrapper">
            <table className="assets-table">
              <thead>
                <tr>
                  <th>Asset Code</th>
                  <th>Serial Number</th>
                  <th>Asset Type</th>
                  <th>Make</th>
                  <th>Model</th>
                  <th>Assigned User</th>
                  <th>Status</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Warranty Status</th>
                  <th>Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssets.map((asset) => (
                  <tr key={asset.id}>
                    <td>{asset.asset_code}</td>
                    <td>{asset.serial_number}</td>
                    <td>{asset.asset_type}</td>
                    <td>{asset.make}</td>
                    <td>{asset.model}</td>
                    <td>{asset.user_name || 'N/A'}</td>
                    <td>{asset.status}</td>
                    <td>{asset.category_name || 'N/A'}</td>
                    <td>{asset.location_name || 'N/A'}</td>
                    <td>{asset.warranty_status}</td>
                    <td>{formatDate(asset.expiry_date)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

// Main App component
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState('assets');
  const [backendMessage, setBackendMessage] = useState('');
  const [assetLoadError, setAssetLoadError] = useState('');

  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
    setCurrentPage('assets');
    fetchBackendStatus();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    setBackendMessage('');
    setAssetLoadError('');
  };

  const fetchBackendStatus = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5000/api/test');
      if (response.ok) {
        const data = await response.json();
        setBackendMessage(data.message);
      } else {
        setBackendMessage('Backend Status: Failed to connect to backend.');
      }
    } catch (error) {
      setBackendMessage(`Backend Status: Error connecting to backend: ${error.message}`);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchBackendStatus();
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <>
      <style>
        {`
        body {
            margin: 0;
            padding: 0;
            overflow-x: hidden; /* Prevent horizontal scroll */
            height: 100%; /* Ensure body takes full height */
            width: 100%; /* Ensure body takes full width */
            font-family: 'Inter', sans-serif;
        }
        html {
            height: 100%; /* Ensure html takes full height */
            width: 100%; /* Ensure html takes full width */
        }
        #root { /* If your React app is mounted to a #root div, ensure it also takes full height and width */
            height: 100%;
            width: 100%;
        }


        .app-container {
          min-height: 100vh; /* Full viewport height */
          width: 100vw;    /* Full viewport width */
          display: flex;
          flex-direction: column;
          background-color: #1a202c;
        }

        .app-header {
          width: 100%; /* Take full width of parent */
          background-color: #2d3748;
          padding: 1.5rem 0; /* Add vertical padding, horizontal is handled by inner content */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border-bottom-left-radius: 0.5rem;
          border-bottom-right-radius: 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center; /* Centers content within header */
          box-sizing: border-box;
        }

        .app-title {
          font-size: 2.25rem;
          font-weight: 800;
          text-align: center;
          color: #60a5fa;
          margin-bottom: 1.5rem;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        @media (min-width: 640px) {
          .app-title {
            font-size: 3rem;
          }
        }

        .nav-menu {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 1rem;
          margin-bottom: 2rem;
          max-width: 80rem; /* Constrain nav to a readable width, centered */
          width: 100%;
          margin-left: auto;
          margin-right: auto;
          padding: 0 1rem; /* Add padding to nav menu itself */
          box-sizing: border-box;
        }

        .nav-button {
          padding: 0.5rem 1.25rem;
          border-radius: 0.375rem;
          font-weight: 600;
          transition: all 0.3s ease-in-out;
          transform: scale(1);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          border: 1px solid;
          cursor: pointer;
          outline: none;
        }

        @media (min-width: 640px) {
          .nav-button {
            padding: 0.75rem 1.5rem;
          }
        }

        .nav-button:hover {
          transform: scale(1.05);
        }

        .nav-button.active {
          background-color: #2563eb;
          color: #fff;
          border-color: #1d4ed8;
        }

        .nav-button.inactive {
          background-color: #4b5563;
          color: #d1d5db;
          border-color: #4b5563;
        }

        .nav-button.inactive:hover {
          background-color: #374151;
          border-color: #374151;
        }

        .logout-button {
          background-color: #dc2626;
          color: #fff;
          border-color: #b91c1c;
        }

        .logout-button:hover {
          background-color: #b91c1c;
          transform: scale(1.05);
        }

        .backend-message {
          text-align: center;
          font-size: 0.875rem;
          padding-left: 1rem;
          padding-right: 1rem;
          max-width: 80rem; /* Constrain message to a readable width, centered */
          width: 100%;
          margin-left: auto;
          margin-right: auto;
          margin-bottom: 1rem;
          box-sizing: border-box;
        }

        @media (min-width: 640px) {
          .backend-message {
            font-size: 1rem;
          }
        }

        .backend-message-success {
          color: #4ade80;
          font-weight: 500;
        }

        .backend-message-error {
          color: #f87171;
          font-weight: 500;
        }

        .main-content {
          flex-grow: 1; /* Allows main content to fill available vertical space */
          width: 100%; /* Take full width of parent (app-container) */
          padding: 1rem 0; /* Vertical padding only, horizontal padding handled by content-area-wrapper */
          display: flex; /* Use flexbox to center its children */
          justify-content: center; /* Center horizontally */
          align-items: flex-start; /* Align children to the start vertically */
          box-sizing: border-box;
        }

        @media (min-width: 640px) {
          .main-content {
            padding: 2rem 0;
          }
        }

        .asset-load-error {
          color: #f87171;
          text-align: center;
          margin-top: 1rem;
          max-width: 80rem; /* Ensure this message is also readable */
          width: 100%;
          margin-left: auto;
          margin-right: auto;
          box-sizing: border-box;
          padding: 0 1rem;
        }

        .app-footer {
          width: 100%; /* Take full width of parent */
          background-color: #2d3748;
          padding: 1rem 0; /* Only vertical padding here */
          text-align: center;
          color: #a0aec0;
          border-top-left-radius: 0.5rem;
          border-top-right-radius: 0.5rem;
          margin-top: auto; /* Pushes footer to the bottom */
          box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
          box-sizing: border-box;
          display: flex; /* Use flexbox to center content horizontally */
          justify-content: center;
          align-items: center;
        }
        .app-footer p {
            max-width: 80rem; /* Constrain footer text width */
            width: 100%;
            margin-left: auto;
            margin-right: auto;
            padding: 0 1rem; /* Add padding to footer text */
            box-sizing: border-box;
        }
        `}
      </style>

      <div className="app-container">
        {/* Header section: Now spans full width, content centered inside */}
        <header className="app-header">
          <h1 className="app-title">AssetFlow</h1>
          
          <nav className="nav-menu">
            {['Assets', 'Users', 'Scrap/Disposal', 'Warranty Alerts', 'Reports'].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page.toLowerCase().replace('/', '_').replace(' ', '_'))}
                className={`nav-button ${currentPage === page.toLowerCase().replace('/', '_').replace(' ', '_') ? 'active' : 'inactive'}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={handleLogout}
              className="nav-button logout-button"
            >
              Logout
            </button>
          </nav>
          
          {backendMessage && (
            <p className="backend-message">
              {backendMessage.includes('successful') ? (
                <span className="backend-message-success">{backendMessage}</span>
              ) : (
                <span className="backend-message-error">{backendMessage}</span>
              )}
            </p>
          )}
        </header>

        {/* Main content area: Render actual components based on currentPage */}
        <main className="main-content">
          {currentPage === 'assets' && <AssetsPage setAssetLoadError={setAssetLoadError} />}
          {currentPage === 'users' && <UsersPage />}
          {currentPage === 'scrap_disposal' && <ScrapDisposalPage />}
          {currentPage === 'warranty_alerts' && <WarrantyAlertsPage />}
          {currentPage === 'reports' && <ReportsPage />}

          {assetLoadError && (
            <p className="asset-load-error">{assetLoadError}</p>
          )}
        </main>

        <footer className="app-footer">
          <p>&copy; 2025 AssetFlow. All rights reserved. Designed with ❤️</p>
        </footer>
      </div>
    </>
  );
}

export default App;
