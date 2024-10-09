// if true show show two classes else show one
// benifit of using styled components we do not have to be original with our class names

//  by default we always show the sidebar -> if state is false then we show the sidebar
//  flipped by default - we do not want to hide main menu every time we click
import NavLinks from './NavLinks'
import Logo from '../components/Logo'
import Wrapper from '../assets/wrappers/BigSidebar'
import { useDashboardContext } from '../pages/DashboardLayout'

const BigSidebar = () => {
  const { showSidebar } = useDashboardContext()
  return (
    <Wrapper>
      <div
        className={showSidebar ? 'sidebar-container ' : 'sidebar-container show-sidebar'}
      >
        <div className="content">
          <header>
            <Logo />
          </header>
          {/* if boolean prop we do not need to pass a value  */}
          {/* in big sidebar check if present then null do nothing */}
          <NavLinks isBigSidebar />
        </div>
      </div>
    </Wrapper>
  )
}

export default BigSidebar
