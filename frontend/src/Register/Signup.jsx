// src/Register/Signup.js
import React, { useState } from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios'
import './Register.css';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const[msg,setMsg]=useState('')
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    let user = {username, email, password };
        console.log(user);
        axios.post('http://localhost:8000/accounts/signup/', {
                username: username,
                password: password,
                email:email
            })
            .then(response => {
                console.log(response.data);
                setMsg("Registration successful! Please login.");
                navigate('/Register/Signin');
            }).catch(error => {
                console.error(error);
                setMsg(error.response ? error.response.data : "An error occurred during registration.");
            });
  };

  return (
    <div className="signup-card">
      <h2 className="signup-title">Sign Up</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            required
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            required
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            required
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-submit">Submit</button>
      </form>
      <div className="signup-link">
        <p>Existing user? <Link to="/Register/Signin">Login</Link></p>
      </div>
      <>{msg}</>
    </div>
  );
}

export default Signup;
