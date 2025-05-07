import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../../services/api'; // Use the adminLogin API function
import Navbar from '../../components/Navbar'; // Adjust the import path as necessary
import Footer from '../../components/Footer'; // Adjust the import path as necessary

function AdminLogin() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await adminLogin(formData); // Use the adminLogin API function
      const { token, role } = response.data;

      // Save token to localStorage
      localStorage.setItem('token', token);

      // Redirect to admin page if role is admin
      if (role === 'admin') {
        alert('Login successful!');
        navigate('/admin');
      } else {
        alert('Unauthorized access! Only admins can log in.');
      }
    } catch (error) {
      console.error('Admin login failed:', error.response?.data || error.message);
      alert('Invalid email or password');
    }
  };

  const styles = {
    form: {
      maxWidth: '400px',
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
      width: '100%',
      padding: '0.8rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      color: '#ffffff',
      backgroundColor: '#0f5132',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  return (
    <>
      <Navbar />
      <div style={{ height: '50px' }}></div> {/* Spacer for Navbar */}
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2>Admin Login</h2>
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
        <button type="submit" style={styles.button}>
          Login
        </button>
      </form>
      <div style={{ height: '140px' }}></div> {/* Spacer for Footer */}
      <Footer />
    </>
  );
}

export default AdminLogin;