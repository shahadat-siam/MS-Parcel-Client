import React from 'react';
import Banner from '../Banner/Banner';
import ServicesSection from '../Services/ServicesSection';
import ClientLogosMarquee from './ClientLogo/ClientLogosMarquee';

const Home = () => {
    return (
        <div>
            <Banner/>
            <ServicesSection/>
            <ClientLogosMarquee/>
        </div>
    );
};

export default Home;