import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import ProfileComponent from '../components/Profile/ProfileComponent';
import { getUserProfile } from '../utils/api';

const ProfilePage = () => {
    const { user } = useContext(AppContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getUserProfile(user.id);
                setProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h1>User Profile</h1>
            {profile ? <ProfileComponent profile={profile} /> : <div>No profile found.</div>}
        </div>
    );
};

export default ProfilePage;