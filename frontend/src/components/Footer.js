import React from 'react';

function Footer() {
  const styles = {
    footer: {
      backgroundColor: '#0d3a7d', // Navy blue background
      color: '#ffffff', // White text
      padding: '1rem 2rem',
      textAlign: 'center',
      position: 'relative',
      bottom: 0,
      width: '100%',
      boxShadow: '0 -4px 6px rgba(0, 0, 0, 0.2)', // Slight shadow for depth
    },
    links: {
      display: 'flex',
      justifyContent: 'center',
      gap: '1.5rem',
      margin: '1rem 0',
      listStyle: 'none',
      padding: 0,
    },
    link: {
      color: '#ffcc00', // Bright yellow for links
      textDecoration: 'none',
      fontWeight: 'bold',
      transition: 'color 0.3s ease',
    },
    linkHover: {
      color: '#ffffff', // White on hover
    },
    copyright: {
      fontSize: '0.9rem',
      marginTop: '1rem',
    },
  };

  return (
    <footer style={styles.footer}>
      <ul style={styles.links}>
        <li>
          <a
            href="/about"
            style={styles.link}
            onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
            onMouseOut={(e) => (e.target.style.color = styles.link.color)}
          >
            About Us
          </a>
        </li>
        <li>
          <a
            href="/contact"
            style={styles.link}
            onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
            onMouseOut={(e) => (e.target.style.color = styles.link.color)}
          >
            Contact
          </a>
        </li>
        <li>
          <a
            href="/privacy"
            style={styles.link}
            onMouseOver={(e) => (e.target.style.color = styles.linkHover.color)}
            onMouseOut={(e) => (e.target.style.color = styles.link.color)}
          >
            Privacy Policy
          </a>
        </li>
      </ul>
      <p style={styles.copyright}>
        &copy; {new Date().getFullYear()} Health and Fitness Center. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;