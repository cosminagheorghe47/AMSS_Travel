import React, { useEffect, useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import {NavLink, useNavigate} from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [firestoreUser, setFirestoreUser] = useState(null);

    useEffect(() => {
        const unsubscribe = firebase.auth().onAuthStateChanged((currentUser) => {
            if (currentUser) {
                setUser(currentUser);
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
        try {
            await firebase.auth().signOut();
            console.log("User logged out successfully");
            navigate("/");
        } catch (error) {
            console.error("Error signing out: ", error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>No user logged in</div>;
    }

    return (
        <div>
            <h1>Profile</h1>
            <div>
                <strong>Username:</strong> {user.displayName || "No display name set"}
            </div>
            <div>
                <strong>Email:</strong> {user.email}
            </div>
            <div>
                <button onClick={handleLogout}>LOGOUT</button>
            </div>
        </div>
    );
};

export default Profile;
