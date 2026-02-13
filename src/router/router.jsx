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
import Statistic from "../Pages/Dashboard/MyParcel/Statistic";
import Payment from "../Pages/Dashboard/Payment/Payment";

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
        path: '',
        Component: Statistic
      },
      {
        path: 'myparcels',
        Component: MyParcel
      },
      {
        path: 'payment/:id',
        Component: Payment
      }
    ]
  }
]);
