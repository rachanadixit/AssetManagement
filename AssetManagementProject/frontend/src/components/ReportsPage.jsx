import React, { useState, useEffect, useMemo } from 'react';
// These imports are correct and will work once Recharts is installed via npm/yarn
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

function ReportsPage() {
  const [allAssets, setAllAssets] = useState([]); // Store all fetched assets
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterLocation, setFilterLocation] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterWarrantyStatus, setFilterWarrantyStatus] = useState('');
  const [filterExpiryDateRange, setFilterExpiryDateRange] = useState(''); // e.g., 'expired', 'expiring_30_days', 'all'

  // Options for filters (fetched or derived)
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);

  const backendUrl = 'http://localhost:5000'; // Your Flask backend URL

  // Helper function to format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Function to check if a warranty expires within a certain number of days
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

  // Function to check if a warranty has already expired
  const hasExpired = (expiryDateString) => {
    if (!expiryDateString) return false;
    const expiryDate = new Date(expiryDateString);
    const today = new Date();
    expiryDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return expiryDate < today;
  };

  // Fetch all assets and filter options on component mount
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const assetsRes = await fetch(`${backendUrl}/api/assets`);
        if (!assetsRes.ok) throw new Error(`HTTP error! Assets status: ${assetsRes.status}`);
        const assetsData = await assetsRes.json();
        setAllAssets(assetsData);

        // Extract unique categories, locations, and users for filter dropdowns
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
  }, []); // Run only once on mount

  // Memoized filtered assets based on all filter states
  const filteredAssets = useMemo(() => {
    let tempAssets = allAssets;

    // Apply general search term
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

    // Apply status filter
    if (filterStatus) {
      tempAssets = tempAssets.filter(asset => asset.status === filterStatus);
    }

    // Apply category filter
    if (filterCategory) {
      tempAssets = tempAssets.filter(asset => asset.category_name === filterCategory);
    }

    // Apply location filter
    if (filterLocation) {
      tempAssets = tempAssets.filter(asset => asset.location_name === filterLocation);
    }

    // Apply user filter
    if (filterUser) {
      // Handle "Not Assigned" (user_id is null) specifically
      if (filterUser === 'null') {
        tempAssets = tempAssets.filter(asset => asset.user_id === null);
      } else {
        tempAssets = tempAssets.filter(asset => String(asset.user_id) === filterUser);
      }
    }

    // Apply warranty status filter
    if (filterWarrantyStatus) {
      tempAssets = tempAssets.filter(asset => asset.warranty_status === filterWarrantyStatus);
    }

    // Apply expiry date range filter
    if (filterExpiryDateRange) {
      if (filterExpiryDateRange === 'expired') {
        tempAssets = tempAssets.filter(asset => hasExpired(asset.expiry_date));
      } else if (filterExpiryDateRange === 'expiring_30_days') {
        tempAssets = tempAssets.filter(asset => isExpiringSoon(asset.expiry_date, 30) && !hasExpired(asset.expiry_date));
      } else if (filterExpiryDateRange === 'not_expiring_soon') {
        tempAssets = tempAssets.filter(asset => !isExpiringSoon(asset.expiry_date, 30) && !hasExpired(asset.expiry_date));
      }
    }

    return tempAssets;
  }, [allAssets, searchTerm, filterStatus, filterCategory, filterLocation, filterUser, filterWarrantyStatus, filterExpiryDateRange]);

  // Memoized summary statistics
  const summaryStats = useMemo(() => {
    const totalAssets = allAssets.length;
    const assignedAssets = allAssets.filter(asset => asset.user_id !== null).length;
    const notAssignedAssets = totalAssets - assignedAssets;
    const expiredAssets = allAssets.filter(asset => hasExpired(asset.expiry_date)).length;
    const expiringSoonAssets = allAssets.filter(asset => isExpiringSoon(asset.expiry_date, 30) && !hasExpired(asset.expiry_date)).length; // Exclude already expired

    return {
      totalAssets,
      assignedAssets,
      notAssignedAssets,
      expiredAssets,
      expiringSoonAssets,
    };
  }, [allAssets]);

  // Data for Pie Chart (Assets by Status)
  const assetsByStatusData = useMemo(() => {
    const counts = {};
    allAssets.forEach(asset => {
      counts[asset.status] = (counts[asset.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [allAssets]);

  // Colors for the Pie Chart slices
  const PIE_COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0054']; // More colors can be added

  // Data for Bar Chart (Assets by Category)
  const assetsByCategoryData = useMemo(() => {
    const counts = {};
    allAssets.forEach(asset => {
      const categoryName = asset.category_name || 'Uncategorized';
      counts[categoryName] = (counts[categoryName] || 0) + 1;
    });
    // Convert to array of objects, useful for BarChart
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [allAssets]);


  // Function to handle CSV download
  const handleDownloadReport = () => {
    if (filteredAssets.length === 0) {
      console.warn("No data to download. Please apply filters that yield results.");
      // You can add a custom modal here if you want a visible notification
      return;
    }

    // Define CSV headers (order matters for the CSV columns)
    const headers = [
      'Asset Code', 'Serial Number', 'Asset Type', 'Make', 'Model',
      'Assigned User', 'Status', 'Category', 'Location', 'Warranty Status', 'Expiry Date',
      'Capital Date', 'Year', 'Asset Description', 'Department', 'Division', 'Plant Code'
    ];

    // Map the filtered assets to an array of arrays (rows) for CSV, ensuring correct order and formatting
    const csvRows = filteredAssets.map(asset => [
      `"${asset.asset_code || ''}"`, // Enclose in quotes to handle commas
      `"${asset.serial_number || ''}"`,
      `"${asset.asset_type || ''}"`,
      `"${asset.make || ''}"`,
      `"${asset.model || ''}"`,
      `"${asset.user_name || 'N/A'}"`,
      `"${asset.status || ''}"`,
      `"${asset.category_name || 'N/A'}"`,
      `"${asset.location_name || 'N/A'}"`,
      `"${asset.warranty_status || ''}"`,
      `"${formatDate(asset.expiry_date) || 'N/A'}"`, // Use formatDate helper
      `"${formatDate(asset.capital_date) || 'N/A'}"`,
      `"${asset.year || ''}"`,
      `"${asset.asset_description || ''}"`,
      `"${asset.department || ''}"`,
      `"${asset.division || ''}"`,
      `"${asset.plant_code || ''}"`
    ].join(',')); // Join each row's values with a comma

    // Combine headers and rows
    const csvContent = [
      headers.map(header => `"${header}"`).join(','), // Quote headers too
      ...csvRows
    ].join('\n'); // Join all rows with a newline

    // Create a Blob and URL for download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'asset_report.csv'); // Default filename
    document.body.appendChild(link); // Append to body to make it clickable
    link.click(); // Programmatically click the link
    document.body.removeChild(link); // Clean up the URL object after download
  };


  if (loading) {
    return (
      <div className="reports-loading-message">
        Loading data for reports...
      </div>
    );
  }

  if (error) {
    return (
      <div className="reports-error-message">
        {error}
      </div>
    );
  }

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

export default ReportsPage;
