import React from 'react';
import UserList from '../components/UserList';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function UsersPage() {
  return (
    <>
    <Navbar />
    <div>
      <h1>Users</h1>
      <UserList />
    </div>
    <Footer />
    </>
  );
}

export default UsersPage;