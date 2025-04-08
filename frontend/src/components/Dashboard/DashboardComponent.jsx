import React from 'react';
import { useContext } from 'react';
import { AppContext } from '../../context/AppContext';

const DashboardComponent = () => {
    const { userProgress, notifications, mealTracking } = useContext(AppContext);

    return (
        <div className="dashboard">
            <h1>Dashboard</h1>
            <section className="progress">
                <h2>Your Progress</h2>
                <p>{userProgress}</p>
            </section>
            <section className="notifications">
                <h2>Notifications</h2>
                <ul>
                    {notifications.map((notification, index) => (
                        <li key={index}>{notification}</li>
                    ))}
                </ul>
            </section>
            <section className="meal-tracking">
                <h2>Meal Tracking</h2>
                <p>{mealTracking}</p>
            </section>
        </div>
    );
};

export default DashboardComponent;