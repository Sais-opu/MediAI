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