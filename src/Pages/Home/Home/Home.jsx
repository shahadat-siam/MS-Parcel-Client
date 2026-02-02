import React from 'react';
import Banner from '../Banner/Banner';
import ServicesSection from '../Services/ServicesSection';
import ClientLogosMarquee from './ClientLogo/ClientLogosMarquee';
import ParcelFeatures from '../ParcelFeatures/ParcelFeatures';
import BeMarchent from '../BeMarchent/BeMarchent';

const Home = () => {
    return (
        <div className=''>
            <Banner/>
            <ServicesSection/>
            <ClientLogosMarquee/>
            <ParcelFeatures/>
            <BeMarchent/>
        </div>
    );
};

export default Home;