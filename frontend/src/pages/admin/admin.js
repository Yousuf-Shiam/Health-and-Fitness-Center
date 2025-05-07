import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';
import AdminNavBar from './adminNavBar';
import Footer from '../../components/Footer';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminName, setAdminName] = useState('');
  const [users, setUsers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState(''); // Search query state
  const [visibleSections, setVisibleSections] = useState({
    users: false,
    programs: false,
    bookings: false,
  }); // Collapsible sections state

  useEffect(() => {
    const fetchAdminDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in as an admin to access this page.');
        navigate('/admin-login');
        return;
      }

      try {
        const decodedToken = jwtDecode(token);

        if (decodedToken.role !== 'admin') {
          alert('Unauthorized access! You do not have admin privileges.');
          navigate('/admin-login');
          return;
        }

        setAdminName(decodedToken.name);

        setLoading(true);

        // Fetch all users
        const usersResponse = await fetch('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }

        const usersData = await usersResponse.json();
        setUsers(Array.isArray(usersData) ? usersData : []);

        // Fetch all programs
        const programsResponse = await fetch('http://localhost:5000/api/programs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!programsResponse.ok) {
          throw new Error('Failed to fetch programs');
        }

        const programsData = await programsResponse.json();
        setPrograms(Array.isArray(programsData) ? programsData : []);

        // Fetch all bookings
        const bookingsResponse = await fetch('http://localhost:5000/api/bookings/all', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!bookingsResponse.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const bookingsData = await bookingsResponse.json();
        setBookings(Array.isArray(bookingsData) ? bookingsData : []);
      } catch (error) {
        console.error('Error fetching admin details:', error.message);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDetails();
  }, [navigate]);

  const toggleSection = (section) => {
    setVisibleSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update user role');
      }

      alert('User role updated successfully!');
      setUsers(
        users.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error('Error updating user role:', error.message);
      alert(`Failed to update user role: ${error.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete user');
      }

      alert('User deleted successfully!');
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error.message);
      alert(`Failed to delete user: ${error.message}`);
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete booking');
      }
  
      alert('Booking deleted successfully!');
      setBookings(bookings.filter((booking) => booking._id !== bookingId));
    } catch (error) {
      console.error('Error deleting booking:', error.message);
      alert(`Failed to delete booking: ${error.message}`);
    }
  };

  const handleUpdateProgramDetails = async (programId, updatedDetails) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/programs/${programId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update program details');
      }

      alert('Program details updated successfully!');
    } catch (error) {
      console.error('Error updating program details:', error.message);
      alert(`Failed to update program details: ${error.message}`);
    }
  };

  const handleDeleteProgram = async (programId) => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/programs/${programId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete program');
      }

      alert('Program deleted successfully!');
      setPrograms(programs.filter((program) => program._id !== programId));
    } catch (error) {
      console.error('Error deleting program:', error.message);
      alert(`Failed to delete program: ${error.message}`);
    }
  };

  const confirmAndDelete = async (deleteFunction, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await deleteFunction(id);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery) ||
      user.email.toLowerCase().includes(searchQuery)
  );

  const filteredPrograms = programs.filter(
    (program) =>
      program.name.toLowerCase().includes(searchQuery) ||
      program.description.toLowerCase().includes(searchQuery)
  );

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.client?.name.toLowerCase().includes(searchQuery) ||
      booking.program?.name.toLowerCase().includes(searchQuery)
  );

  if (loading) {
    return <div style={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>Error: {error}</div>;
  }

  return (
    <>
      <AdminNavBar adminName={adminName} />
      <div style={styles.container}>
        <h1 style={styles.heading}>Admin Dashboard</h1>
        <h3 style={styles.subheading}>
          Welcome, {adminName ? adminName : 'Admin'}!
        </h3>

        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearch}
          style={styles.searchInput}
        />

        {/* Users Section */}
        <div style={styles.section}>
          <h2 onClick={() => toggleSection('users')} style={styles.sectionHeader}>
            All Users {visibleSections.users ? '▼' : '▲'}
          </h2>
          {visibleSections.users && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    style={index % 2 === 0 ? styles.row : styles.rowAlt} // Apply alternating row styles
                  >
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <select
                        value={user.role}
                        onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                        style={styles.roleDropdown}
                      >
                        <option value="user">User</option>
                        <option value="trainer">Trainer</option>
                        <option value="nutritionist">Nutritionist</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>
                      <button
                        style={styles.deleteButton}
                        onClick={() => confirmAndDelete(handleDeleteUser, user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Programs Section */}
        <div style={styles.section}>
          <h2 onClick={() => toggleSection('programs')} style={styles.sectionHeader}>
            All Programs {visibleSections.programs ? '▼' : '▲'}
          </h2>
          {visibleSections.programs && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Price</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.map((program, index) => (
                  <tr
                    key={program._id}
                    style={index % 2 === 0 ? styles.row : styles.rowAlt} // Apply alternating row styles
                  >
                    <td>{program.name}</td>
                    <td>{program.description}</td>
                    <td>
                      <input
                        type="number"
                        value={program.price}
                        onChange={(e) =>
                          setPrograms(
                            programs.map((p) =>
                              p._id === program._id ? { ...p, price: e.target.value } : p
                            )
                          )
                        }
                        style={styles.inputField}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={program.duration}
                        onChange={(e) =>
                          setPrograms(
                            programs.map((p) =>
                              p._id === program._id ? { ...p, duration: e.target.value } : p
                            )
                          )
                        }
                        style={styles.inputField}
                      />
                    </td>
                    <td>
                      <button
                        style={styles.updateButton}
                        onClick={() =>
                          handleUpdateProgramDetails(program._id, {
                            price: program.price,
                            duration: program.duration,
                          })
                        }
                      >
                        Save
                      </button>
                      <button
                        style={styles.deleteButton}
                        onClick={() => confirmAndDelete(handleDeleteProgram, program._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Bookings Section */}
        <div style={styles.section}>
          <h2 onClick={() => toggleSection('bookings')} style={styles.sectionHeader}>
            All Bookings {visibleSections.bookings ? '▼' : '▲'}
          </h2>
          {visibleSections.bookings && (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Client Email</th>
                  <th>Program Name</th>
                  <th>Price</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <tr
                    key={booking._id}
                    style={index % 2 === 0 ? styles.row : styles.rowAlt} // Apply alternating row styles
                  >
                    <td>{booking.client?.name || 'N/A'}</td>
                    <td>{booking.client?.email || 'N/A'}</td>
                    <td>{booking.program?.name || 'N/A'}</td>
                    <td>${booking.program?.price || 'N/A'}</td>
                    <td>
                      <button
                        style={styles.deleteButton}
                        onClick={() => confirmAndDelete(handleDeleteBooking, booking._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#333',
  },
  subheading: {
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#555',
  },
  section: {
    marginTop: '2rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    backgroundColor: '#fff',
  },
  sectionHeader: {
    cursor: 'pointer',
    fontSize: '1.5rem',
    color: '#333',
    marginBottom: '1rem',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '1rem',
    textAlign: 'left',
  },
  row: {
    backgroundColor: '#f9f9f9',
    borderBottom: '1px solid #ddd',
    padding: '0.5rem',
  },
  rowAlt: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #ddd',
    padding: '0.5rem',
  },
  deleteButton: {
    backgroundColor: 'rgb(86, 18, 18)',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  updateButton: {
    backgroundColor: '#123456',
    color: 'white',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    marginLeft: '0.5rem',
    marginRight: '0.5rem',
  },
  searchInput: {
    width: '100%',
    padding: '0.5rem',
    marginBottom: '1rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: '#555',
  },
  error: {
    textAlign: 'center',
    fontSize: '1.5rem',
    color: 'red',
  },
  roleDropdown: {
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    backgroundColor: '#fff',
    cursor: 'pointer',
  },
  inputField: {
    width: '80px',
    padding: '0.5rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    textAlign: 'center',
  },
};

export default AdminDashboard;