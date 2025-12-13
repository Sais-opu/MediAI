import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { RouterProvider } from 'react-router-dom'

import { createBrowserRouter } from 'react-router-dom'
import ErrorPage from './Components/ErrorPage.jsx'
import Home from './Components/Home/Home.jsx'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Components/Auth/Login.jsx';
import Register from './Components/Auth/Register.jsx';
import { AuthProvider } from './Components/Auth/AuthProvider.jsx';
import Users from './Components/Users/Users.jsx';
import Protected from './Components/Auth/ProtectedRoute.jsx'
import UserSettings from './Components/Profiles/usersettings.jsx';

// Doctor features
import DoctorList from './Components/DOCTOR/DoctorList.jsx';
import DoctorProfile from './Components/DOCTOR/DoctorProfile.jsx';
import DoctorSchedule from './Components/DOCTOR/DoctorSchedule.jsx';


import BookingScreen from './Components/booking/BookingScreen.jsx';
import PatientBooking from './Components/booking/PatientBooking.jsx';
import PaymentPage from './Components/Payment/PaymentPage.jsx';
//import InvoicePage from './Components/Payment/InvoicePage.jsx';



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
      // Doctor Routes
      {
        path: "/doctors",
        element: <DoctorList />,
      },
      {
        path: "/doctor/:id",
        element: <DoctorProfile />,
      },
      {
        path: "/doctor/:id/schedule",
        element: (
          <Protected>
            <DoctorSchedule />
          </Protected>
        ),
      },

      // Patient Booking Flow
      {
        path: "/book-appointment",
        element: (
          <Protected>
            <BookingScreen />
          </Protected>
        ),
      },
      // Simple slot picker page
      {
        path: "/book/:doctorId",
        element: (
          <Protected>
            <PatientBooking />
          </Protected>
        ),
      },

      // Payment
      {
        path: "/payment/:appointmentId/:amount",
        element: (
          <Protected>
            <PaymentPage />
          </Protected>
        ),
      },

      
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