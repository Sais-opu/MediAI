import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from './Components/ErrorPage.jsx'
import Home from './Components/Home/Home.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './Components/Auth/Login.jsx';
import Register from './Components/Auth/Register.jsx';
import { AuthProvider } from './Components/Auth/AuthProvider.jsx';
import Protected from './Components/Auth/ProtectedRoute.jsx'

import Users from './Components/Users/Users.jsx';
import UserSettings from './Components/Profiles/usersettings.jsx';
import HealthTools from './Components/HealthTools/HealthTools.jsx';
import BMICalculator from './Components/HealthTools/BMICalculator.jsx';
import WaterIntakeTracker from './Components/HealthTools/WaterIntakeTracker.jsx';
import SleepDurationTracker from './Components/HealthTools/SleepDurationTracker.jsx';
import DoctorCard from './Components/Doctor/DoctorCard.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/doctorCard",
        element: <DoctorCard />,
      },
      {
        path: "/users",
        element: 
          <Protected>
            <Users />
          </Protected >,
      },
      {
        path: "/user-settings",
        element: (
          <Protected>
            <UserSettings />
          </Protected>
        ),
      },
      {
        path: "/health-tools",
        element: (
          <Protected>
            <HealthTools />
          </Protected>
        ),
      },
      {
        path: "/health-tools/bmi",
        element: (
          <Protected>
            <BMICalculator />
          </Protected>
        ),
      },
      {
        path: "/health-tools/water",
        element: (
          <Protected>
            <WaterIntakeTracker />
          </Protected>
        ),
      },
      {
        path: "/health-tools/sleep",
        element: (
          <Protected>
            <SleepDurationTracker />
          </Protected>
        ),
      }
    ]
  },
  // add more routes as needed
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </AuthProvider>
  </StrictMode>,
)