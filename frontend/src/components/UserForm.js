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

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
      <select name="role" onChange={handleChange}>
        <option value="client">Client</option>
        <option value="trainer">Trainer</option>
        <option value="nutritionist">Nutritionist</option>
        <option value="admin">Admin</option>
      </select>
      <input type="text" name="fitnessGoals" placeholder="Fitness Goals" onChange={handleChange} />
      <input type="text" name="preferences" placeholder="Preferences" onChange={handleChange} />
      <button type="submit">Register</button>
    </form>
  );
}

export default UserForm;