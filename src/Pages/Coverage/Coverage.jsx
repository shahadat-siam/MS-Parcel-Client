import React from 'react';
import AvailableArea from './AvailabelArea';
import { useLoaderData } from 'react-router';

const Coverage = () => {
    const serviceCenter = useLoaderData()
    console.log(serviceCenter)
    return (
        <div>
            <h2 className="text-3xl px-12 pt-2 font-semibold">We are available in 64 districts</h2>
            <AvailableArea serviceCenter={serviceCenter}/>
        </div>
    );
};

export default Coverage;