import React, { useState } from 'react';
import './login-register.css';
import { useNavigate } from 'react-router-dom';
import { getDashboard, login } from '../../services/api';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formData); // Debugging statement
    try {
      console.log('Attempting to login...'); // Debugging statement
      const data = await login(formData);
      console.log('Login successful:', data); // Debugging statement
      localStorage.setItem('token', data.access_token); // Store the JWT token
      const url = await getDashboard(data); // Get the dashboard URL
      console.log('Navigating to:', url); // Debugging statement
      console.log(url.redirect); // Debugging statement
      navigate(url.redirect);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className='container'>
      <div className='login'>
        <div className='head'></div>
        <div className='body'>
          <h1>Login</h1>
          <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Username" name="username" value={formData.username} onChange={handleChange} />
            <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
            <Link to="/register">Don't have an account? Register</Link>
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
