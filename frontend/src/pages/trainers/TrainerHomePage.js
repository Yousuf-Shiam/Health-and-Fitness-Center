import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode
import TrainerNavBar from './TrainerNavBar'; // Import the TrainerNavBar component
import Footer from '../../components/Footer';
import { useNavigate } from 'react-router-dom';

function TrainerHomePage() {
  const [trainerName, setTrainerName] = useState(''); // State to store the trainer's name
  const [sidebarVisible, setSidebarVisible] = useState(false); // State for sidebar visibility
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainerName = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        // Decode the token to get the user ID
        const decoded = jwtDecode(token);

        // Fetch user details using the ID from the decoded token
        const response = await fetch(`http://localhost:5000/api/users/${decoded.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch trainer name');
        }

        const userData = await response.json();
        setTrainerName(userData.name); // Set the trainer's name
      } catch (error) {
        console.error('Error fetching trainer name:', error);
      }
    };

    fetchTrainerName();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token'); // Remove token from localStorage
    navigate('/login'); // Redirect to login page
  };

  const handleCreateProgram = () => {
    navigate('/trainer-create-program'); // Navigate to the program creation page
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const firstLetter = trainerName.charAt(0).toUpperCase();

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(90deg, #e6e6fa, #add8e6)',
      color: '#333333',
    },
    navbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem',
      background: 'linear-gradient(90deg, #0f5132, #0d3a7d)',
      color: '#ffffff',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
      position: 'sticky',
      top: 0,
      margin: '0',
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#ffffff',
      color: '#0f5132',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontWeight: 'bold',
      cursor: 'pointer',
    },
    sidebar: {
      position: 'fixed',
      top: 0,
      right: sidebarVisible ? 0 : '-100%',
      width: '250px',
      height: '100%',
      background: 'linear-gradient(90deg, #0f5132, #0d3a7d)',
      color: '#ffffff',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'flex-start',
      transition: 'right 0.3s ease',
      boxShadow: '-4px 0 6px rgba(0, 0, 0, 0.2)',
    },
    button: {
      backgroundColor: '#ffffff',
      color: '#0f5132',
      border: 'none',
      padding: '0.8rem 1rem',
      margin: '0.5rem 0',
      borderRadius: '4px',
      cursor: 'pointer',
      width: '100%',
      textAlign: 'left',
    },
    buttonHover: {
      backgroundColor: '#d4edda',
    },
    createProgramButton: {
      padding: '0.8rem 2rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundColor: '#007bff',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    createProgramButtonHover: {
      backgroundColor: '#0056b3',
    },
    content: {
      flex: 1,
      padding: '2rem',
      textAlign: 'center',
    },
    heading: {
      fontSize: '2rem',
      marginBottom: '1rem',
    },
    subheading: {
      fontSize: '1.2rem',
      marginBottom: '2rem',
      color: '#555',
    },
  };

  return (
    <div style={styles.container}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div>Health & Fitness</div>
        <div
          style={styles.avatar}
          onClick={toggleSidebar}
          title="Open Sidebar"
        >
          {firstLetter}
        </div>
      </div>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <button
          style={styles.closeButton}
          onClick={toggleSidebar}
        >
          Close
        </button>
        <h2>Welcome, {trainerName}!</h2>
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          onClick={() => navigate('/trainer-profile')}
        >
          Profile
        </button>
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <h1 style={styles.heading}>Welcome to the Trainer Dashboard</h1>
        <p style={styles.subheading}>Manage your fitness programs and clients here.</p>
        <button
          style={styles.createProgramButton}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.createProgramButtonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.createProgramButton.backgroundColor)}
          onClick={handleCreateProgram}
        >
          Create Program
        </button>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default TrainerHomePage;