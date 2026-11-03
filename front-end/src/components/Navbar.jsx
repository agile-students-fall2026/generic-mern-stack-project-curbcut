import { useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const dialogRef = useRef(null)

  function openMenu() {
    dialogRef.current.showModal()
  }

  function closeMenu() {
    dialogRef.current.close()
  }

  return (
    <header className="navbar">
      <button
        type="button"
        className="navbar__icon-button"
        aria-label="Open menu"
        aria-haspopup="dialog"
        onClick={openMenu}
      >
        <span aria-hidden="true">☰</span>
      </button>

      <Link to="/" className="navbar__home-link">
        CurbCut
      </Link>

      <dialog
        ref={dialogRef}
        className="navbar__menu"
        aria-labelledby="menu-title"
      >
        <div className="navbar__menu-header">
          <h2 id="menu-title">Menu</h2>

          <button
            type="button"
            className="navbar__icon-button"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <nav className="navbar__links" aria-label="Main menu">
          {[
            { path: '/', label: 'Home' },
            { path: '/search', label: 'Search buildings' },
            { path: '/browse', label: 'Browse reports' },
            { path: '/report', label: 'Report a barrier' },
            { path: '/buildings', label: 'Supported buildings' },
            { path: '/about', label: 'About CurbCut' },
          ].map((option) => (
            <NavLink
              key={option.path}
              to={option.path}
              end={option.path === '/'}
              className="navbar__link"
              onClick={closeMenu}
            >
              {option.label}
            </NavLink>
          ))}
        </nav>
      </dialog>
    </header>
  )
}

export default Navbar
