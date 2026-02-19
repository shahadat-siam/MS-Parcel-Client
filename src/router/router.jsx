import { createBrowserRouter } from "react-router";
import RootLayout from "../Layout/RootLayout";
import Home from "../Pages/Home/Home/Home";
import AuthLayout from "../Layout/AuthLayout";
import Login from "../Pages/Authentication/Login/Login";
import Register from "../Pages/Authentication/Login/Register/Register";
import Coverage from "../Pages/Coverage/Coverage";
import PrivateRoute from "../Routes/PrivateRoute";
import SendParcel from "../Pages/SendParcel/SendParcel";
import DashboardLayout from "../Layout/DashboardLayout";
import MyParcel from "../Pages/Dashboard/MyParcel/MyParcel";
import MyProfile from "../Pages/Dashboard/Profile/MyProfile";
import Payment from "../Pages/Dashboard/Payment/Payment";
import PaymentHistory from "../Pages/Dashboard/PaymentHistory/PaymentHistory";
import TrackParcel from "../Pages/Dashboard/TrackParcel/TrackParcel";
import BeARider from "../Pages/Dashboard/BeARider/BeARider";
import PendingRider from "../Pages/Dashboard/PendingRiders/PendingRiders";
import ActiveRiders from "../Pages/Dashboard/ActiveRiders/ActiveRiders";
import ManageAdmin from "../Pages/Dashboard/ManageAdmin/ManageAdmin";
import Forbidden from "../Pages/Shared/Forbidden/Forbidden";
import AdminRoutes from "../Routes/AdminRoutes";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: 'coverage',
        Component: Coverage,
        loader: () => fetch('./availablearea.json')
      },
      {
        path: 'sendParcel',
        element: <PrivateRoute><SendParcel/></PrivateRoute>
      },
      {
        path: 'beArider',
        element: <PrivateRoute><BeARider/></PrivateRoute>
      },
      {
        path: 'forbidden',
        Component: Forbidden
      }
    ],
  },

  {
    path: "/",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: Login,
      },
      {
        path: "signup",
        Component: Register
      }
    ],
  },

  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout/></PrivateRoute>,
    children: [ 
      {
        path: 'update-profile',
        Component: MyProfile
      },
      {
        path: 'myparcels',
        Component: MyParcel
      },
      {
        path: 'payment/:id',
        Component: Payment
      },
      {
        path: 'payment-history',
        Component: PaymentHistory
      },
      {
        path: 'trackparcel',
        Component: TrackParcel
      },
      {
        path: 'pending-riders', 
        element: <AdminRoutes><PendingRider/></AdminRoutes>
      },
      {
        path: 'active-riders',
        element: <AdminRoutes><ActiveRiders/></AdminRoutes>
      },
      {
        path: 'manage-admin',
        element: <AdminRoutes><ManageAdmin/></AdminRoutes>
      }
    ]
  }
]);
