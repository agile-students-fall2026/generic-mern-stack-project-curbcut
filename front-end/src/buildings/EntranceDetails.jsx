import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './EntranceDetails.css'

function EntranceDetails({
  buildingId,
  entranceId,
  reports = null,
  buildingHref,
  getReportHref,
  reportBarrierHref,
}) {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadEntrance() {
      try {
        const buildingResponse = await fetch(
          `${import.meta.env.BASE_URL}data/buildings.json`,
        )
        const locationResponse = await fetch(
          `${import.meta.env.BASE_URL}data/locations.json`,
        )
        if (!buildingResponse.ok || !locationResponse.ok) {
          throw new Error('Could not load entrance information')
        }
        const buildingData = await buildingResponse.json()
        const locations = await locationResponse.json()
        if (
          !Array.isArray(buildingData.buildings) ||
          !Array.isArray(locations)
        ) {
          throw new Error('Invalid entrance information')
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

    loadEntrance()
    return () => {
      cancelled = true
    }
  }, [reloadCount])

  function retryLoading() {
    setStatus('loading')
    setReloadCount(reloadCount + 1)
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
      <main className="entrance-details">
        <Link className="entrance-details-back" to={buildingHref}>
          Back to building
        </Link>
        <p role="status">Loading entrance information…</p>
      </main>
    )
  }
  if (status === 'error') {
    return (
      <main className="entrance-details">
        <Link className="entrance-details-back" to={buildingHref}>
          Back to building
        </Link>
        <p role="alert">We couldn’t load this entrance’s information.</p>
        <button
          className="entrance-details-retry"
          type="button"
          onClick={retryLoading}
        >
          Try again
        </button>
      </main>
    )
  }

  const building = data.buildings.find((item) => item.id === buildingId)
  const entrance = data.locations.find(
    (location) =>
      location.buildingId === buildingId &&
      location.locationId === entranceId &&
      location.locationType === 'entrance',
  )
  if (!building || building.availability !== 'available' || !entrance) {
    return (
      <main className="entrance-details">
        <Link className="entrance-details-back" to={buildingHref}>
          Back to building
        </Link>
        <h1 className="entrance-details-title">Entrance unavailable</h1>
        <p>This entrance is not documented for the selected building.</p>
      </main>
    )
  }

  let stepFree = 'Unknown'
  if (entrance.stepFree === true) {
    stepFree = 'Yes'
  } else if (entrance.stepFree === false) {
    stepFree = 'No'
  }
  if (entrance.stepFreeDetails) {
    stepFree += ` · ${entrance.stepFreeDetails}`
  }

  let doorWidth = 'Width unknown'
  if (typeof entrance.doorWidthInches === 'number') {
    doorWidth = `${entrance.doorWidthInches} in wide`
  }

  let nearestElevator = 'Unknown'
  if (Array.isArray(building.elevators) && entrance.nearestElevatorId) {
    const elevator = building.elevators.find(
      (item) => item.id === entrance.nearestElevatorId,
    )
    if (elevator) {
      nearestElevator = elevator.name
    }
  }
  if (entrance.elevatorDirections) {
    nearestElevator += ` · ${entrance.elevatorDirections}`
  }

  let entranceReports = []
  if (reports !== null) {
    entranceReports = reports.filter(
      (report) =>
        report.buildingId === buildingId && report.entranceId === entranceId,
    )
  }
  entranceReports.sort((first, second) => {
    const difference = new Date(second.updatedAt) - new Date(first.updatedAt)
    if (difference === 0) {
      return first.id.localeCompare(second.id)
    }
    return difference
  })

  return (
    <main className="entrance-details">
      <Link className="entrance-details-back" to={buildingHref}>
        ← {building.name}
      </Link>
      {entrance.photo && (
        <img
          className="entrance-details-photo"
          src={entrance.photo.url}
          alt={
            entrance.photo.alt || `${entrance.locationName} at ${building.name}`
          }
        />
      )}
      <h1 className="entrance-details-title">{entrance.locationName}</h1>
      <p className="entrance-details-location">
        {building.name} · {entrance.location || 'Entrance location unavailable'}
      </p>

      <section
        className="entrance-details-access"
        aria-labelledby="entrance-access-heading"
      >
        <h2 className="entrance-details-heading" id="entrance-access-heading">
          Documented access information
        </h2>
        <dl className="entrance-details-facts">
          <div className="entrance-details-row">
            <dt className="entrance-details-term">Step-free</dt>
            <dd className="entrance-details-value">{stepFree}</dd>
          </div>
          <div className="entrance-details-row">
            <dt className="entrance-details-term">Door</dt>
            <dd className="entrance-details-value">
              {entrance.doorType || 'Door type unknown'} · {doorWidth}
            </dd>
          </div>
          <div className="entrance-details-row">
            <dt className="entrance-details-term">Ramp</dt>
            <dd className="entrance-details-value">
              {entrance.rampDetails || 'Unknown'}
            </dd>
          </div>
          <div className="entrance-details-row">
            <dt className="entrance-details-term">Nearest elevator</dt>
            <dd className="entrance-details-value">{nearestElevator}</dd>
          </div>
          <div className="entrance-details-row">
            <dt className="entrance-details-term">Opening hours</dt>
            <dd className="entrance-details-value">
              {entrance.openingHours || 'Unknown'}
            </dd>
          </div>
        </dl>
      </section>
      <p className="entrance-details-note">
        Sample data, not verified. Last verified:{' '}
        {entrance.lastVerifiedAt || 'Unavailable'}
      </p>

      <section
        className="entrance-details-reports"
        aria-labelledby="entrance-reports-heading"
      >
        <p className="entrance-details-label">Community reports</p>
        <h2 className="entrance-details-heading" id="entrance-reports-heading">
          Reports at this entrance
        </h2>
        {reports === null && <p>Community reports are unavailable.</p>}
        {reports !== null && entranceReports.length === 0 && (
          <p>No community reports for this entrance yet.</p>
        )}
        <ul className="entrance-details-list">
          {entranceReports.map((report) => (
            <li key={report.id}>
              <Link
                className="entrance-details-report"
                to={getReportHref(report.id)}
              >
                <div className="entrance-details-report-heading">
                  <span>{report.category}</span>
                  <span>{report.status}</span>
                </div>
                <h3 className="entrance-details-report-title">
                  {report.title || report.description}
                </h3>
                {report.title && <p>{report.description}</p>}
                <p className="entrance-details-report-meta">
                  Observed: {formatReportTime(report.observedAt)}
                </p>
                <p className="entrance-details-report-meta">
                  Updated: {formatReportTime(report.updatedAt)}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <Link className="entrance-details-report-button" to={reportBarrierHref}>
        Report a barrier at this entrance
      </Link>
      <p className="entrance-details-note">
        No active reports does not confirm that this entrance is clear.
      </p>
    </main>
  )
}

export default EntranceDetails
