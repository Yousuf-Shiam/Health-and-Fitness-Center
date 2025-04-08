import React, { useEffect, useState } from 'react';
import ServiceComponent from '../components/Services/ServiceComponent';
import { fetchServices } from '../utils/api';

const ServicePage = () => {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getServices = async () => {
            try {
                const data = await fetchServices();
                setServices(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getServices();
    }, []);

    if (loading) return <div>Loading services...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h1>Available Services</h1>
            {services.length > 0 ? (
                services.map(service => (
                    <ServiceComponent key={service._id} service={service} />
                ))
            ) : (
                <div>No services available at the moment.</div>
            )}
        </div>
    );
};

export default ServicePage;