// src/Register/Signin.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Register.css';

function Signin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const[msg,setMsg]=useState('')

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:8000/accounts/login/', {
      username: username,
      password: password
  }).then(response => {
                console.log(response.data)
                localStorage.setItem('username', username);
                navigate('/file-upload')
            })
            .catch(error => {
                console.log(error);
                if (error.response) {
                    setMsg(error.response.data);
                } else {
                    setMsg("An error occurred. Please try again later.");
                }
            });
  };

  return (
    <div className="signin-card">
      <h2 className="signin-title">Sign In</h2>
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
        <button type="submit" className="btn-submit">Submit</button>
      </form>
      <div className="signup-link">
        <p>New user? <Link to="/Register/Signup">Sign Up</Link></p>
      </div>
    </div>
  );
}

export default Signin;
