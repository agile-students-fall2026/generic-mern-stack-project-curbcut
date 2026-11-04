import { Link } from 'react-router-dom'
import ReportCard from '../components/ReportCard'
import './Home.css'

// The first screen of the app (M01)
function Home() {
  // Reports will come from Abdullah's shared report list
  // Until then there are no reports to show.
  const reports = []

  // Only the first 4 reports are shown on Home
  const recentReports = reports.slice(0, 4)

  return (
    <main className="home">
      <h1 className="home__title">Check before you go</h1>

      <p className="home__intro">
        See recent barrier reports from students before you head to Kimmel
        Center.
      </p>

      {/* This link looks like a search box and opens the Search screen */}
      <Link to="/search" className="home__search">
        Search buildings or barriers
      </Link>

      <Link to="/report" className="home__button">
        + Report a barrier
      </Link>

      <div className="home__row">
        <h2 className="home__subtitle">Recently updated</h2>

        <Link to="/browse" className="home__link">
          See all
        </Link>
      </div>

      {recentReports.length === 0 && (
        <p className="home__empty">
          No reports have been posted yet. This does not mean there are no
          barriers.
        </p>
      )}

      {/* Location names are added when the shared data is connected */}
      <div className="home__list">
        {recentReports.map((report) => (
          <ReportCard key={report.id} report={report} locations={[]} />
        ))}
      </div>

      <Link to="/about" className="home__link">
        About CurbCut
      </Link>
    </main>
  )
}

export default Home