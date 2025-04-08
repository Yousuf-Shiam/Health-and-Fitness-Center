import React from 'react';

const ServiceComponent = ({ services, onBookService }) => {
    return (
        <div className="service-component">
            <h2>Available Services</h2>
            <ul>
                {services.map(service => (
                    <li key={service.id}>
                        <h3>{service.type}</h3>
                        <p>Trainer: {service.trainer}</p>
                        <p>Schedule: {service.schedule}</p>
                        <button onClick={() => onBookService(service.id)}>Book Now</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ServiceComponent;