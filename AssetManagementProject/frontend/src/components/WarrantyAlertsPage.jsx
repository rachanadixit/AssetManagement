// frontend/src/components/WarrantyAlertsPage.jsx

import React, { useState, useEffect } from 'react';

function WarrantyAlertsPage() {
  const [expiringAssets, setExpiringAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const backendUrl = 'http://localhost:5000'; // Your Flask backend URL

  // Function to calculate if a warranty expires within a certain number of days
  const isExpiringSoon = (expiryDateString, daysThreshold = 30) => {
    if (!expiryDateString) {
      return false; // No expiry date, so not expiring soon
    }
    const expiryDate = new Date(expiryDateString);
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + daysThreshold); // Date N days from now

    // Check if expiryDate is in the future or today, and within the next 'daysThreshold'
    return expiryDate >= today && expiryDate <= futureDate;
  };

  // Function to check if a warranty has already expired
  const hasExpired = (expiryDateString) => {
    if (!expiryDateString) {
      return false;
    }
    const expiryDate = new Date(expiryDateString);
    const today = new Date();
    // Set both to start of day to compare dates only
    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return expiryDate < today;
  };


  // Function to fetch assets and filter for expiring ones
  const fetchWarrantyAlerts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${backendUrl}/api/assets`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      const alerts = data.filter(asset => {
        // Only include assets that are not already disposed
        if (asset.status === 'Disposed') {
          return false;
        }
        // Include assets that are expiring soon or have already expired
        return isExpiringSoon(asset.expiry_date, 30) || hasExpired(asset.expiry_date);
      });
      setExpiringAssets(alerts);
    } catch (e) {
      console.error("Failed to fetch warranty alerts:", e);
      setError("Failed to load warranty alerts. Please check the backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarrantyAlerts();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return <div className="text-center p-6 text-gray-600">Loading warranty alerts...</div>;
  }

  if (error) {
    return <div className="text-center p-6 text-red-600 font-bold">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Warranty Alerts</h2>

      {expiringAssets.length === 0 ? (
        <p className="text-gray-600 text-center py-8">No assets with expiring or expired warranties.</p>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow-md border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Asset Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Serial Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Asset Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Assigned User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Warranty Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Expiry Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-blue-700 uppercase tracking-wider">Days Remaining/Overdue</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expiringAssets.map((asset, index) => {
                const expiry = asset.expiry_date ? new Date(asset.expiry_date) : null;
                const today = new Date();
                let daysDiff = 'N/A';
                let rowClass = '';

                if (expiry) {
                  const diffTime = expiry.getTime() - today.getTime();
                  daysDiff = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                  if (daysDiff <= 0) {
                    daysDiff = `${Math.abs(daysDiff)} days overdue`;
                    rowClass = 'bg-red-50 text-red-800'; // Expired: light red background
                  } else if (daysDiff <= 30) {
                    daysDiff = `${daysDiff} days remaining`;
                    rowClass = 'bg-yellow-50 text-yellow-800'; // Expiring soon: light yellow background
                  } else {
                    daysDiff = `${daysDiff} days remaining`; // Should not happen with filter, but for safety
                  }
                }

                return (
                  <tr key={asset.id} className={`${rowClass} ${index % 2 === 0 ? '' : 'bg-gray-50'} hover:bg-blue-50 transition duration-150 ease-in-out`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{asset.asset_code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{asset.serial_number}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{asset.asset_type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{asset.user_name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{asset.warranty_status}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{formatDate(asset.expiry_date)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold">
                      {daysDiff}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default WarrantyAlertsPage;
