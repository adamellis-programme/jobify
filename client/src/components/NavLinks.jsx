import { useDashboardContext } from '../pages/DashboardLayout'
import links from '../utils/links'
import { NavLink } from 'react-router-dom'
// no inport export syntax in index.js as we are only using it here
const NavLinks = ({ isBigSidebar }) => {
  const { user, toggleSidebar } = useDashboardContext()

  return (
    <div className="nav-links">
      {links.map((link) => {
        const { text, path, icon } = link
        // console.log(path)
        // admin user
        const { role } = user
        // this stops the admin link being shown
        // we have a route guard in the loader that redirects if not admin
        // if not admin wil throw error and redirect
        if (path === 'admin' && role !== 'admin') return
        return (
          <NavLink
            to={path}
            key={text}
            onClick={isBigSidebar ? null : toggleSidebar}
            className="nav-link"
            // end so we do not show active on parent
            end
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
        )
      })}
    </div>
  )
}

export default NavLinks
