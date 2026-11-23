import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AddUpdateForm from '../reports/AddUpdateForm'
import './ReportDetailsPage.css'

function ReportDetails({ report, locationName, locationHref, onUpdate }) {
  const [updateChoice, setUpdateChoice] = useState(null)
  const triggerRef = useRef(null)
  const [updatePosted, setUpdatePosted] = useState(false)
  const confirmationRef = useRef(null)

  useEffect(() => {
    if (updatePosted) {
      confirmationRef.current.focus()
      confirmationRef.current.scrollIntoView({ block: 'start' })
    } else if (updateChoice === null && triggerRef.current) {
      triggerRef.current.focus()
    }
  }, [updateChoice, updatePosted])

  const updates = [...(report.updates || [])].sort(
    (first, second) => new Date(second.createdAt) - new Date(first.createdAt),
  )
  const description = report.description?.trim() || 'No description provided.'

  function openUpdate(event, choice) {
    setUpdatePosted(false)
    triggerRef.current = event.currentTarget
    setUpdateChoice(choice)
  }

  function cancelUpdate() {
    setUpdateChoice(null)
  }

  function finishUpdate(updatedReport) {
    onUpdate(updatedReport)
    setUpdateChoice(null)
    setUpdatePosted(true)
  }

  function dismissConfirmation() {
    setUpdatePosted(false)
  }

  return (
    <>
      {updatePosted && (
        <div
          className="report-details__confirmation"
          role="status"
          ref={confirmationRef}
          tabIndex={-1}
        >
          <strong>Update posted.</strong>
          <button type="button" onClick={dismissConfirmation}>
            Dismiss
          </button>
        </div>
      )}
      <p>Community report</p>
      <h1>{report.title || `${report.category} — ${locationName}`}</h1>
      <Link className="report-details__location" to={locationHref}>
        {locationName}
      </Link>
      <div className="report-details__tags">
        <span>{report.category}</span>
        <span
          className={`report-details__status report-details__status--${report.status.toLowerCase()}`}
        >
          {report.status}
        </span>
      </div>
      <p className="report-details__description">{description}</p>
      <dl className="report-details__times">
        <div>
          <dt>First observed</dt>
          <dd>{new Date(report.observedAt).toLocaleString()}</dd>
        </div>
        <div>
          <dt>Last updated</dt>
          <dd>{new Date(report.updatedAt).toLocaleString()}</dd>
        </div>
        <div>
          <dt>Follow-up updates</dt>
          <dd>{updates.length}</dd>
        </div>
      </dl>
      <div className="report-details__actions">
        <button
          type="button"
          disabled={updateChoice !== null}
          onClick={(event) => openUpdate(event, '')}
        >
          Add an update
        </button>
        <button
          type="button"
          disabled={updateChoice !== null}
          onClick={(event) => openUpdate(event, 'Still there')}
        >
          Still there
        </button>
        <button
          type="button"
          disabled={updateChoice !== null}
          onClick={(event) => openUpdate(event, "It's cleared")}
        >
          It's cleared
        </button>
      </div>
      {updateChoice !== null && (
        <AddUpdateForm
          key={updateChoice}
          report={report}
          locationName={locationName}
          initialChoice={updateChoice}
          onCancel={cancelUpdate}
          onSuccess={finishUpdate}
        />
      )}
      <h2>Report history</h2>
      {updates.length === 0 && <p>No follow-up updates yet.</p>}
      <ol className="report-details__history">
        {updates.map((update) => (
          <li key={update.id}>
            <h3>{update.choice}</h3>
            <time dateTime={update.createdAt}>
              {new Date(update.createdAt).toLocaleString()}
            </time>
            {update.note && <p>{update.note}</p>}
            {update.photo?.url && (
              <img
                className="report-details__photo"
                src={update.photo.url}
                alt={update.photo.alt || 'Photo attached to this update'}
              />
            )}
          </li>
        ))}
        <li>
          <h3>Original report</h3>
          <time dateTime={report.createdAt}>
            {new Date(report.createdAt).toLocaleString()}
          </time>
          <p>{description}</p>
          {report.photo?.url && (
            <img
              className="report-details__photo"
              src={report.photo.url}
              alt={report.photo.alt || 'Photo attached to the original report'}
            />
          )}
        </li>
      </ol>
    </>
  )
}

function ReportDetailsLoader({ reportId }) {
  const [report, setReport] = useState(null)
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadReport() {
      try {
        const response = await fetch(
          `/api/reports/${encodeURIComponent(reportId)}`,
          { signal: controller.signal },
        )

        if (response.status === 404) {
          if (!controller.signal.aborted) {
            setReport(null)
            setLoading(false)
          }
          return
        }

        if (!response.ok) {
          throw new Error('Could not load this report.')
        }
        const reportData = await response.json()
        if (!reportData || reportData.id !== reportId) {
          throw new Error('The report data is invalid.')
        }

        const locationResponse = await fetch('/api/locations', {
          signal: controller.signal,
        })
        if (!locationResponse.ok) {
          throw new Error('Could not load location details.')
        }
        const locationData = await locationResponse.json()
        if (!Array.isArray(locationData)) {
          throw new Error('The location data is invalid.')
        }

        if (!controller.signal.aborted) {
          setReport(reportData)
          setLocations(locationData)
          setLoading(false)
        }
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError.message)
          setLoading(false)
        }
      }
    }

    loadReport()
    return () => controller.abort()
  }, [reportId, loadAttempt])

  function retryLoad() {
    setLoading(true)
    setError('')
    setLoadAttempt((previous) => previous + 1)
  }

  if (loading) {
    return (
      <main className="report-details">
        <p role="status">Loading report...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="report-details">
        <p role="alert">{error}</p>
        <button type="button" onClick={retryLoad}>
          Retry loading report
        </button>
      </main>
    )
  }

  if (!report) {
    return (
      <main className="report-details">
        <h1>Report not found</h1>
        <p>This report may have been removed or is unavailable.</p>
        <Link to="/browse">Browse reports</Link>
      </main>
    )
  }

  const location = locations.find(
    (item) =>
      item.buildingId === report.buildingId &&
      (item.locationId === report.entranceId ||
        item.locationId === report.floorId),
  )

  let locationName = 'Location details unavailable'

  if (location) {
    locationName = `${location.buildingName} - ${location.locationName}`
  }

  let locationHref = `/buildings/${encodeURIComponent(report.buildingId)}`

  if (report.entranceId) {
    locationHref += `/entrances/${encodeURIComponent(report.entranceId)}`
  }

  return (
    <main className="report-details">
      <Link className="report-details__back" to="/browse">
        Back to reports
      </Link>
      <ReportDetails
        key={report.id}
        report={report}
        locationName={locationName}
        locationHref={locationHref}
        onUpdate={setReport}
      />
    </main>
  )
}

function ReportDetailsPage() {
  const { reportId } = useParams()
  return <ReportDetailsLoader key={reportId} reportId={reportId} />
}

export default ReportDetailsPage
