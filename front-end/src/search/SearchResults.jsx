import { useState } from 'react'
import { Link } from 'react-router-dom'
import BuildingCard from '../buildings/BuildingCard'
import ReportCard from '../components/ReportCard'
import './SearchResults.css'

// The full results with a Buildings tab and a Barriers tab (M05 to M07)
function SearchResults({ search, buildings, reports, locations, onNewSearch }) {
  // Which tab is open: 'buildings' or 'barriers'
  const [tab, setTab] = useState('buildings')

  // The open tab is underlined in blue
  let buildingsTabClass = 'results__tab'
  let barriersTabClass = 'results__tab'

  if (tab === 'buildings') {
    buildingsTabClass = 'results__tab results__tab--open'
  } else {
    barriersTabClass = 'results__tab results__tab--open'
  }

  return (
    <div className="results">
      <div className="results__tabs">
        <button
          type="button"
          className={buildingsTabClass}
          onClick={() => setTab('buildings')}
        >
          Buildings ({buildings.length})
        </button>

        <button
          type="button"
          className={barriersTabClass}
          onClick={() => setTab('barriers')}
        >
          Barriers ({reports.length})
        </button>
      </div>

      {/* Buildings tab with no matching buildings */}
      {tab === 'buildings' && buildings.length === 0 && (
        <div className="results__empty">
          <p>
            No supported buildings match "{search}". CurbCut currently covers
            floors 1 to 5 of Kimmel Center.
          </p>

          <Link to="/buildings" className="results__link">
            See supported buildings
          </Link>

          <button
            type="button"
            className="results__again"
            onClick={onNewSearch}
          >
            Try a new search
          </button>
        </div>
      )}

      {/* Barriers tab with no matching reports */}
      {tab === 'barriers' && reports.length === 0 && (
        <div className="results__empty">
          <p>
            No barrier reports match "{search}". This does not mean there are no
            barriers there.
          </p>

          <button
            type="button"
            className="results__again"
            onClick={onNewSearch}
          >
            Try a new search
          </button>
        </div>
      )}

      {/* Hoang's building card, the same one used on Supported buildings */}
      {tab === 'buildings' && (
        <div className="results__list">
          {buildings.map((building) => (
            <BuildingCard
              key={building.id}
              building={building}
              locations={locations}
              locationStatus="ready"
              href={`/buildings/${building.id}`}
            />
          ))}
        </div>
      )}

      {/* The reports already come newest first from the Search screen */}
      {tab === 'barriers' && (
        <div className="results__list">
          {reports.map((report) => (
            <ReportCard key={report.id} report={report} locations={locations} />
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchResults
