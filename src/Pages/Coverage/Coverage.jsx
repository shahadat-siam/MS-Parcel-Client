import React from 'react';
import AvailableArea from './AvailabelArea';
import { useLoaderData } from 'react-router';

const Coverage = () => {
    const serviceCenter = useLoaderData()
    console.log(serviceCenter)
    return (
        <div>
            <AvailableArea serviceCenter={serviceCenter}/>
        </div>
    );
};

export default Coverage;