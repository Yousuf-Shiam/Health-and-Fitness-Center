import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode
import Footer from '../../components/Footer';

function NutritionistHomePage() {
  const [nutritionistName, setNutritionistName] = useState(''); // State to store the nutritionist's name
  const [programData, setProgramData] = useState({
    name: '',
    description: '',
    price: '',
    duration: '',
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchNutritionistName = async () => {
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
          throw new Error('Failed to fetch nutritionist name');
        }

        const userData = await response.json();
        setNutritionistName(userData.name); // Set the nutritionist's name
      } catch (error) {
        console.error('Error fetching nutritionist name:', error);
      }
    };

    fetchNutritionistName();
  }, []);

  const handleChange = (e) => {
    setProgramData({ ...programData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setMessage('You must be logged in to create a program.');
        return;
      }

      const response = await fetch('http://localhost:5000/api/programs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(programData),
      });

      if (!response.ok) {
        throw new Error('Failed to create program');
      }

      const data = await response.json();
      setMessage(`Program "${data.name}" created successfully!`);
      setProgramData({ name: '', description: '', price: '', duration: '' }); // Reset form
    } catch (error) {
      console.error('Error creating program:', error);
      setMessage('Failed to create program. Please try again.');
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(90deg, #e6e6fa, #add8e6)',
      color: '#333333',
      padding: '2rem',
    },
    form: {
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    input: {
      width: '100%',
      marginBottom: '1rem',
      padding: '0.8rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
    },
    button: {
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
    buttonHover: {
      backgroundColor: '#0056b3',
    },
    message: {
      marginTop: '1rem',
      fontSize: '1rem',
      color: '#333',
    },
    heading: {
      textAlign: 'center',
      fontSize: '2rem',
      marginBottom: '1rem',
    },
    subheading: {
      textAlign: 'center',
      fontSize: '1.2rem',
      marginBottom: '2rem',
      color: '#555',
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Welcome, {nutritionistName}!</h1>
      <p style={styles.subheading}>Create a new diet program for your clients.</p>
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={programData.name}
          onChange={handleChange}
          style={styles.input}
          placeholder="Program Name"
          required
        />
        <textarea
          name="description"
          value={programData.description}
          onChange={handleChange}
          style={styles.input}
          placeholder="Program Description"
          required
        />
        <input
          type="number"
          name="price"
          value={programData.price}
          onChange={handleChange}
          style={styles.input}
          placeholder="Price"
          required
        />
        <input
          type="number"
          name="duration"
          value={programData.duration}
          onChange={handleChange}
          style={styles.input}
          placeholder="Duration (in weeks)"
          required
        />
        <button
          type="submit"
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Create Program
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
      <Footer />
    </div>
  );
}

export default NutritionistHomePage;