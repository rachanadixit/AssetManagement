import React, { useState, useEffect } from 'react';

// Destructure initialData and provide a default empty object if it's null/undefined
function AssetForm({ onSave, onCancel, initialData = {} }) {
  // State to hold the form data
  const [formData, setFormData] = useState({
    asset_code: '',
    serial_number: '',
    capital_date: '',
    year: '',
    asset_type: '',
    asset_description: '',
    make: '',
    model: '',
    status: 'Active', // Default status
    department: '',
    division: '',
    plant_code: '',
    warranty_status: 'In Warranty', // Default warranty status
    expiry_date: '',
    category_name: '', // This MUST be a text input
    location_name: '', // This MUST be a text input
    user_id: '', // Will be selected from dropdown (optional)
  });

  const [users, setUsers] = useState([]); // Still need users for dropdown
  const [loadingUsers, setLoadingUsers] = useState(true); // Separate loading for users
  const [error, setError] = useState(null); // General error for form loading
  const [submitError, setSubmitError] = useState(null); // For errors during form submission

  const backendUrl = 'http://localhost:5000'; // Your Flask backend URL

  // Effect to fetch users when the form loads, and set initial data
  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const usersRes = await fetch(`${backendUrl}/api/users`);
        if (!usersRes.ok) throw new Error(`HTTP error! Users status: ${usersRes.status}`);
        const usersData = await usersRes.json();
        setUsers(usersData);

        // Pre-fill form data from initialData (for editing)
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
            category_name: '', // Default empty
            location_name: '', // Default empty
            user_id: '',
            ...initialData // Merge initialData
        };

        // Format dates for input type="date"
        if (initialFormState.capital_date) {
            initialFormState.capital_date = initialFormState.capital_date.split('T')[0]; // Already ISO string from backend
        }
        if (initialFormState.expiry_date) {
            initialFormState.expiry_date = initialFormState.expiry_date.split('T')[0]; // Already ISO string from backend
        }

        // Set category and location names from initialData if editing (which now come from backend GET)
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
  }, [initialData]); // Re-run if initialData changes (e.g., when switching from Add to Edit)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default browser form submission
    setSubmitError(null); // Clear previous errors

    try {
      // Determine if it's an update (PUT) or add (POST) operation
      const method = initialData.id ? 'PUT' : 'POST';
      const url = initialData.id ? `${backendUrl}/api/assets/${initialData.id}` : `${backendUrl}/api/assets`;

      // Convert date strings to ISO-MM-DD format or null if empty
      const dataToSend = { ...formData };
      if (dataToSend.capital_date) {
        dataToSend.capital_date = dataToSend.capital_date === '' ? null : dataToSend.capital_date; // Already ISO-MM-DD
      } else {
          dataToSend.capital_date = null;
      }
      if (dataToSend.expiry_date) {
        dataToSend.expiry_date = dataToSend.expiry_date === '' ? null : dataToSend.expiry_date; // Already ISO-MM-DD
      } else {
          dataToSend.expiry_date = null;
      }

      // Ensure year is integer or null
      if (dataToSend.year) {
        dataToSend.year = parseInt(dataToSend.year);
      } else {
        dataToSend.year = null;
      }

      // Ensure user_id is integer or null
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

      onSave(); // Call the onSave function passed from parent (AssetsPage)
    } catch (e) {
      console.error("AssetForm: Failed to save asset:", e);
      setSubmitError(e.message || "An unexpected error occurred during submission.");
    }
  };

  if (loadingUsers) {
    return (
      <div className="asset-form-loading">
        Loading form data...
      </div>
    );
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
          align-items: flex-start; /* Align to the top within the flex container */
          padding: 2rem; /* Equivalent to p-8 */
          width: 100%;
          box-sizing: border-box;
          min-height: calc(100vh - 12rem); /* Adjust based on header/footer height in App.jsx */
        }

        .asset-form-container {
          background-color: #fff; /* Equivalent to bg-white */
          padding: 2rem; /* Equivalent to p-8 */
          border-radius: 0.75rem; /* Equivalent to rounded-xl */
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* Equivalent to shadow-lg */
          border: 1px solid #bfdbfe; /* Equivalent to border border-blue-100 */
          max-width: 56rem; /* Equivalent to max-w-4xl */
          width: 100%; /* Ensure it takes full width up to max-width */
          box-sizing: border-box;
          font-family: 'Inter', sans-serif;
        }

        .asset-form-title {
          font-size: 1.875rem; /* Equivalent to text-3xl */
          font-weight: 700; /* Equivalent to font-bold */
          color: #1f2937; /* Equivalent to text-gray-800 */
          margin-bottom: 2rem; /* Equivalent to mb-8 */
          text-align: center;
        }

        .asset-form-error-box {
          background-color: #fee2e2; /* Equivalent to bg-red-100 */
          border: 1px solid #f87171; /* Equivalent to border border-red-400 */
          color: #b91c1c; /* Equivalent to text-red-700 */
          padding: 0.75rem 1rem; /* Equivalent to px-4 py-3 */
          border-radius: 0.5rem; /* Equivalent to rounded-lg */
          position: relative;
          margin-bottom: 1rem; /* Equivalent to mb-4 */
        }

        .asset-form-grid {
          display: grid;
          grid-template-columns: 1fr; /* Default for mobile */
          column-gap: 2rem; /* Equivalent to gap-x-8 */
          row-gap: 1.5rem; /* Equivalent to gap-y-6 */
        }

        @media (min-width: 768px) { /* md breakpoint for Tailwind */
          .asset-form-grid {
            grid-template-columns: 1fr 1fr;
          }
          .asset-form-actions {
            grid-column: span 2 / span 2; /* Equivalent to md:col-span-2 */
          }
        }

        .form-field {
          /* No specific styles needed here, labels and inputs handle it */
        }

        .form-label {
          display: block;
          font-size: 0.875rem; /* Equivalent to text-sm */
          font-weight: 600; /* Equivalent to font-semibold */
          color: #374151; /* Equivalent to text-gray-700 */
          margin-bottom: 0.25rem; /* Equivalent to mb-1 */
        }

        .required-star {
          color: #ef4444; /* Equivalent to text-red-500 */
        }

        .form-input, .form-select, .form-textarea {
          margin-top: 0.25rem; /* Equivalent to mt-1 */
          display: block;
          width: 100%;
          border-radius: 0.375rem; /* Equivalent to rounded-md */
          border: 1px solid #d1d5db; /* Equivalent to border-gray-300 */
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* Equivalent to shadow-sm */
          padding: 0.625rem; /* Equivalent to p-2.5 */
          font-size: 0.875rem; /* Equivalent to sm:text-sm */
          box-sizing: border-box; /* Include padding and border in width */
          outline: none; /* Remove default outline */
          transition: border-color 0.2s, box-shadow 0.2s; /* Smooth transitions for focus */
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          border-color: #3b82f6; /* Equivalent to focus:border-blue-500 */
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5); /* Equivalent to focus:ring-blue-500 */
        }

        .asset-form-actions {
          display: flex;
          justify-content: flex-end;
          gap: 1rem; /* Equivalent to space-x-4 */
          margin-top: 2rem; /* Equivalent to mt-8 */
        }

        .button-cancel, .button-submit {
          font-weight: 700; /* Equivalent to font-bold */
          padding: 0.625rem 1.25rem; /* Equivalent to py-2.5 px-5 */
          border-radius: 0.5rem; /* Equivalent to rounded-lg */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* Equivalent to shadow-md */
          transition: all 0.3s ease-in-out; /* Equivalent to transition duration-300 ease-in-out */
          transform: scale(1); /* Initial state for hover effect */
          outline: none; /* Remove default outline */
          border: none; /* Remove default border */
          cursor: pointer;
        }

        .button-cancel {
          background-color: #d1d5db; /* Equivalent to bg-gray-300 */
          color: #1f2937; /* Equivalent to text-gray-800 */
        }
        .button-cancel:hover {
          background-color: #9ca3af; /* Equivalent to hover:bg-gray-400 */
          transform: scale(1.05); /* Equivalent to hover:scale-105 */
        }
        .button-cancel:focus {
          box-shadow: 0 0 0 2px rgba(209, 213, 219, 0.5); /* Equivalent to focus:ring-2 focus:ring-gray-300 */
        }

        .button-submit {
          background-color: #3b82f6; /* Equivalent to bg-blue-600 */
          color: #fff; /* Equivalent to text-white */
        }
        .button-submit:hover {
          background-color: #2563eb; /* Equivalent to hover:bg-blue-700 */
          transform: scale(1.05); /* Equivalent to hover:scale-105 */
        }
        .button-submit:focus {
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5); /* Equivalent to focus:ring-2 focus:ring-blue-500 */
        }
        `}
      </style>

      {/* Main wrapper for centering the form */}
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
            {/* Asset Code */}
            <div className="form-field">
              <label htmlFor="asset_code" className="form-label">Asset Code <span className="required-star">*</span></label>
              <input
                type="text"
                name="asset_code"
                id="asset_code"
                value={formData.asset_code}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            {/* Serial Number */}
            <div className="form-field">
              <label htmlFor="serial_number" className="form-label">Serial Number <span className="required-star">*</span></label>
              <input
                type="text"
                name="serial_number"
                id="serial_number"
                value={formData.serial_number}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            {/* Capital Date */}
            <div className="form-field">
              <label htmlFor="capital_date" className="form-label">Capital Date</label>
              <input
                type="date"
                name="capital_date"
                id="capital_date"
                value={formData.capital_date}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Year */}
            <div className="form-field">
              <label htmlFor="year" className="form-label">Year</label>
              <input
                type="number"
                name="year"
                id="year"
                value={formData.year}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Asset Type */}
            <div className="form-field">
              <label htmlFor="asset_type" className="form-label">Asset Type</label>
              <input
                type="text"
                name="asset_type"
                id="asset_type"
                value={formData.asset_type}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Asset Description */}
            <div className="form-field">
              <label htmlFor="asset_description" className="form-label">Asset Description</label>
              <textarea
                name="asset_description"
                id="asset_description"
                value={formData.asset_description}
                onChange={handleChange}
                rows="2"
                className="form-textarea"
              ></textarea>
            </div>

            {/* Make */}
            <div className="form-field">
              <label htmlFor="make" className="form-label">Make</label>
              <input
                type="text"
                name="make"
                id="make"
                value={formData.make}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Model */}
            <div className="form-field">
              <label htmlFor="model" className="form-label">Model</label>
              <input
                type="text"
                name="model"
                id="model"
                value={formData.model}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Status */}
            <div className="form-field">
              <label htmlFor="status" className="form-label">Status</label>
              <select
                name="status"
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Active">Active</option>
                <option value="In Repair">In Repair</option>
                <option value="Pending Scrap Approval">Pending Scrap Approval</option>
                <option value="Disposed">Disposed</option>
              </select>
            </div>

            {/* Department */}
            <div className="form-field">
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

            {/* Division */}
            <div className="form-field">
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

            {/* Plant Code */}
            <div className="form-field">
              <label htmlFor="plant_code" className="form-label">Plant Code</label>
              <input
                type="text"
                name="plant_code"
                id="plant_code"
                value={formData.plant_code}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Warranty Status */}
            <div className="form-field">
              <label htmlFor="warranty_status" className="form-label">Warranty Status</label>
              <select
                name="warranty_status"
                id="warranty_status"
                value={formData.warranty_status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="In Warranty">In Warranty</option>
                <option value="Out of Warranty">Out of Warranty</option>
              </select>
            </div>

            {/* Expiry Date */}
            <div className="form-field">
              <label htmlFor="expiry_date" className="form-label">Expiry Date</label>
              <input
                type="date"
                name="expiry_date"
                id="expiry_date"
                value={formData.expiry_date}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            {/* Category Name (Text Input) */}
            <div className="form-field">
              <label htmlFor="category_name" className="form-label">Category <span className="required-star">*</span></label>
              <input
                type="text"
                name="category_name"
                id="category_name"
                value={formData.category_name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="e.g., Laptop, Desktop"
              />
            </div>

            {/* Location Name (Text Input) */}
            <div className="form-field">
              <label htmlFor="location_name" className="form-label">Location <span className="required-star">*</span></label>
              <input
                type="text"
                name="location_name"
                id="location_name"
                value={formData.location_name}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="e.g., Main Office - Floor 1"
              />
            </div>

            {/* User Dropdown (Optional) */}
            <div className="form-field">
              <label htmlFor="user_id" className="form-label">Assigned User (Optional)</label>
              <select
                name="user_id"
                id="user_id"
                value={formData.user_id || ''} // Handle null for initial selection
                onChange={handleChange}
                className="form-select"
              >
                <option value="">None</option> {/* Option for no assigned user */}
                {users.map(user => (
                  <option key={user.id} value={user.id}>{user.name} ({user.emp_id})</option>
                ))}
              </select>
            </div>

            {/* Form Actions */}
            <div className="asset-form-actions">
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
                {initialData.id ? 'Update Asset' : 'Add Asset'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AssetForm;
