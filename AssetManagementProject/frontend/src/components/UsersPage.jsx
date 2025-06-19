// frontend/src/components/UsersPage.jsx

import React, { useState, useEffect } from 'react';
import UserForm from './UserForm'; // Import the UserForm component

function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const [userToEdit, setUserToEdit] = useState(null); // State to hold user data if editing

  const backendUrl = 'http://localhost:5000'; // Your Flask backend URL

  // Function to fetch users from the backend
  const fetchUsers = async () => {
    setLoading(true); // Set loading to true before fetching
    setError(null);   // Clear previous errors
    try {
      const response = await fetch(`${backendUrl}/api/users`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsers(data);
    } catch (e) {
      console.error("Failed to fetch users:", e);
      setError("Failed to load users. Please check the backend server.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect Hook to fetch users when the component loads
  useEffect(() => {
    fetchUsers();
  }, []); // Empty dependency array means this effect runs only once on component mount

  // Function to handle "Add New User" button click
  const handleAddUser = () => {
    setUserToEdit({}); // Pass an empty object for new user creation
    setShowForm(true); // Show the form
  };

  // Function to handle "Edit" button click
  const handleEditUser = (user) => {
    setUserToEdit(user); // Set the user data to pre-fill the form
    setShowForm(true); // Show the form
  };

  // Function to handle "Delete" button click
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return; // User cancelled
    }
    try {
      const response = await fetch(`${backendUrl}/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      // If deletion is successful, refresh the user list
      fetchUsers(); // Re-fetch users to update the table
    } catch (e) {
      console.error("Failed to delete user:", e);
      alert(`Error deleting user: ${e.message}`); // Using alert for now, will replace with custom modal later
    }
  };

  // Function called after form submission (add/update)
  const handleFormSave = () => {
    setShowForm(false); // Hide the form
    setUserToEdit(null); // Clear editing data
    fetchUsers(); // Refresh the user list to show new/updated data
  };

  // Function to handle form cancellation
  const handleFormCancel = () => {
    setShowForm(false); // Hide the form
    setUserToEdit(null); // Clear any editing data
  };

  if (loading && !showForm) {
    return <div className="text-center p-6 text-gray-600">Loading users...</div>;
  }

  if (error && !showForm) {
    return <div className="text-center p-6 text-red-600 font-bold">{error}</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">User List</h2>

      {showForm ? (
        <UserForm
          onSave={handleFormSave}
          onCancel={handleFormCancel}
          initialData={userToEdit} // Pass data if editing, will be {} for new user
        />
      ) : (
        <>
          <button
            onClick={handleAddUser}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg mb-8 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Add New User
          </button>

          {users.length === 0 ? (
            <p className="text-gray-600 text-center py-8">No users found. Add some users to get started!</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-blue-100"> {/* Stronger shadow, blue border */}
              <table className="min-w-full divide-y divide-blue-200"> {/* Blue divider */}
                <thead className="bg-blue-50"> {/* Light blue header */}
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Employee ID</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Employee Code</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Department</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Division</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Join Date</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Phone Number</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Designation</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Reporting Manager</th>
                    <th className="px-6 py-3 text-left text-xs font-semibold text-blue-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user, index) => (
                    <tr key={user.id} className={`${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition duration-150 ease-in-out`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.emp_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.emp_code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.department}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.division}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.join_date || 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.location}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.phone_number}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.designation}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.reporting_manager}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600 hover:text-blue-800 mr-4 font-semibold hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600 hover:text-red-800 font-semibold hover:underline"
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
        </>
      )}
    </div>
  );
}

export default UsersPage;
