import React, { useState } from 'react';
import { createUser } from '../services/api';

function UserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'client',
    fitnessGoals: '',
    preferences: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser(formData);
      alert('User created successfully!');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert('Error creating user');
    }
  };

  const styles = {
    form: {
      maxWidth: '500px',
      margin: '2rem auto',
      padding: '2rem',
      backgroundColor: '#ffffff', // White background
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
      fontFamily: 'Arial, sans-serif',
    },
    input: {
      width: '100%',
      marginBottom: '1rem',
      padding: '0.8rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '1rem',
    },
    select: {
      width: '100%',
      marginBottom: '1rem',
      padding: '0.8rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      fontSize: '1rem',
    },
    button: {
      width: '100%',
      padding: '0.8rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundColor: '#007bff', // Primary blue color
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#0056b3', // Darker blue on hover
    },
    heading: {
      textAlign: 'center',
      marginBottom: '1.5rem',
      fontSize: '1.8rem',
      color: '#333',
    },
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <h2 style={styles.heading}>Register</h2>
      <input
        type="text"
        name="name"
        placeholder="Name"
        style={styles.input}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        style={styles.input}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        style={styles.input}
        onChange={handleChange}
        required
      />
      <select name="role" style={styles.select} onChange={handleChange}>
        <option value="client">Client</option>
        <option value="trainer">Trainer</option>
        <option value="nutritionist">Nutritionist</option>
        <option value="admin">Admin</option>
      </select>
      <input
        type="text"
        name="fitnessGoals"
        placeholder="Fitness Goals"
        style={styles.input}
        onChange={handleChange}
      />
      <input
        type="text"
        name="preferences"
        placeholder="Preferences"
        style={styles.input}
        onChange={handleChange}
      />
      <button
        type="submit"
        style={styles.button}
        onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
        onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
      >
        Register
      </button>
    </form>
  );
}

export default UserForm;