import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ReportCard from '../components/ReportCard'
import useReports from '../reports/useReports'
import sortNewestFirst from '../reports/sortNewestFirst'
import './Home.css'

// The first screen of the app (M01)
function Home() {
  // Abdullah's shared list of reports (#65)
  const { reports, loading } = useReports()
  const [locations, setLocations] = useState([])

  // Load the entrances and floors once, so each card can show its location
  useEffect(() => {
    fetch('/data/locations.json')
      .then((response) => response.json())
      .then((data) => setLocations(data))
      .catch(() => setLocations([]))
  }, [])

  // The 4 most recently updated reports
  const recentReports = sortNewestFirst(reports).slice(0, 4)

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

      {!loading && recentReports.length === 0 && (
        <p className="home__empty">
          No reports have been posted yet. This does not mean there are no
          barriers.
        </p>
      )}

      <div className="home__list">
        {recentReports.map((report) => (
          <ReportCard key={report.id} report={report} locations={locations} />
        ))}
      </div>

      <Link to="/about" className="home__link">
        About CurbCut
      </Link>
    </main>
  )
}

export default Home
