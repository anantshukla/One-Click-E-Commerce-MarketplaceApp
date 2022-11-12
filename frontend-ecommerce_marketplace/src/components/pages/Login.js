import React, { useState } from 'react';
import '../../App.css';
import axios from 'axios';
import {setUserSession} from '../../Utils/Common';


function Login(props) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] =useState(null);
  const [loading, setLoading] = useState(false);

  // handle button click of login form
  const handleLogin = () => {
    setError(null);
    setLoading(true);
    axios.post('http://localhost:3001/authenticateUser', 
    { email: email,
      password: password
    }).then(response => {
      setLoading(false);
      setUserSession(response.data);
      console.warn(response.data);
      props.history.push('/products');
    }).catch(error => {
      setLoading(false);
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    });
  }

  return(

    <div className='login'>
      <div className="sub-main">
        <div>
          <h1 style={{ color: 'Brown' ,fontSize: "3rem"}}>SIGN IN</h1>
          <br/><br/><br/>
            
            <div >
              <input type="text" placeholder="email" className="name" value={email} onChange = {(e) => setEmail(e.target.value)}/>
            </div><br/><br/><br/>
            <div >
              <input type="password" placeholder="password" className="name" value={password} onChange = {(e) => setPassword(e.target.value)} />
            </div>
            <br/> {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />

            <div className="login-button">
            <button onClick={handleLogin}  value={loading ? 'Loading...' : 'Login'} disabled={loading}> LOGIN </button>
            </div>
            <br/><br/>
            <p className="link">
                <a href="/sign-up"> or Sign Up?</a>
              </p>

      </div>
      </div>

    </div>
  
)
}

export default Login;