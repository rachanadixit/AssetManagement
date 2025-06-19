// frontend/src/components/UserForm.jsx

import React, { useState, useEffect } from 'react';

function UserForm({ onSave, onCancel, initialData = {} }) {
  const [formData, setFormData] = useState({
    emp_id: '',
    emp_code: '',
    name: '',
    email: '',
    role: 'Employee',
    department: '',
    division: '',
    join_date: '',
    status: 'Active',
    location: '',
    phone_number: '',
    designation: '',
    reporting_manager: '',
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
    <div className="bg-white p-8 rounded-xl shadow-lg border border-blue-100 max-w-2xl mx-auto">
      <h3 className="text-3xl font-bold text-gray-800 mb-8 text-center">{initialData.id ? 'Edit User' : 'Add New User'}</h3>
      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-4" role="alert"> {/* Rounded error box */}
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {submitError}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6"> {/* Increased gaps */}
        {/* Employee ID */}
        <div>
          <label htmlFor="emp_id" className="block text-sm font-semibold text-gray-700 mb-1">Employee ID <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="emp_id"
            id="emp_id"
            value={formData.emp_id}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5"
          />
        </div>

        {/* Employee Code (New) */}
        <div>
          <label htmlFor="emp_code" className="block text-sm font-semibold text-gray-700 mb-1">Employee Code <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="emp_code"
            id="emp_code"
            value={formData.emp_code}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5"
          />
        </div>

        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5"
          />
        </div>

        {/* Department (New) */}
        <div>
          <label htmlFor="department" className="block text-sm font-semibold text-gray-700 mb-1">Department</label>
          <input
            type="text"
            name="department"
            id="department"
            value={formData.department}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5"
          />
        </div>

        {/* Division (New) */}
        <div>
          <label htmlFor="division" className="block text-sm font-semibold text-gray-700 mb-1">Division</label>
          <input
            type="text"
            name="division"
            id="division"
            value={formData.division}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5"
          />
        </div>

        {/* Join Date (New) */}
        <div>
          <label htmlFor="join_date" className="block text-sm font-semibold text-gray-700 mb-1">Join Date</label>
          <input
            type="date"
            name="join_date"
            id="join_date"
            value={formData.join_date}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5"
          />
        </div>

        {/* Status (New) */}
        <div>
          <label htmlFor="status" className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
          <select
            name="status"
            id="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>

        {/* Location (New) */}
        <div>
          <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5"
          />
        </div>

        {/* Phone Number (New) */}
        <div>
          <label htmlFor="phone_number" className="block text-sm font-semibold text-gray-700 mb-1">Phone Number</label>
          <input
            type="text"
            name="phone_number"
            id="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5"
          />
        </div>

        {/* Designation (New) */}
        <div>
          <label htmlFor="designation" className="block text-sm font-semibold text-gray-700 mb-1">Designation</label>
          <input
            type="text"
            name="designation"
            id="designation"
            value={formData.designation}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5"
          />
        </div>

        {/* Reporting Manager (New) */}
        <div>
          <label htmlFor="reporting_manager" className="block text-sm font-semibold text-gray-700 mb-1">Reporting Manager</label>
          <input
            type="text"
            name="reporting_manager"
            id="reporting_manager"
            value={formData.reporting_manager}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5"
          />
        </div>

        {/* Role (Existing but styled) */}
        <div>
          <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
          <select
            name="role"
            id="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5"
          >
            <option value="Employee">Employee</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
          </select>
        </div>


        {/* Form Actions */}
        <div className="md:col-span-2 flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2.5 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {initialData.id ? 'Update User' : 'Add User'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;
