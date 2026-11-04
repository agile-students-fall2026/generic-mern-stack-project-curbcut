import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import FloorsAndElevators from './FloorsAndElevators'
import './BuildingDetails.css'

function BuildingDetails({
  buildingId,
  reports = null,
  getEntranceHref,
  getReportHref,
  browseReportsHref,
  reportBarrierHref,
  onBack,
}) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadBuilding() {
      try {
        const buildingResponse = await fetch(
          `${import.meta.env.BASE_URL}data/buildings.json`,
        )
        const locationResponse = await fetch(
          `${import.meta.env.BASE_URL}data/locations.json`,
        )
        if (!buildingResponse.ok || !locationResponse.ok) {
          throw new Error('Could not load building information')
        }
        const buildingData = await buildingResponse.json()
        const locations = await locationResponse.json()
        if (
          !Array.isArray(buildingData.buildings) ||
          !Array.isArray(locations)
        ) {
          throw new Error('Invalid building information')
        }
        if (!cancelled) {
          setData({ buildings: buildingData.buildings, locations: locations })
          setStatus('ready')
        }
      } catch {
        if (!cancelled) {
          setStatus('error')
        }
      }
    }

    loadBuilding()
    return () => {
      cancelled = true
    }
  }, [reloadCount])

  function retryLoading() {
    setStatus('loading')
    setReloadCount(reloadCount + 1)
  }

  function getAccessSummary(entrance) {
    let summary = 'Step-free access unknown'
    if (entrance.stepFree === true) {
      summary = 'Step-free'
    } else if (entrance.stepFree === false) {
      summary = 'Not step-free'
    }
    if (entrance.stepFreeDetails) {
      summary += ` · ${entrance.stepFreeDetails}`
    }
    if (entrance.doorType) {
      summary += ` · ${entrance.doorType}`
    }
    return summary
  }

  function formatReportTime(value) {
    if (!value) {
      return 'Time unavailable'
    }
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) {
      return 'Time unavailable'
    }
    return date.toLocaleString()
  }

  if (status === 'loading') {
    return (
      <main className="building-details">
        <button
          className="building-details-back"
          type="button"
          onClick={onBack}
        >
          ← Back
        </button>
        <p role="status">Loading building information…</p>
      </main>
    )
  }
  if (status === 'error') {
    return (
      <main className="building-details">
        <button
          className="building-details-back"
          type="button"
          onClick={onBack}
        >
          ← Back
        </button>
        <p role="alert">We couldn’t load this building’s information.</p>
        <button
          className="building-details-retry"
          type="button"
          onClick={retryLoading}
        >
          Try again
        </button>
      </main>
    )
  }

  const building = data.buildings.find((item) => item.id === buildingId)
  if (!building || building.availability !== 'available') {
    return (
      <main className="building-details">
        <button
          className="building-details-back"
          type="button"
          onClick={onBack}
        >
          ← Back
        </button>
        <h1 className="building-details-title">Building unavailable</h1>
        <p>This building is not currently covered by CurbCut.</p>
      </main>
    )
  }

  const locations = data.locations.filter(
    (location) => location.buildingId === buildingId,
  )
  const entrances = locations.filter(
    (location) => location.locationType === 'entrance',
  )
  const floors = locations.filter(
    (location) => location.locationType === 'floor',
  )
  let elevatorCount = 'Unknown'
  if (Array.isArray(building.elevators)) {
    elevatorCount = building.elevators.length
  }

  let buildingReports = []
  let activeReportCount = 'Unavailable'
  if (reports !== null) {
    buildingReports = reports.filter(
      (report) => report.buildingId === buildingId,
    )
    activeReportCount = buildingReports.filter(
      (report) => report.status === 'Active',
    ).length
  }
  const recentReports = buildingReports
    .sort((first, second) => {
      const difference = new Date(second.updatedAt) - new Date(first.updatedAt)
      if (difference === 0) {
        return first.id.localeCompare(second.id)
      }
      return difference
    })
    .slice(0, 2)

  return (
    <main className="building-details">
      <button className="building-details-back" type="button" onClick={onBack}>
        ← Back
      </button>
      {building.photo && (
        <img
          className="building-details-photo"
          src={building.photo.url}
          alt={building.photo.alt || `${building.name} exterior`}
        />
      )}
      <h1 className="building-details-title">{building.name}</h1>
      <p className="building-details-address">
        {building.address || 'Address not documented'}
      </p>
      <dl className="building-details-summary">
        <div className="building-details-stat">
          <dt>Active reports</dt>
          <dd className="building-details-count">{activeReportCount}</dd>
        </div>
        <div className="building-details-stat">
          <dt>Documented entrances</dt>
          <dd className="building-details-count">{entrances.length}</dd>
        </div>
        <div className="building-details-stat">
          <dt>Documented elevators</dt>
          <dd className="building-details-count">{elevatorCount}</dd>
        </div>
      </dl>
      <Link className="building-details-report-button" to={reportBarrierHref}>
        Report a barrier here
      </Link>

      <section
        className="building-details-section"
        aria-labelledby="entrances-heading"
      >
        <p className="building-details-label">Documented information</p>
        <h2 className="building-details-heading" id="entrances-heading">
          Entrances
        </h2>
        {entrances.length === 0 && (
          <p>No entrances have been documented yet.</p>
        )}
        <ul className="building-details-list">
          {entrances.map((entrance) => {
            let reportSummary = 'Reports unavailable'
            if (reports !== null) {
              const count = buildingReports.filter(
                (report) =>
                  report.entranceId === entrance.locationId &&
                  report.status === 'Active',
              ).length
              reportSummary = `${count} active reports`
              if (count === 1) {
                reportSummary = '1 active report'
              }
            }
            return (
              <li key={entrance.locationId}>
                <Link
                  className="building-details-entrance"
                  to={getEntranceHref(buildingId, entrance.locationId)}
                >
                  <div>
                    <h3 className="building-details-entrance-name">
                      {entrance.locationName}
                    </h3>
                    <p className="building-details-access">
                      {getAccessSummary(entrance)}
                    </p>
                  </div>
                  <span className="building-details-report-count">
                    {reportSummary}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      <FloorsAndElevators floors={floors} elevators={building.elevators} />
      <p className="building-details-note">
        Sample data, not verified. Last verified:{' '}
        {building.lastVerifiedAt || 'Unavailable'}
      </p>

      <section
        className="building-details-section"
        aria-labelledby="recent-reports-heading"
      >
        <p className="building-details-label">Community reports</p>
        <div className="building-details-section-heading">
          <h2 className="building-details-heading" id="recent-reports-heading">
            Recent reports
          </h2>
          <Link className="building-details-link" to={browseReportsHref}>
            See all
          </Link>
        </div>
        {reports === null && <p>Community reports are unavailable.</p>}
        {reports !== null && buildingReports.length === 0 && (
          <p>
            No community reports for this building yet. This does not mean the
            building is accessible.
          </p>
        )}
        <ul className="building-details-list">
          {recentReports.map((report) => {
            const location = locations.find(
              (item) =>
                item.locationId === report.entranceId ||
                item.locationId === report.floorId,
            )
            let locationName = 'Location not documented'
            if (location) {
              locationName = location.locationName
            }
            return (
              <li key={report.id}>
                <Link
                  className="building-details-report"
                  to={getReportHref(report.id)}
                >
                  <div className="building-details-report-heading">
                    <span>{report.category}</span>
                    <span>{report.status}</span>
                  </div>
                  <p className="building-details-description">
                    {report.description}
                  </p>
                  <p className="building-details-report-meta">{locationName}</p>
                  <p className="building-details-report-meta">
                    Observed: {formatReportTime(report.observedAt)}
                  </p>
                  <p className="building-details-report-meta">
                    Updated: {formatReportTime(report.updatedAt)}
                  </p>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>
    </main>
  )
}

export default BuildingDetails
