import React, { useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Correct import for jwt-decode
import TrainerNavBar from './TrainerNavBar'; // Import the TrainerNavBar component
import Footer from '../../components/Footer';
import { set } from 'mongoose';

function TrainerHomePage() {
  const [trainerName, setTrainerName] = useState(''); // State to store the trainer's name
  const [trainerPrograms, setTrainerPrograms] = useState([]); // State to store programs created by the trainer
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTrainerData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('No token found');
          return;
        }

        // Decode the token to get the user ID
        const decoded = jwtDecode(token);
        console.log('Decoded Token:', decoded); // Debugging: Log decoded token

        // Fetch all programs
        const programsResponse = await fetch('${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/programs', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!programsResponse.ok) {
          throw new Error('Failed to fetch programs');
        }

        const programsData = await programsResponse.json();
        console.log('Fetched Programs:', programsData); // Debugging: Log fetched programs

        // Filter programs created by the logged-in trainer
        const filteredPrograms = programsData.filter(
          (program) => program.creator._id === decoded.id && program.role === 'trainer'
        );
        console.log('Filtered Programs:', filteredPrograms); // Debugging: Log filtered programs

        setTrainerName(filteredPrograms[0]?.creator.name || ''); // Set trainer's name from the first program's creator
        // Fetch bookings for the filtered programs
        const bookingsResponse = await fetch('${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/bookings', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!bookingsResponse.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const bookingsData = await bookingsResponse.json();
        console.log('Fetched Bookings:', bookingsData); // Debugging: Log fetched bookings

        // Map bookings to their respective programs
        const programsWithBookings = filteredPrograms.map((program) => {
          const programBookings = bookingsData.filter(
            (booking) => booking.program._id === program._id
          );
          return { ...program, bookings: programBookings };
        });

        console.log('Programs with Bookings:', programsWithBookings); // Debugging: Log programs with bookings
        setTrainerPrograms(programsWithBookings);
      } catch (error) {
        console.error('Error fetching data:', error);
        setMessage('Failed to load data. Please try again.');
      }
    };

    fetchTrainerData();
  }, []);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(90deg, #e6e6fa, #add8e6)',
      color: '#333333',
      padding: '2rem',
    },
    section: {
      margin: '2rem 0',
      padding: '1rem',
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      width: '90%',
      maxWidth: '800px',
      marginLeft: 'auto',
      marginRight: 'auto',
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
    heading: {
      textAlign: 'center',
      fontSize: '2rem',
      marginBottom: '1rem',
    },
    subheading: {
      textAlign: 'center',
      fontSize: '1.2rem',
      marginBottom: '2rem',
      color: '#555',
    },
    message: {
      textAlign: 'center',
      color: 'red',
      marginTop: '1rem',
    },
  };

  return (
    <>
      <TrainerNavBar /> {/* Add the TrainerNavBar */}
      <div style={styles.container}>
        <h1 style={styles.heading}>Welcome, {trainerName}!</h1>
        <p style={styles.subheading}>Here are the programs you created and their bookings.</p>

        {/* Trainer Programs Section */}
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Your Created Programs</h2>
          {trainerPrograms.length > 0 ? (
            trainerPrograms.map((program) => (
              <div key={program._id} style={styles.item}>
                <h3>{program.name}</h3>
                <p>Description: {program.description}</p>
                <p>Duration: {program.duration} weeks</p>
                <p>Price: ${program.price}</p>
                <h4>Bookings:</h4>
                {program.bookings.length > 0 ? (
                  <ul>
                    {program.bookings.map((booking) => (
                      <li key={booking._id}>{booking.client.name}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No bookings yet.</p>
                )}
              </div>
            ))
          ) : (
            <p>No programs created yet.</p>
          )}
        </div>

        {message && <p style={styles.message}>{message}</p>}
      </div>
      <Footer />
    </>
  );
}

export default TrainerHomePage;