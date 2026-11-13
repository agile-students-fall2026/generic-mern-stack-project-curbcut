import { Link } from 'react-router-dom'
import './NotFoundPage.css'

// Shown when the address does not match any screen in the app
function NotFoundPage() {
  return (
    <main className="not-found">
      <h1 className="not-found__title">Page not found</h1>

      <p className="not-found__text">
        We could not find this page. The address may be wrong, or the page may
        have moved.
      </p>

      <Link to="/" className="not-found__button">
        Go to Home
      </Link>

      <Link to="/search" className="not-found__link">
        Search buildings or barriers
      </Link>
    </main>
  )
}

export default NotFoundPage
