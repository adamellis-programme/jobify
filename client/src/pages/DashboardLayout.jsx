// DASHBOARD LAYOUT IS THE MAIN ENTRY POINT TO THIS APP
// and is used to access all children components of the app
// exept for the login, register, logout etc!

import { Outlet, redirect, useLoaderData, useNavigate } from 'react-router-dom'
import customFetch from '../utils/customFetch'
import Wrapper from '../assets/wrappers/Dashboard'
import { Navbar, BigSidebar, SmallSidebar } from '../components'

import { useState, createContext, useContext } from 'react'

import { checkDefaultTheme } from '../App'
const DashboardContext = createContext()

export const loader = async () => {
  try {
    const { data } = await customFetch('/users/current-user')

    return data
  } catch (error) {
    console.log(error)
    return redirect('/')
  }
}
const DashboardLayout = () => {
  const navigate = useNavigate()
  const { user } = useLoaderData()
  // console.log(user)

  // temp

  const [showSidebar, setShowSidebar] = useState(false)
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme())

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme

    setIsDarkTheme(newDarkTheme)

    document.body.classList.toggle('dark-theme', newDarkTheme)
    localStorage.setItem('darkTheme', newDarkTheme)
  }

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  const logoutUser = async () => {
    navigate('/')
    await customFetch.get('/auth/logout')
    toast.success('Logging out...')
  }

  return (
    //  stops prop drilling
    <DashboardContext.Provider
      // <DashboardContext.Provider IS USES FOR
      // small sidebar, big sidebar and nav bar BUT NOT THE OUTLET
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className="dashboard">
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className="dashboard-page">
              {/* outlet needs the global context  */}
              {/*INSTEAD OF USING   <DashboardContext.Provider  OUTLET HAS THE CONTEX PROVIDER */}
              {/* THIS ONE IS FOR ALL THE COMPONENTS INSIDE PAGES AND COMPONENTS INSIDE THOSE PAGES  */}
              <Outlet context={{ user }} />
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  )
}

// custom hook so we do not need to export the main context
export const useDashboardContext = () => useContext(DashboardContext)

export default DashboardLayout
