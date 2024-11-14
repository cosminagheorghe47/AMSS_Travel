import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Auth.css';
import {NavLink, useNavigate} from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [values, setValues] = useState({
        email: "",
        username: "",
        password: "",
    });

    return (
        <div>
            <div className="row auth-container">
                <h1>Register page!</h1>
                <div className="auth-form">
                    <form>
                        <div>
                            <div className="auth-input">
                                <input type="text" className="form-control form-control-lg"
                                    placeholder="Enter username" 
                                    onChange = {e => setValues({...values, username: e.target.value})}/>
                                <label className="form-label" htmlFor="form3Example3"></label>
                            </div>

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
                                <span>Already have an account? <strong>
                                    <NavLink to="/login" style={{textDecoration: 'none'}}>
                                        Login here.
                                    </NavLink></strong>
                                </span>
                            </div>
                        </div>

                        <div>
                            <div className="auth-input">
                                <button style={{width: '50%'}}>REGISTER</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
export default Register;