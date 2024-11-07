import React, { useState } from 'react';
import './login-register.css';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/api';
// import Login from './login';

const Register: React.FC = () => {
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'student'
    });
    const navigate = useNavigate();
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      console.log('are we here?');
      e.preventDefault();
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      try {
        await register(formData);
        navigate('/login');
      } catch (error) {
        console.error('Registration failed:', error);
      }
    };
  
    return (
      <div className='container'>
        <div className='register'>
          <div className='head'></div>
          <div className='body'>
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
              <div className='name'>
                <input type="text" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
                <input type="text" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
              </div>
              <input type="text" placeholder="Username" name="username" value={formData.username} onChange={handleChange} />
              <input type="email" placeholder="Email" name="email" value={formData.email} onChange={handleChange} />
              <input type="password" placeholder="Password" name="password" value={formData.password} onChange={handleChange} />
              <input type="password" placeholder="Confirm Password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
              <div className='role'>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="teacher">Teacher</option>
                  <option value="student">Student</option>
                </select>
              </div>
              <Link to="/login">Have an account? Login</Link>
              <button type="submit">Register</button>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  export default Register;

// const Register: React.FC = () => {
//     return (
//         <>
//         <div className='container'>
//             <div className='register'>
//             <div className='head'></div>
//             <div className='body'>
//                 <h1>Register</h1>
//                 <form>
//                 <div className='name'>
//                     <input type="text" placeholder="First Name" />
//                     <input type="text" placeholder="Last Name" />
//                 </div>
//                 <input type="text" placeholder="Username" />
//                 <input type="email" placeholder="Email" />
//                 <input type="password" placeholder="Password" />
//                 <input type="password" placeholder="Confirm Password" />
//                 <div className='role'>
//                 <select>
//                     <option value="teacher">Teacher</option>
//                     <option value="student">Student</option>
//                 </select>
//                 <Router>
//                     <Link to="/login">Have an account? Login</Link>
//                     <Routes>
//                     <Route path="/login" element={<Login />}></Route>
//                 </Routes>
//                 </Router>
//                 </div>
//                 <button type="submit">Register</button>
//                 </form>
//             </div>
//             </div>
//         </div>
//         </>
//     )
// }

// export default Register;