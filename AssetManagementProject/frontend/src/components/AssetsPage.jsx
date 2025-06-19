import React, { useState, useEffect } from 'react';

// Inlined AssetForm component for combined file
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
          min-height: calc(100vh - 12rem); /* Adjusted for potential header/footer */
        }

        .asset-form-container {
          background-color: #fff;
          padding: 2rem;
          border-radius: 0.75rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border: 1px solid #bfdbfe;
          max-width: 56rem;
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
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
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


function AssetsPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [assetToEdit, setAssetToEdit] = useState(null); // State to hold asset data if editing

  const backendUrl = 'http://localhost:5000'; // Your Flask backend URL

  // Function to fetch assets from the backend
  const fetchAssets = async () => {
    setLoading(true); // Set loading to true before fetching
    setError(null);   // Clear previous errors
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
    } finally {
      setLoading(false);
    }
  };

  // useEffect Hook to fetch assets when the component loads
  useEffect(() => {
    fetchAssets();
  }, []); // Empty dependency array means this effect runs only once on component mount

  // Function to handle "Add New Asset" button click
  const handleAddAsset = () => {
    setAssetToEdit({}); // Pass an empty object for new asset creation
    setShowForm(true); // Show the form
  };

  // Function to handle "Edit" button click
  const handleEditAsset = (asset) => {
    setAssetToEdit(asset); // Set the asset data to pre-fill the form
    setShowForm(true); // Show the form
  };

  // Function to handle "Delete" button click
  const handleDeleteAsset = async (assetId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this asset?");

    if (!isConfirmed) {
      return; // User cancelled
    }
    try {
      const response = await fetch(`${backendUrl}/api/assets/${assetId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      fetchAssets(); // Re-fetch assets to update the table
    } catch (e) {
      console.error("Failed to delete asset:", e);
      setError(`Error deleting asset: ${e.message}`);
    }
  };

  // Function called after form submission (add/update)
  const handleFormSave = () => {
    setShowForm(false); // Hide the form
    setAssetToEdit(null); // Clear editing data
    fetchAssets(); // Refresh the asset list to show new/updated data
  };

  // Function to handle form cancellation
  const handleFormCancel = () => {
    setShowForm(false); // Hide the form
    setAssetToEdit(null); // Clear any editing data
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
        /* GLOBAL STYLES - Applied directly here as requested */
        html, body, #root {
          height: 100%;
          margin: 0;
          padding: 0;
          overflow-x: hidden; /* Prevent horizontal scroll */
          overflow-y: auto; /* Allow vertical scroll if content overflows */
          font-family: 'Inter', sans-serif; /* Consistent font */
          background-color: #f8f9fa; /* Light background for the whole app */
          box-sizing: border-box;
        }
        #root {
          display: flex;
          flex-direction: column;
          min-height: 100vh; /* Ensure root fills viewport */
        }
        body {
          line-height: 1.5; /* Improve readability */
        }

        /* ASSETS PAGE SPECIFIC STYLES */
        .assets-page-container {
          flex-grow: 1; /* Allow container to grow and fill available space */
          padding: 2rem; /* Increased padding for better spacing */
          max-width: 90rem; /* Increased max-width for wider tables */
          margin: 0 auto; /* Center the container horizontally */
          width: 100%; /* Ensure it takes full width up to max-width */
          box-sizing: border-box; /* Include padding in element's total width and height */
          display: flex;
          flex-direction: column;
          align-items: center; /* Center content horizontally */
          min-height: 100vh; /* Ensure it takes at least full viewport height */
        }

        @media (min-width: 640px) {
          .assets-page-container {
            padding: 2.5rem;
          }
        }

        .assets-page-title {
          font-size: 2.25rem; /* Larger title */
          font-weight: 700;
          color: #1f2937;
          margin-bottom: 2.5rem; /* More space below title */
          text-align: center;
          width: 100%; /* Ensure title centers properly */
        }

        .add-asset-button {
          background-color: #3b82f6;
          color: #fff;
          font-weight: 700;
          padding: 0.9rem 1.8rem; /* Slightly larger button */
          border-radius: 0.6rem; /* Slightly more rounded corners */
          box-shadow: 0 4px 10px -2px rgba(0, 0, 0, 0.1), 0 2px 6px -1px rgba(0, 0, 0, 0.06);
          margin-bottom: 2.5rem;
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
          transform: translateY(-2px) scale(1.02); /* Slight lift and scale */
          box-shadow: 0 6px 12px -2px rgba(0, 0, 0, 0.15), 0 3px 8px -1px rgba(0, 0, 0, 0.08);
        }

        .add-asset-button:focus {
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.5); /* Thicker focus ring */
        }

        .no-assets-message {
          color: #6b7280; /* Slightly darker grey */
          text-align: center;
          padding-top: 3rem;
          padding-bottom: 3rem;
          font-size: 1.125rem; /* Slightly larger font */
        }

        .assets-table-wrapper {
          overflow-x: auto;
          background-color: #fff;
          border-radius: 0.75rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          border: 1px solid #bfdbfe;
          width: 100%; /* Ensure it takes full width within its container */
        }

        .assets-table {
          width: 100%; /* Full width of its wrapper */
          border-collapse: collapse;
        }

        .assets-table thead {
          background-color: #e0f2fe; /* Lighter blue for header */
        }

        .assets-table th {
          padding: 1rem 1.5rem; /* Increased padding */
          text-align: left;
          font-size: 0.85rem; /* Slightly larger font */
          font-weight: 600;
          color: #1c64f2; /* Deeper blue for header text */
          text-transform: uppercase;
          letter-spacing: 0.05em;
          border-bottom: 2px solid #90cdf4; /* Thicker border */
        }

        .assets-table tbody {
          background-color: #fff;
        }

        .assets-table tr {
          border-bottom: 1px solid #e5e7eb;
        }

        .assets-table tr:nth-child(even) {
          background-color: #f9fafb; /* Very light grey for even rows */
        }

        .assets-table tr:hover {
          background-color: #e3f2fd; /* Light blue on hover */
          transition: background-color 0.2s ease-in-out;
        }

        .assets-table td {
          padding: 1.1rem 1.5rem; /* Increased padding */
          white-space: nowrap;
          font-size: 0.9rem; /* Slightly larger font */
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
          padding: 0.4rem 0.6rem; /* Add some padding for clickability */
          margin: 0 0.2rem; /* Small margin between buttons */
          border-radius: 0.3rem; /* Slightly rounded for button feel */
          text-decoration: none;
          transition: all 0.15s ease-in-out;
          outline: none;
        }

        .edit-button {
          color: #2563eb;
        }

        .edit-button:hover {
          color: #1e40af;
          background-color: #e0f2fe; /* Light background on hover */
        }
        .edit-button:focus {
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.3);
        }

        .delete-button {
          color: #dc2626;
        }

        .delete-button:hover {
          color: #991b1b;
          background-color: #fee2e2; /* Light background on hover */
        }
        .delete-button:focus {
          box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.3);
        }

        .assets-page-loading, .assets-page-error {
          text-align: center;
          padding: 3rem;
          color: #4b5563;
          font-size: 1.2rem;
          font-weight: 500;
        }

        .assets-page-error {
          color: #dc2626;
          font-weight: 700;
        }
        `}
      </style>

      {/* The main container for the AssetsPage */}
      <div className="assets-page-container">
        <h2 className="assets-page-title">Asset List</h2>

        {/* Conditionally render the AssetForm or the list/add button */}
        {showForm ? (
          <AssetForm
            onSave={handleFormSave}
            onCancel={handleFormCancel}
            initialData={assetToEdit}
          />
        ) : (
          <>
            <button
              onClick={handleAddAsset}
              className="add-asset-button"
            >
              Add New Asset
            </button>

            {/* Display Assets in a Responsive Table */}
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
          </>
        )}
      </div>
    </>
  );
}

export default AssetsPage;