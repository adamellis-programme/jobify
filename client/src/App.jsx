import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import {
  HomeLayout,
  Landing,
  Register,
  Login,
  DashboardLayout,
  Error,
  AddJob,
  Stats,
  AllJobs,
  Profile,
  Admin,
  EditJob,
} from './pages'
import { action as registerAction } from './pages/Register'
import { action as loginAction } from './pages/Login'
import { loader as dashboardLoader } from './pages/DashboardLayout'
import { action as addJobAction } from './pages/AddJob'
import { loader as allJobsLoader } from './pages/AllJobs'

import { loader as editJobLoader } from './pages/EditJob'
import { action as editJobAction } from './pages/EditJob'

import { action as deleteJobAction } from './pages/DeleteJob'
import { loader as adminLoader } from './pages/Admin'

import { action as profileAction } from './pages/Profile'
import { loader as statsLoader } from './pages/Stats'
/**
 * each route is an object
 * path what we see when we navigate to a specific url / = domain: localhost or wwww.
 *
 * http://localhost:5173/dashboard/admin nested routes
 *
 * ask why not / ... relative?
 */

// runs when the component mounts
// App.js runs once so when the user logs out we get inconsistoncies so we need to export the function
// was originally passed down to the <Dashboard/> component as john made the dashboard component the ENTRY POINT to the whole app
export const checkDefaultTheme = () => {
  // 'true as a string in local storage' retrurns a boolean of the representatin in local storage.
  const isDarkTheme = localStorage.getItem('darkTheme') === 'true'
  // console.log(isDarkTheme)
  document.body.classList.toggle('dark-theme', isDarkTheme)
  return isDarkTheme
}

checkDefaultTheme()

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />,
      },
      {
        path: 'register',
        element: <Register />,
        action: registerAction,
        // action: () => {
        //   console.log('hello there ')
        //   return null
        // },
      },
      {
        path: 'login',
        element: <Login />,
        action: loginAction,
      },
      {
        path: 'dashboard',
        element: <DashboardLayout />,
        loader: dashboardLoader,
        children: [
          {
            index: true, // right away displayed to the user
            element: <AddJob />,
            action: addJobAction,
          },
          { path: 'stats', element: <Stats />, loader: statsLoader },
          {
            path: 'all-jobs',
            element: <AllJobs />,
            loader: allJobsLoader,
          },

          {
            path: 'profile',
            element: <Profile />,
            action: profileAction,
          },
          {
            path: 'admin',
            element: <Admin />,
            loader: adminLoader,
          },

          {
            path: 'edit-job/:id',
            element: <EditJob />,
            loader: editJobLoader, // get the values
            action: editJobAction, // edit the values
          },
          // setting action to ...
          { path: 'delete-job/:id', action: deleteJobAction },
        ],
      },
    ],
  },
])
const App = () => {
  return <RouterProvider router={router}></RouterProvider>
}

export default App
