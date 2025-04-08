import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [userProfile, setUserProfile] = useState(null);
    const [services, setServices] = useState([]);
    const [mealPlans, setMealPlans] = useState([]);
    const [notifications, setNotifications] = useState([]);

    return (
        <AppContext.Provider value={{
            userProfile,
            setUserProfile,
            services,
            setServices,
            mealPlans,
            setMealPlans,
            notifications,
            setNotifications
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};