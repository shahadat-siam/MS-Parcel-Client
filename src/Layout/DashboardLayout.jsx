import { NavLink, Outlet } from "react-router-dom";
import {
  FaHome,
  FaUserEdit,
  FaBoxOpen,
  FaHistory,
  FaMapMarkerAlt,
  FaSignOutAlt,
  FaUserClock,
  FaMotorcycle,
} from "react-icons/fa";
import useAuth from "../Hooks/useAuth";
import useUserRole from "../Hooks/useUserRole";

const DashboardLayout = () => {
  const { logOut } = useAuth();
  const { role, loadingRole } = useUserRole();
  // console.log(role);
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 ${
      isActive ? "text-[#0C7779] font-semibold" : "text-gray-600"
    }`;

  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />

      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="navbar bg-base-300 lg:hidden w-full">
          <div className="flex-none">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              ☰
            </label>
          </div>
          <div className="mx-2 flex-1 px-2 font-bold">Dashboard</div>
        </div> 
        {/* Page content */}
        <Outlet />
      </div>

      {/* Sidebar */}
      <div className="drawer-side  ">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>

        <ul className="menu bg-[#cde3ec] min-h-full w-60 p-4 flex flex-col justify-between">
          {/* Top menu items */}
          <div className="space-y-2">
            <li>
              <NavLink to="/" className={navLinkClass}>
                <FaHome /> Home
              </NavLink>
            </li>

            {/* <li>
              <NavLink to="/dashboard/update-profile" className={navLinkClass}>
                <FaUserEdit /> My Profile
              </NavLink>
            </li> */}

            <li>
              <NavLink to="/dashboard/myparcels" className={navLinkClass}>
                <FaBoxOpen /> My Parcels
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/payment-history" className={navLinkClass}>
                <FaHistory /> Payment History
              </NavLink>
            </li>

            <li>
              <NavLink to="/dashboard/trackparcel" className={navLinkClass}>
                <FaMapMarkerAlt /> Tracking
              </NavLink>
            </li>
            {!loadingRole && role === 'rider' && (
              <>
                 <li>
                  <NavLink
                    to="/dashboard/pending-assignedparcel"
                    className={navLinkClass}
                  >
                    <FaMotorcycle /> AssignParcel
                  </NavLink>
                </li>
              </>
            )}
            {!loadingRole && role === "admin" && (
              <>
                <li>
                  <NavLink
                    to="/dashboard/active-riders"
                    className={navLinkClass}
                  >
                    <FaMotorcycle /> Active Riders
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/pending-riders"
                    className={navLinkClass}
                  >
                    <FaUserClock /> Pending Riders
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dashboard/assign-riders"
                    className={navLinkClass}
                  >
                    <FaMotorcycle /> Assign Riders
                  </NavLink>
                </li>

                <li>
                  <NavLink
                    to="/dashboard/manage-admin"
                    className={navLinkClass}
                  >
                    <FaUserClock /> Manage Admin
                  </NavLink>
                </li>
              </>
            )}
          </div>

          {/* Logout button bottom */}
          <div>
            <li>
              <button
                className="flex items-center gap-2 text-red-500 hover:text-red-700"
                onClick={logOut}
              >
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default DashboardLayout;
