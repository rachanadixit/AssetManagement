import React, { useState, useEffect } from 'react';

function ScrapDisposalPage() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = 'http://localhost:5000'; // Your Flask backend URL

  // Function to fetch assets for scrap/disposal
  const fetchScrapDisposalAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUrl}/api/assets`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // Filter assets to show only 'Pending Scrap Approval' or 'Disposed'
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

  // Function to update an asset's status (e.g., from pending to disposed)
  const handleUpdateStatus = async (assetId, currentStatus) => {
    let newStatus;
    // Using console.log for confirmations instead of window.confirm
    if (currentStatus === 'Pending Scrap Approval') {
      console.log("Confirm: Mark this asset as Disposed?");
      // In a real app, replace with a custom confirmation modal
      const isConfirmed = window.confirm("Mark this asset as Disposed?"); // Temporary for Canvas
      if (!isConfirmed) return;
      newStatus = 'Disposed';
    } else if (currentStatus === 'Disposed') {
      console.log("Confirm: Revert this asset to Active status?");
      // In a real app, replace with a custom confirmation modal
      const isConfirmed = window.confirm("Revert this asset to Active status?"); // Temporary for Canvas
      if (!isConfirmed) return;
      newStatus = 'Active';
    } else {
        console.warn("Invalid current status for update.");
        return;
    }

    try {
      // Fetch the current asset data to ensure we send all required fields for PUT
      const assetResponse = await fetch(`${backendUrl}/api/assets/${assetId}`);
      if (!assetResponse.ok) {
          const errorData = await assetResponse.json();
          throw new Error(`Failed to fetch asset for update: ${assetResponse.status} - ${errorData.error || assetResponse.statusText}`);
      }
      const assetToUpdate = await assetResponse.json();

      // IMPORTANT: Construct the payload with ALL fields the backend expects for a PUT request.
      const payload = {
        asset_code: assetToUpdate.asset_code,
        serial_number: assetToUpdate.serial_number,
        capital_date: assetToUpdate.capital_date ? new Date(assetToUpdate.capital_date).toISOString().split('T')[0] : null,
        year: assetToUpdate.year,
        asset_type: assetToUpdate.asset_type,
        asset_description: assetToUpdate.asset_description,
        make: assetToUpdate.make,
        model: assetToUpdate.model,
        status: newStatus, // This is the updated status
        department: assetToUpdate.department,
        division: assetToUpdate.division,
        plant_code: assetToUpdate.plant_code,
        warranty_status: assetToUpdate.warranty_status,
        expiry_date: assetToUpdate.expiry_date ? new Date(assetToUpdate.expiry_date).toISOString().split('T')[0] : null,
        category_name: assetToUpdate.category_name,
        location_name: assetToUpdate.location_name,
        user_id: assetToUpdate.user_id,
      };

      console.log("Sending PUT payload:", payload); // Log payload to console for debugging

      const response = await fetch(`${backendUrl}/api/assets/${assetId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json(); // Attempt to parse error JSON
        throw new Error(errorData.error || `HTTP error! status: ${response.status} - ${response.statusText}`);
      }

      fetchScrapDisposalAssets(); // Refresh list after update
    } catch (e) {
      console.error("Failed to update asset status:", e);
      setError(`Error updating asset status: ${e.message}`); // Set error state instead of alert
    }
  };

  // Function to delete an asset directly from this page
  const handleDeleteAsset = async (assetId) => {
    console.log("Confirm: Are you sure you want to permanently delete this asset?");
    // In a real app, replace with a custom confirmation modal
    const isConfirmed = window.confirm("Are you sure you want to permanently delete this asset?"); // Temporary for Canvas
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
      fetchScrapDisposalAssets(); // Refresh list after deletion
    } catch (e) {
      console.error("Failed to delete asset:", e);
      setError(`Error deleting asset: ${e.message}`); // Set error state instead of alert
    }
  };


  if (loading) {
    return (
      <div className="scrap-disposal-loading">
        Loading scrap/disposal assets...
      </div>
    );
  }

  if (error) {
    return (
      <div className="scrap-disposal-error">
        {error}
      </div>
    );
  }

  return (
    <>
      <style>
        {`
        .scrap-disposal-container {
          padding: 1rem; /* Equivalent to p-4 */
          max-width: 80rem; /* Consistent max-width for content */
          margin-left: auto;
          margin-right: auto;
          font-family: 'Inter', sans-serif;
          color: #1f2937; /* Default text color */
        }

        @media (min-width: 640px) { /* sm breakpoint */
          .scrap-disposal-container {
            padding: 1.5rem; /* Equivalent to sm:p-6 */
          }
        }

        .scrap-disposal-title {
          font-size: 1.875rem; /* Equivalent to text-3xl */
          font-weight: 700; /* Equivalent to font-bold */
          color: #1f2937; /* Equivalent to text-gray-800 */
          margin-bottom: 1.5rem; /* Equivalent to mb-6 */
          text-align: center;
        }

        .no-assets-message {
          color: #4b5563; /* Equivalent to text-gray-600 */
          text-align: center;
          padding: 2rem 0; /* Equivalent to py-8 */
        }

        .assets-table-wrapper {
          overflow-x: auto;
          background-color: #fff; /* Equivalent to bg-white */
          border-radius: 0.5rem; /* Equivalent to rounded-lg */
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* Equivalent to shadow-md */
          border: 1px solid #e5e7eb; /* Equivalent to border border-gray-200 */
        }

        .assets-table {
          min-width: 100%;
          border-collapse: collapse;
        }

        .assets-table thead {
          background-color: #eff6ff; /* Equivalent to bg-blue-50 */
        }

        .assets-table th {
          padding: 0.75rem 1.5rem; /* Equivalent to px-6 py-3 */
          text-align: left;
          font-size: 0.75rem; /* Equivalent to text-xs */
          font-weight: 500; /* Equivalent to font-medium */
          color: #1d4ed8; /* Equivalent to text-blue-700 */
          text-transform: uppercase;
          letter-spacing: 0.05em; /* Equivalent to tracking-wider */
          border-bottom: 1px solid #e5e7eb; /* For divide-y */
        }

        .assets-table tbody {
          background-color: #fff;
        }

        .assets-table tr {
          border-bottom: 1px solid #e5e7eb; /* For divide-y */
        }

        .assets-table tr:nth-child(even) {
          background-color: #f9fafb; /* Equivalent to bg-gray-50 for zebra striping */
        }

        .assets-table tr:hover {
          background-color: #e0f2fe; /* Equivalent to hover:bg-blue-50 */
          transition: background-color 0.15s ease-in-out;
        }

        .assets-table td {
          padding: 1rem 1.5rem; /* Equivalent to px-6 py-4 */
          white-space: nowrap;
          font-size: 0.875rem; /* Equivalent to text-sm */
          color: #374151; /* Equivalent to text-gray-700 */
        }

        .assets-table td:first-child {
          font-weight: 500; /* Equivalent to font-medium */
          color: #111827; /* Equivalent to text-gray-900 */
        }

        .assets-table td:last-child {
          text-align: right;
          font-weight: 500;
        }

        /* Status Badge */
        .status-badge {
          padding: 0.25rem 0.5rem; /* Equivalent to px-2 inline-flex text-xs */
          display: inline-flex;
          font-size: 0.75rem; /* Equivalent to text-xs */
          line-height: 1.25rem; /* Equivalent to leading-5 */
          font-weight: 600; /* Equivalent to font-semibold */
          border-radius: 9999px; /* Equivalent to rounded-full */
        }

        .status-badge-disposed {
          background-color: #e5e7eb; /* Equivalent to bg-gray-200 */
          color: #374151; /* Equivalent to text-gray-800 */
        }

        .status-badge-pending {
          background-color: #fefcbf; /* Equivalent to bg-yellow-100 */
          color: #92400e; /* Equivalent to text-yellow-800 */
        }

        /* Action Buttons */
        .action-button-base {
          font-weight: 600; /* Equivalent to font-semibold */
          cursor: pointer;
          border: none;
          background: none;
          padding: 0;
          margin: 0;
          text-decoration: none;
          transition: color 0.15s ease-in-out;
        }

        .action-button-mark {
          color: #2563eb; /* Equivalent to text-blue-600 */
          margin-right: 1rem; /* Equivalent to mr-4 */
        }

        .action-button-mark:hover {
          color: #1e40af; /* Equivalent to hover:text-blue-800 */
          text-decoration: underline;
        }

        .action-button-mark:disabled {
          color: #6b7280; /* Equivalent to text-gray-500 */
          cursor: not-allowed;
        }

        .action-button-delete {
          color: #dc2626; /* Equivalent to text-red-600 */
        }

        .action-button-delete:hover {
          color: #991b1b; /* Equivalent to hover:text-red-800 */
          text-decoration: underline;
        }

        .scrap-disposal-loading, .scrap-disposal-error {
          text-align: center;
          padding: 1.5rem;
          color: #4b5563;
        }

        .scrap-disposal-error {
          color: #dc2626;
          font-weight: 700;
        }
        `}
      </style>

      <div className="scrap-disposal-container">
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
    </>
  );
}

export default ScrapDisposalPage;
