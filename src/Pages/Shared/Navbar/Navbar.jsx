import React from 'react';
import { NavLink } from 'react-router';
import MsParcelLogo from '../MsParcelLogo/MsParcelLogo';
import { GoArrowUpRight } from 'react-icons/go';

const Navbar = () => {
    const navItems = <>
        <li><NavLink to="/">Home</NavLink></li> 
        <li><NavLink to="/about">About Us</NavLink></li> 
         
    </>
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                </div>
                <ul
                    tabIndex="-1"
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    {navItems}
                </ul>
                </div>
                <a className="">
                    <MsParcelLogo/>
                </a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
               {navItems}
                </ul>
            </div>
            <div className="navbar-end gap-2">
                <NavLink to={'login'}><a className="btn btn-outline btn-primary rounded-md text-slate-700">Sign in</a></NavLink>
                <NavLink to={'signup'}><a className="btn bg-primary rounded-md">Sign up</a></NavLink>
                <a className="btn btn-circle text-xl bg-black text-primary"><GoArrowUpRight /></a>
            </div>
        </div>
    );
};

export default Navbar;