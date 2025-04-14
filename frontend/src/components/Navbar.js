import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  const styles = {
    navbar: {
      background: 'linear-gradient(90deg, #0f5132, #0d3a7d)', // Dark teal to navy blue gradient
      padding: '1rem 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)', // Slightly darker shadow for depth
    },
    navbarContainer: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto',
    },
    logo: {
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: '#ffffff', // White text for the logo
      textDecoration: 'none',
      transition: 'color 0.3s ease',
    },
    logoHover: {
      color: '#ffcc00', // Bright yellow on hover
    },
    links: {
      listStyle: 'none',
      display: 'flex',
      gap: '2rem',
      margin: 0,
      padding: 0,
    },
    link: {
      fontSize: '1rem',
      fontWeight: 500,
      color: '#ffffff', // White text for links
      textDecoration: 'none',
      transition: 'color 0.3s ease',
    },
    linkHover: {
      color: '#ffcc00', // Bright yellow on hover
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.navbarContainer}>
        <div>
          <Link
            to="/"
            style={styles.logo}
            onMouseOver={(e) => (e.target.style.color = styles.logoHover.color)}
            onMouseOut={(e) => (e.target.style.color = styles.logo.color)}
          >
            Health & Fitness
          </Link>
        </div>
        <ul style={styles.links}>
          <li>
            <Link
              to="/"
              style={styles.link}
              onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
              onMouseOut={(e) => (e.target.style.color = styles.link.color)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/users"
              style={styles.link}
              onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
              onMouseOut={(e) => (e.target.style.color = styles.link.color)}
            >
              Users
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              style={styles.link}
              onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
              onMouseOut={(e) => (e.target.style.color = styles.link.color)}
            >
              Register
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              style={styles.link}
              onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
              onMouseOut={(e) => (e.target.style.color = styles.link.color)}
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;