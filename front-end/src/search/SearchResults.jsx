import { useState } from 'react'
import BuildingCard from '../buildings/BuildingCard'
import ReportCard from '../components/ReportCard'
import './SearchResults.css'

// The full results with a Buildings tab and a Barriers tab (M05, M06)
function SearchResults({ buildings, reports, locations }) {
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

      {/* Newest-first order comes with the shared reports in #86 */}
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
