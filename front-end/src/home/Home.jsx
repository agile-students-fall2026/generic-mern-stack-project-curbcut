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
  // The entrances and floors, so each card can show where its report is
  const [locations, setLocations] = useState([])

  // When the page opens, ask the back end for the entrances and floors
  useEffect(() => {
    async function loadLocations() {
      try {
        const response = await fetch('/api/locations')
        const data = await response.json()

        setLocations(data)
      } catch {
        // If the back end cannot be reached, the cards say "Unknown location"
      }
    }

    loadLocations()
  }, [])

  // The 4 most recently updated reports
  const newestReports = sortNewestFirst(reports)
  const recentReports = []

  for (const report of newestReports) {
    if (recentReports.length < 4) {
      recentReports.push(report)
    }
  }

  // Say there are no reports, but only once they have finished loading
  let showNoReports = false

  if (!loading && recentReports.length === 0) {
    showNoReports = true
  }

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

      {showNoReports && (
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
