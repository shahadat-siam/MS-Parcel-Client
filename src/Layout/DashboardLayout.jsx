import React from 'react';
import { Link, Outlet } from 'react-router';

const DashboardLayout = () => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col  ">

                {/* Navbar */}
                <div className="navbar bg-base-300 lg:hidden w-full">
                    <div className="flex-none">
                        <label htmlFor="my-drawer-3" aria-label="open sidebar" className="btn btn-square btn-ghost">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-6 w-6 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16"
                                ></path>
                            </svg>
                        </label>
                    </div>
                    <div className="mx-2 flex-1 px-2">Dashboard</div>

                </div>

                {/* Page content here */}
                <Outlet />

            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer-3" aria-label="close sidebar" className="drawer-overlay"></label>
                <ul className="menu bg-base-300 min-h-full w-60 p-4">
                    {/* Sidebar content here */}
                     <Link to={'/'}><li><a>Home</a></li></Link>
                    <li><a>Sidebar Item 2</a></li>
                </ul>
            </div>
        </div>
    );
};

export default DashboardLayout;