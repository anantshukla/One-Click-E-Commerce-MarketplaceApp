import React, { useState } from 'react';
import '../../App.css';
import axios from 'axios';


function SignUp(props) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhone] = useState('');
  const [error, setError] = useState(null);

  // handle button click of register form
  const register = () => {
    setError(null);
    axios.post('http://localhost:3001/createUser', 
    { email: email,
      password: password,
      firstName:firstName,
      lastName:lastName,
      phoneNumber:phoneNumber
    }).then(response => {
      console.warn(response.data);
      props.history.push('/login');
    }).catch(error => {
      if (error.response.status === 401) setError(error.response.data.message);
      else setError("Something went wrong. Please try again later.");
    });
  }

  return(
   
    <div className='sign-up'>
      <div className="sub-main">
        <div>
          <h1 style={{ color: 'Brown' ,fontSize: "3rem"}}>CREATE ACCOUNT</h1>
          <br/>
            <div >
              <input type="email" placeholder="email" className="name" value={email} onChange = {(e) => setEmail(e.target.value)}/>
            </div> <br/>
            <div >
              <input type="password" placeholder="password" className="name" value={password} onChange = {(e) => setPassword(e.target.value)} />
            </div><br/>
            <div >
              <input type="text" placeholder="firstName" className="name" value={firstName} onChange = {(e) => setFirstName(e.target.value)} />
            </div><br/>
            <div >
              <input type="text" placeholder="lastName" className="name" value={lastName} onChange = {(e) => setLastName(e.target.value)} />
            </div><br/>
            <div >
              <input type="text" placeholder="phone" className="name" value={phoneNumber} onChange = {(e) => setPhone(e.target.value)} />
            </div><br/>
            
            {/* {error && <div className='error'>{error}</div>}<br/> */}
            <br/> {error && <><small style={{ color: 'red' }}>{error}</small><br /></>}<br />

            <div className="login-button"><br/>
            <button onClick={register}> SIGN UP </button>
            </div>

      </div>
      </div>

    </div>
    
)
}

export default SignUp;