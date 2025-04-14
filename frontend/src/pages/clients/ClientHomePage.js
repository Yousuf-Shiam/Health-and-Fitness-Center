import React, { useEffect, useState } from 'react';
import ClientNavBar from './ClientNavBar'; // Import the ClientNavBar component
import Footer from '../../components/Footer';
import {jwtDecode} from 'jwt-decode'; // Import jwt-decode to decode the token

function ClientHomePage() {
  const [clientName, setClientName] = useState(''); // State to store the client's name
  const [trainers, setTrainers] = useState([]); // State to store trainers
  const [nutritionists, setNutritionists] = useState([]); // State to store nutritionists
  const [fitnessPrograms, setFitnessPrograms] = useState([]); // State to store fitness programs

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(90deg, #e6e6fa, #add8e6)',
      color: '#333333',
      margin: 0,
      padding: 0,
      overflowY: 'auto',
      overflowX: 'hidden',
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      width: '100%',
    },
    heading: {
      fontSize: '2.8rem',
      fontWeight: 'bold',
      color: 'rgb(10, 53, 99)',
      marginBottom: '1rem',
    },
    subheading: {
      fontSize: '1.4rem',
      color: '#555555',
      marginBottom: '2rem',
    },
    section: {
      margin: '2rem 0',
      padding: '1rem',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      width: '90%',
      maxWidth: '800px',
    },
    sectionHeading: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#333',
    },
    item: {
      marginBottom: '1rem',
      padding: '1rem',
      border: '1px solid #ccc',
      borderRadius: '4px',
      textAlign: 'left',
    },
  };

  // Fetch client name and available data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        // Decode the token to get the user ID
        const decoded = jwtDecode(token);

        // Fetch user details using the ID from the decoded token
        const userResponse = await fetch(`http://localhost:5000/api/users/${decoded.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userResponse.ok) {
          throw new Error('Failed to fetch client name');
        }

        const userData = await userResponse.json();
        setClientName(userData.name);

        // Fetch all users
        const usersResponse = await fetch('http://localhost:5000/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }

        const usersData = await usersResponse.json();

        // Filter users by roles
        const trainersData = usersData.filter((user) => user.role === 'trainer');
        const nutritionistsData = usersData.filter((user) => user.role === 'nutritionist');

        setTrainers(trainersData);
        setNutritionists(nutritionistsData);

        // Fetch fitness programs
        const fitnessProgramsResponse = await fetch('http://localhost:5000/api/fitness-programs');
        const fitnessProgramsData = await fitnessProgramsResponse.json();
        setFitnessPrograms(fitnessProgramsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div style={styles.container}>
        <ClientNavBar />
        <div style={styles.content}>
          <h1 style={styles.heading}>Welcome, {clientName}!</h1>
          <p style={styles.subheading}>
            Manage your fitness activities, track progress, and achieve your goals.
          </p>

          {/* Trainers Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>Available Trainers</h2>
            {trainers.map((trainer) => (
              <div key={trainer.id} style={styles.item}>
                <h3>{trainer.name}</h3>
                <p>Specialization: {trainer.specialization}</p>
                <p>Experience: {trainer.experience} years</p>
              </div>
            ))}
          </div>

          {/* Nutritionists Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>Available Nutritionists</h2>
            {nutritionists.map((nutritionist) => (
              <div key={nutritionist.id} style={styles.item}>
                <h3>{nutritionist.name}</h3>
                <p>Specialization: {nutritionist.specialization}</p>
                <p>Experience: {nutritionist.experience} years</p>
              </div>
            ))}
          </div>

          {/* Fitness Programs Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionHeading}>Available Fitness Programs</h2>
            {fitnessPrograms.map((program) => (
              <div key={program.id} style={styles.item}>
                <h3>{program.name}</h3>
                <p>Description: {program.description}</p>
                <p>Duration: {program.duration} weeks</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ClientHomePage;