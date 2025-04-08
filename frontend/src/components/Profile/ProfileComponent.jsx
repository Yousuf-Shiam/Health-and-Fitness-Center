import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProfileComponent = () => {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('/api/profile');
                setProfile(response.data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleUpdateProfile = async (updatedProfile) => {
        try {
            const response = await axios.put('/api/profile', updatedProfile);
            setProfile(response.data);
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>User Profile</h1>
            {profile && (
                <div>
                    <p>Name: {profile.name}</p>
                    <p>Email: {profile.email}</p>
                    <p>Fitness Goals: {profile.fitnessGoals}</p>
                    {/* Add more profile fields as needed */}
                    <button onClick={() => handleUpdateProfile({ /* updated profile data */ })}>
                        Update Profile
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileComponent;