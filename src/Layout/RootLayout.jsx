import React from 'react';
import { Outlet } from 'react-router';
import Navbar from '../Pages/Shared/Navbar/Navbar';
import Footer from '../Pages/Shared/Footer/Footer';

const RootLayout = () => {
    return (
        <div>
            <Navbar/>
             <div className='min-h-[50vh]'>
                <Outlet/>
             </div>
            <Footer/>
        </div>
    );
};

export default RootLayout;