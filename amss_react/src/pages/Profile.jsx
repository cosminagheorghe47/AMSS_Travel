import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import {NavLink, useNavigate} from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [newUser, setNewUser] = useState(null);
    const [disabledForm, setDisabledForm] = useState(true);
    const [loading, setLoading] = useState(true);
    const [firestoreUser, setFirestoreUser] = useState(null);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setNewUser(currentUser)
                const db = firebase.firestore();
                const userRef = db.collection("users").doc(currentUser.uid);
                userRef.get().then((doc) => {
                    if (doc.exists) {
                        setFirestoreUser(doc.data());
                    }
                }).catch((error) => {
                    console.error("Error fetching user data from Firestore: ", error);
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {

        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            try {
                await firebase.auth().signOut();
                console.log("User logged out successfully");
                navigate("/");
            } catch (error) {
                console.error("Error signing out: ", error);
            }
        };
    }

    const handleEdit = async () => {
        setDisabledForm(false);
    }

    // const reauthenticateUser = async (password) => {
    //     const credential = firebase.auth.EmailAuthProvider.credential(
    //         user.email, 
    //         password    
    //     );
    //     await user.reauthenticateWithCredential(credential);
    // };
    
    const handleSave = async () => {
        try {
            // const password = prompt("Please re-enter your password to update email:");
            // if (password) {
            //     await reauthenticateUser(password);
            // }
    
            if (newUser.displayName) {
                await user.updateProfile({
                    displayName: newUser.displayName,
                });
            }
    
            if (newUser.email) {
                await user.updateEmail(newUser.email);
            }
    
            console.log("User profile updated successfully in Firestore and Auth");
            setDisabledForm(true);
        } catch (error) {
            console.error("Error updating profile: ", error);
        }
    };
    
    const handleResetPassword = async () => {
        try {
            if (!user || !user.email) {
                alert("No email associated with this account. Unable to reset password.");
                return;
            }
    
            await firebase.auth().sendPasswordResetEmail(user.email);
            alert(`Password reset email sent to ${user.email}. Please check your inbox.`);
        } catch (error) {
            console.error("Error sending password reset email: ", error);
            alert("An error occurred while attempting to reset the password.");
        }
    };
    

    const handleCancel = () => {
        setNewUser(user);
        setDisabledForm(true);
    }

    const handleNavigateLogin = () => {
        navigate("/login");
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return (
            <div className="no-user">
              No user logged in 
              <div> 
                <button onClick={handleNavigateLogin}>LOG IN</button>
              </div>
            </div>
          )
    }

    return (
        <div className="profile-div">
            <div className="center-div">
                <h1>Profile</h1>
                <div className="profile-icon">
                </div>
                <div className="details">
                    <div className="auth-input">
                        <label className="form-label" htmlFor="form3Example3"><strong>Username:</strong></label>
                        <input type="text" className="form-control form-control-lg"
                            placeholder="NO USERNAME SET" 
                            disabled={disabledForm}
                            value={newUser.displayName}
                            onChange = {e => setNewUser({...newUser, displayName: e.target.value})}
                        />
                    </div>
                    <div className="auth-input">
                        <label className="form-label" htmlFor="form3Example3"><strong>Email:</strong></label>
                        <input type="text" className="form-control form-control-lg"
                            placeholder="NO EMAIL SET" 
                            disabled={true}
                            value={newUser.email}
                            onChange = {e => setNewUser({...newUser, email: e.target.value})}
                        />
                    </div>
                </div>
            </div>
            <div className="bottom-buttons">
                <div>
                    {disabledForm && 
                        (
                            <button onClick={handleEdit}>EDIT</button>
                        )
                    }
                    {!disabledForm && 
                        (
                            <button onClick={handleCancel}>CANCEL</button>
                        )
                    }
                </div>
                <div>
                    <button onClick={handleSave}
                        disabled={disabledForm}
                    >SAVE</button>
                </div>
                <div>
                    <button onClick={handleLogout} className="logout">LOGOUT</button>
                </div>
            </div>
            <div className="reset-password">
                <span>Would you like to reset your password?</span>
                <div>
                    <button onClick={handleResetPassword}
                        className="reset-btn"
                    >Reset Password</button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
