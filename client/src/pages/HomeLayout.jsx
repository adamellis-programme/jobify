import { Outlet } from 'react-router-dom'

const HomeLayout = () => {
  return (
    <>
      {/* navbar we share across the page  */}
      {/* <nav>navbar</nav> */}
      {/* content we have inside the routes */}
      <Outlet />
    </>
  )
}

export default HomeLayout
