import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(formData);
      const { token, role } = response.data;

      // Save token to localStorage
      localStorage.setItem('token', token);

      // Redirect based on role
      if (role === 'client') navigate('/client-home');
      else if (role === 'trainer') navigate('/trainer-home');
      else if (role === 'nutritionist') navigate('/nutritionist-home');
      else alert('Unauthorized role!');

      alert('Login successful!');
    } catch (error) {
      console.error(error);
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
      <h2>Login</h2>
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

export default LoginPage;