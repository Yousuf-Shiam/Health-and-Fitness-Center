import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { fetchDashboardData } from '../utils/api';
import DashboardComponent from '../components/Dashboard/DashboardComponent';

const DashboardPage = () => {
    const { user } = useContext(AppContext);
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getDashboardData = async () => {
            try {
                const data = await fetchDashboardData(user.id);
                setDashboardData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            getDashboardData();
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
            <h1>Dashboard</h1>
            {dashboardData && <DashboardComponent data={dashboardData} />}
        </div>
    );
};

export default DashboardPage;