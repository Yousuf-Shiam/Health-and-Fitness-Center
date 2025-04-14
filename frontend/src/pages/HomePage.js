import React from 'react';

function HomePage() {
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'row', // Horizontal layout
      justifyContent: 'space-between',
      alignItems: '',
      height: '100vh',
      width: '100vw', // Full width of the viewport
      margin: 0,
      padding: '2rem',
      background: 'linear-gradient(90deg, #e6e6fa, #add8e6)', // Light lavender to light blue gradient
      color: '#333333', // Dark gray text for contrast
    },
    leftSection: {
      flex: 1,
      padding: '2rem',
    },
    heading: {
      fontSize: '2.8rem',
      fontWeight: 'bold',
      color: '#007bff', // Vibrant blue for the heading
      marginBottom: '1rem',
    },
    subheading: {
      fontSize: '1.4rem',
      color: '#555555', // Medium gray for the subheading
      marginBottom: '2rem',
    },
    button: {
      padding: '0.8rem 2rem',
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#ffffff', // White text for the button
      backgroundColor: '#007bff', // Vibrant blue button
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      transition: 'background-color 0.3s ease',
    },
    buttonHover: {
      backgroundColor: '#0056b3', // Darker blue on hover
    },
    rightSection: {
      flex: 1,
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      width: '200px',
      height: '250px',
      backgroundColor: '#ffffff', // White background for the card
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow
      overflow: 'hidden',
      textAlign: 'center',
    },
    cardImage: {
      width: '100%',
      height: '70%',
      objectFit: 'cover',
    },
    cardText: {
      padding: '0.5rem',
      fontSize: '1rem',
      fontWeight: 'bold',
      color: '#333333',
    },
  };

  // Ensure no white borders by applying global styles
  React.useEffect(() => {
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }, []);

  return (
    <div style={styles.container}>
      {/* Left Section */}
      <div style={styles.leftSection}>
        <h1 style={styles.heading}>Welcome to the Health and Fitness Center</h1>
        <p style={styles.subheading}>
          Achieve your fitness goals with personalized programs and expert guidance.
        </p>
        <button
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Get Started
        </button>
      </div>

      {/* Right Section */}
      <div style={styles.rightSection}>
        <div style={styles.card}>
          <img
            src="https://via.placeholder.com/200x150" // Replace with actual image URL
            alt="Trainer"
            style={styles.cardImage}
          />
          <div style={styles.cardText}>Expert Trainers</div>
        </div>
        <div style={styles.card}>
          <img
            src="https://via.placeholder.com/200x150" // Replace with actual image URL
            alt="Nutrition"
            style={styles.cardImage}
          />
          <div style={styles.cardText}>Nutrition Plans</div>
        </div>
        <div style={styles.card}>
          <img
            src="https://via.placeholder.com/200x150" // Replace with actual image URL
            alt="Programs"
            style={styles.cardImage}
          />
          <div style={styles.cardText}>Fitness Programs</div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;