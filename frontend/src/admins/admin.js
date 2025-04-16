// filepath: c:\Users\User\OneDrive\Desktop\Health-and-Fitness-Center\frontend\src\admins\AdminPage.js

import React, { useState, useEffect } from 'react';

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [feedback, setFeedback] = useState([]);

    useEffect(() => {
        // Fetch users, classes, and feedback from the API
        fetchUsers();
        fetchClasses();
        fetchFeedback();
    }, []);

    const fetchUsers = async () => {
        // Replace with your API endpoint
        const response = await fetch('/api/users');
        const data = await response.json();
        setUsers(data);
    };

    const fetchClasses = async () => {
        // Replace with your API endpoint
        const response = await fetch('/api/classes');
        const data = await response.json();
        setClasses(data);
    };

    const fetchFeedback = async () => {
        // Replace with your API endpoint
        const response = await fetch('/api/feedback');
        const data = await response.json();
        setFeedback(data);
    };

    const handleDeleteUser = async (userId) => {
        // Replace with your API endpoint
        await fetch(`/api/users/${userId}`, { method: 'DELETE' });
        fetchUsers(); // Refresh the user list
    };

    const handleDeleteClass = async (classId) => {
        // Replace with your API endpoint
        await fetch(`/api/classes/${classId}`, { method: 'DELETE' });
        fetchClasses(); // Refresh the class list
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>

            <section>
                <h2>Manage Users</h2>
                <ul>
                    {users.map(user => (
                        <li key={user.id}>
                            {user.name} <button onClick={() => handleDeleteUser(user.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>Manage Classes</h2>
                <ul>
                    {classes.map(classItem => (
                        <li key={classItem.id}>
                            {classItem.title} <button onClick={() => handleDeleteClass(classItem.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h2>User Feedback</h2>
                <ul>
                    {feedback.map(item => (
                        <li key={item.id}>{item.comment}</li>
                    ))}
                </ul>
            </section>
        </div>
    );
};

export default AdminPage;