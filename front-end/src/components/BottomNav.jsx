import { NavLink } from 'react-router-dom'
import './BottomNav.css'

function BottomNav() {
  return (
    <nav className="bottom-nav" aria-label="Main sections">
      {[
        { path: '/', label: 'Home' },
        { path: '/search', label: 'Search' },
        { path: '/report', label: 'Report' },
        { path: '/browse', label: 'Browse' },
      ].map((option) => (
        <NavLink
          key={option.path}
          to={option.path}
          end={option.path === '/'}
          className="bottom-nav__tab"
        >
          {option.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav
