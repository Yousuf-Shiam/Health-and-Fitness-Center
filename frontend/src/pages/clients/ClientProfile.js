import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Import jwt-decode
import ClientNavBar from './ClientNavBar'; // Import the ClientNavBar component
import Footer from '../../components/Footer';

function ClientProfile() {
    const [profileData, setProfileData] = useState({
      name: '',
      email: '',
      fitnessGoals: '',
      preferences: '',
    });
  
    const [isEditing, setIsEditing] = useState(false);
    const [token, setToken] = useState(''); // State to store the token
    const [decodedToken, setDecodedToken] = useState(null); // State to store decoded token data
  
    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const storedToken = localStorage.getItem('token');
          if (!storedToken) {
            console.error('No token found');
            return;
          }
  
          setToken(storedToken); // Set the token in state
  
          // Decode the token
          const decoded = jwtDecode(storedToken);
          setDecodedToken(decoded); // Store decoded token data
  
          // Fetch user details using the ID from the decoded token
          const response = await fetch(`http://localhost:5000/api/users/${decoded.id}`, {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch user details');
          }
  
          const userData = await response.json();
          setProfileData(userData); // Update state with user details
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };
  
      fetchUserDetails();
    }, []);
  
    const handleChange = (e) => {
      setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };
  
    const handleSave = async () => {
      try {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
          console.error('No token found');
          return;
        }
  
        // Send a PUT request to update the user details
        const response = await fetch(`http://localhost:5000/api/users/${decodedToken.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${storedToken}`,
          },
          body: JSON.stringify(profileData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update profile data');
        }
  
        // Fetch the updated user details
        const updatedData = await response.json();
        setProfileData(updatedData); // Update state with the updated profile data
        setIsEditing(false);
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile data:', error);
        alert('Failed to update profile.');
      }
    };
  
    const handleCancel = () => {
      setIsEditing(false); // Exit editing mode
    };
  
    const styles = {
        container: {
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          background: 'linear-gradient(90deg, #e6e6fa, #add8e6)',
          color: '#333333',
          margin: 0,
          padding: 0,
          overflowY: 'auto',
          overflowX: 'hidden', // Prevent horizontal scrolling
        },
        form: {
          maxWidth: '500px',
          margin: '2rem auto',
          padding: '2rem',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          textAlign: 'center', // Center align the title and form content
        },
        input: {
          width: '90%',
          marginBottom: '1rem',
          padding: '0.8rem',
          border: '1px solid #ccc',
          borderRadius: '4px',
        },
        buttonContainer: {
          display: 'flex',
          justifyContent: 'center', // Center align the buttons
          gap: '1rem', // Add spacing between buttons
          marginTop: '1rem',
        },
        button: {
          padding: '0.8rem 2rem',
          fontSize: '1rem',
          fontWeight: 'bold',
          color: '#ffffff',
          backgroundColor: 'rgb(4, 56, 111)',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        },
        buttonHover: {
          backgroundColor: 'rgb(4, 25, 47)',
        },
        cancelButton: {
          padding: '0.8rem 2rem',
          fontSize: '1rem',
          fontWeight: 'bold',
          color: '#ffffff',
          backgroundColor: 'rgb(80, 6, 13)',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          transition: 'background-color 0.3s ease',
        },
        cancelButtonHover: {
          backgroundColor: 'rgb(4, 25, 47)',

        },
      };

      React.useEffect(() => {
        document.body.style.margin = '0';
        document.body.style.padding = '0';
        document.body.style.overflowY = 'auto'; // Allow scrolling
        document.body.style.overflowX = 'hidden'; // Prevent horizontal scrolling
      }, []);
    
  
    return (
      <div style={styles.container}>
        <ClientNavBar />
        <form style={styles.form}>
  <h2>{isEditing ? 'Edit Profile' : 'Client Profile'}</h2> {/* Dynamic title */}
  <input
    type="text"
    name="name"
    value={profileData.name}
    onChange={handleChange}
    style={styles.input}
    placeholder="Name"
    disabled={!isEditing}
  />
  <input
    type="email"
    name="email"
    value={profileData.email}
    onChange={handleChange}
    style={styles.input}
    placeholder="Email"
    disabled
  />
  <textarea
    name="fitnessGoals"
    value={profileData.fitnessGoals}
    onChange={handleChange}
    style={styles.input}
    placeholder="Fitness Goals"
    disabled={!isEditing}
  />
  <textarea
    name="preferences"
    value={profileData.preferences}
    onChange={handleChange}
    style={styles.input}
    placeholder="Preferences"
    disabled={!isEditing}
  />
  <div style={styles.buttonContainer}>
    {isEditing ? (
      <>
        <button
          type="button"
          style={styles.button}
          onClick={handleSave}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Save
        </button>
        <button
          type="button"
          style={styles.cancelButton}
          onClick={handleCancel}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.cancelButtonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.cancelButton.backgroundColor)}
        >
          Cancel
        </button>
      </>
    ) : (
      <button
        type="button"
        style={styles.button}
        onClick={() => setIsEditing(true)}
        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
      >
        Edit
      </button>
    )}
  </div>
</form>
        <Footer />
      </div>
    );
  }
  
  export default ClientProfile;