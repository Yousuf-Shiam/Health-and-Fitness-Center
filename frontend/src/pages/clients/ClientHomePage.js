import React, { useEffect, useState } from 'react';
import ClientNavBar from './ClientNavBar'; // Import the ClientNavBar component
import Footer from '../../components/Footer';
import {jwtDecode} from 'jwt-decode'; // Correct import for jwt-decode
import { getFitnessPrograms } from '../../services/api'; // Import the API function
import { createBooking } from '../../services/api'; // Import the booking API function

function ClientHomePage() {
  const [clientName, setClientName] = useState(''); // State to store the client's name
  const [trainers, setTrainers] = useState([]); // State to store trainers
  const [nutritionists, setNutritionists] = useState([]); // State to store nutritionists
  const [fitnessPrograms, setFitnessPrograms] = useState([]); // State to store fitness programs
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [startDate, setStartDate] = useState(''); // State for start date

  // Add state for collapsible sections and search queries
  const [collapsedSections, setCollapsedSections] = useState({
    trainers: false,
    nutritionists: false,
    programs: false,
  }); // State to manage collapsible sections
  const [searchTrainer, setSearchTrainer] = useState(''); // State for trainer search query
  const [searchNutritionist, setSearchNutritionist] = useState(''); // State for nutritionist search query

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0f8ff, #e6e6fa)',
      color: '#333',
      margin: 0,
      padding: 0,
      overflowY: 'auto',
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      width: '100%',
      padding: '2rem',
    },
    heading: {
      fontSize: '2.8rem',
      fontWeight: 'bold',
      color: '#0a3563',
      marginBottom: '1rem',
    },
    subheading: {
      fontSize: '1.4rem',
      color: '#555',
      marginBottom: '2rem',
    },
    section: {
      margin: '2rem 0',
      padding: '1.5rem',
      backgroundColor: '#fff',
      borderRadius: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      width: '90%',
      maxWidth: '800px',
      transition: 'all 0.3s ease-in-out',
    },
    sectionHeading: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#333',
      cursor: 'pointer',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    item: {
      marginBottom: '1rem',
      padding: '1rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      textAlign: 'left',
      backgroundColor: '#f9f9f9',
      transition: 'all 0.3s ease',
    },
    itemHover: {
      backgroundColor: '#f0f8ff',
    },
    searchBar: {
      marginBottom: '1rem',
      padding: '0.8rem',
      width: '100%',
      maxWidth: '600px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    searchBarFocus: {
      borderColor: '#0a3563',
      boxShadow: '0 0 8px rgba(10, 53, 99, 0.2)',
    },
    datePicker: {
      marginLeft: '1rem',
      padding: '0.5rem',
      border: '1px solid #ccc',
      borderRadius: '8px',
      outline: 'none',
      transition: 'all 0.3s ease',
    },
    button: {
      marginTop: '1rem',
      padding: '0.8rem 1.5rem',
      backgroundColor: '#0a3563',
      color: '#fff',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#084080',
    },
  };

  // Fetch client name, trainers, nutritionists, and fitness programs
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
        const programsResponse = await getFitnessPrograms();
        setFitnessPrograms(programsResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Filter programs based on search query
  const filteredPrograms = fitnessPrograms.filter((program) =>
    program.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

    // Handle start date change
    const handleStartDateChange = (programId, date) => {
      setStartDate((prevDates) => ({
        ...prevDates,
        [programId]: date, // Update the start date for the specific program
      }));
    };

  // Handle booking a program
  const handleBookProgram = async (programId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to book a program.');
        return;
      }
  
      // Decode the token to get the user's details
      const decoded = jwtDecode(token);
      if (decoded.role !== 'client') {
        alert('Only clients can book programs.');
        return;
      }
  
    // Check if the program is already booked
    const existingBookingResponse = await fetch(`http://localhost:5000/api/bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (existingBookingResponse.ok) {
      const existingBookings = await existingBookingResponse.json();
      const isAlreadyBooked = existingBookings.some(
        (booking) => booking.program._id === programId
      );

      if (isAlreadyBooked) {
        alert('You have already booked this program.');
        return;
      }
    }


      // Prepare booking data
      const bookingData = {
        programId, // ID of the program being booked
        clientId: decoded.id, // ID of the client making the booking
        bookingDate: new Date().toISOString(), // Current date as the booking date
        startDate: startDate[programId], // Start date for the program
      };
  
      // Send the booking request with the authorization token and booking data
      await createBooking(bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
        
  
      alert('Program booked successfully!');
    } catch (error) {
      console.error('Failed to book program:', error.response?.data || error.message);
  
      // Handle specific error cases
      if (error.response?.status === 401) {
        alert('You are not authorized to book this program. Please log in.');
      } else if (error.response?.status === 400) {
        alert('Invalid program ID or booking request.');
      } else if (error.response?.status === 403) {
        alert('Only clients can book programs.');
      } else {
        alert('Failed to book program. Please try again.');
      }
    }
  };

  // Function to toggle collapsible sections
  const toggleSection = (section) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  return (
    <>
      <div style={styles.container}>
        <ClientNavBar />
        <div style={styles.content}>
          <h1 style={styles.heading}>Welcome, {clientName}!</h1>
          <p style={styles.subheading}>
            Manage your fitness activities, track progress, and achieve your goals.
          </p>

          {/* Trainers Section with Search and Collapsible Functionality */}
          <div style={styles.section}>
            <h2
              style={styles.sectionHeading}
              onClick={() => toggleSection('trainers')}
            >
              Available Trainers{' '}
              <span>
                {collapsedSections.trainers ? '▶' : '▼'}
              </span>
            </h2>
            {!collapsedSections.trainers && (
              <>
                <input
                  type="text"
                  placeholder="Search trainers..."
                  value={searchTrainer}
                  onChange={(e) => setSearchTrainer(e.target.value)}
                  style={styles.searchBar}
                />
                {trainers
                  .filter((trainer) =>
                    trainer.name.toLowerCase().includes(searchTrainer.toLowerCase())
                  )
                  .map((trainer) => (
                    <div key={trainer.id} style={styles.item}>
                      <h3>{trainer.name}</h3>
                      <p>Specialization: {trainer.specialization}</p>
                      <p>Experience: {trainer.experience} years</p>
                    </div>
                  ))}
              </>
            )}
          </div>

          {/* Nutritionists Section with Search and Collapsible Functionality */}
          <div style={styles.section}>
            <h2
              style={styles.sectionHeading}
              onClick={() => toggleSection('nutritionists')}
            >
              Available Nutritionists{' '}
              <span>
                {collapsedSections.nutritionists ? '▶' : '▼'}
              </span>
            </h2>
            {!collapsedSections.nutritionists && (
              <>
                <input
                  type="text"
                  placeholder="Search nutritionists..."
                  value={searchNutritionist}
                  onChange={(e) => setSearchNutritionist(e.target.value)}
                  style={styles.searchBar}
                />
                {nutritionists
                  .filter((nutritionist) =>
                    nutritionist.name
                      .toLowerCase()
                      .includes(searchNutritionist.toLowerCase())
                  )
                  .map((nutritionist) => (
                    <div key={nutritionist.id} style={styles.item}>
                      <h3>{nutritionist.name}</h3>
                      <p>Specialization: {nutritionist.specialization}</p>
                      <p>Experience: {nutritionist.experience} years</p>
                    </div>
                  ))}
              </>
            )}
          </div>

          {/* Fitness Programs Section with Collapsible Functionality */}
          <div style={styles.section}>
            <h2
              style={styles.sectionHeading}
              onClick={() => toggleSection('programs')}
            >
              Available Fitness Programs{' '}
              <span>
                {collapsedSections.programs ? '▶' : '▼'}
              </span>
            </h2>
            {!collapsedSections.programs && (
              <>
                {/* Search Bar */}
                <input
                  type="text"
                  placeholder="Search programs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={styles.searchBar}
                />

                {/* Display Filtered Programs */}
                {fitnessPrograms
                  .filter((program) =>
                    program.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((program) => (
                    <div key={program._id} style={styles.item}>
                      <h3>{program.name}</h3>

                      <p>
                        {program.creator.role === 'trainer' ? (
                          <>
                            <p>Trainer: {program.creator.name}</p>
                          </>
                        ) : program.creator.role === 'nutritionist' ? (
                          <p>Nutritionist: {program.creator.name}</p>
                        ) : null}
                      </p>

                      <p>Description: {program.description}</p>
                      <p>Duration: {program.duration} weeks</p>
                      <p>Price: ${program.price}</p>
                      <p>
                        Select Starting Date:{' '}
                        <input
                          type="date"
                          value={startDate[program._id] || ''} // Use the start date for this program
                          onChange={(e) =>
                            handleStartDateChange(program._id, e.target.value)
                          }
                          style={styles.datePicker}
                        />
                        <button
                          onClick={() => handleBookProgram(program._id)}
                          disabled={!startDate[program._id]} // Disable button if no date is selected
                        >
                          Book Now
                        </button>
                      </p>
                    </div>
                  ))}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default ClientHomePage;