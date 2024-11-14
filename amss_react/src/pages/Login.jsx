import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Auth.css';
import {NavLink, useNavigate} from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [values, setValues] = useState({
        email: "",
        password: "",
    });

    const handleLogin = (event) => {
        event.preventDefault();
        console.log(values);
        // axios.post('http://localhost:8080/auth/login', values)
        // .then(res => {
        //     if(res.data.Status === 'Success'){
        //         localStorage.setItem('currentUser', JSON.stringify(values.username));
        //         navigate("/home");
        //     }
        //     else if(res.data.Status === 'Error-Login')
        //         setMessage(res.data.Message)
        //     else{
        //         setError(res.data.Error)
        //     }
        // })
        // .catch(err => console.log(err))
    }

    return (
        <div>
            <div className="row auth-container">
                <h1>Login page!</h1>
                <div className="auth-form">
                    <form>
                        <div>
                            <div className="auth-input">
                                <input type="text" className="form-control form-control-lg"
                                    placeholder="Enter email" 
                                    onChange = {e => setValues({...values, email: e.target.value})}/>
                                <label className="form-label" htmlFor="form3Example3"></label>
                            </div>
                    
                            <div className="auth-input">
                                <input type="password" className="form-control form-control-lg"
                                    placeholder="Enter password" 
                                    onChange = {e => setValues({...values, password: e.target.value})}/>
                                <label className="form-label" htmlFor="form3Example4"></label>
                            </div>

                            <div className="redirect">
                                <span>Don't have an account? <strong>
                                    <NavLink to="/register" style={{textDecoration: 'none'}}>
                                        Register here.
                                    </NavLink></strong>
                                </span>
                            </div>
                        </div>

                        <div>
                            <div className="auth-input submit-btn">
                                <button style={{width: '50%'}}
                                    onClick={handleLogin}>
                                    LOGIN
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Login;