import React from 'react';
import Logo from "../../../assets/logo.png"

const MsParcelLogo = () => {
    return (
        <div className='flex items-end'>
            <img className='mb-2' src={Logo} alt="" />
            <p className='text-3xl -ml-2 font-extrabold'>MS Parcel</p>
        </div>
    );
};

export default MsParcelLogo;