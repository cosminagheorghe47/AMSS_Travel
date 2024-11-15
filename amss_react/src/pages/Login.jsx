import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Auth.css';
import {NavLink, useNavigate} from 'react-router-dom';
import { auth } from '../firebase';

const Login = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [values, setValues] = useState({
        email: "",
        password: "",
    });

    const handleLogin = async (event) => {
        event.preventDefault();
        console.log(values);
        try {
            const userCredential = await auth.signInWithEmailAndPassword(values.email, values.password);
            const token = await userCredential.user.getIdToken();
            console.log(token);
            localStorage.setItem('token', token);
            const response = await axios.post('http://localhost:8080/auth/login', {}, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
            });
            console.log('response ' + response);
            if (response.data) {
                navigate("/home");
            }
        } catch (error) {
            setError("Login failed: " + error.message);
        }
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