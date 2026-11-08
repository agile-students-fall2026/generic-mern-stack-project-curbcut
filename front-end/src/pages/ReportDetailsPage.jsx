import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useReports from '../reports/useReports'
import './ReportDetailsPage.css'

function ReportDetailsPage() {
  const { reportId } = useParams()
  const { reports, loading, error, retryLoad } = useReports()
  const [locations, setLocations] = useState([])
  const [locationsFailed, setLocationsFailed] = useState(false)

  useEffect(() => {
    const controller = new AbortController()

    fetch(`${import.meta.env.BASE_URL}data/locations.json`, {
      signal: controller.signal,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Location details could not be loaded.')
        }
        return response.json()
      })
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error('Location details are invalid.')
        }
        setLocations(data)
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setLocationsFailed(true)
        }
      })

    return () => controller.abort()
  }, [])

  if (loading) {
    return <main className="report-details"><p role="status">Loading report...</p></main>
  }

  if (error) {
    return (
      <main className="report-details">
        <p role="alert">{error}</p>
        <button type="button" onClick={retryLoad}>Retry loading reports</button>
      </main>
    )
  }

  const report = reports.find((item) => item.id === reportId)
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
    (item) => item.locationId === report.entranceId || item.locationId === report.floorId,
  )
  const locationName = location
    ? `${location.buildingName} - ${location.locationName}`
    : locationsFailed
      ? 'Location details unavailable'
      : 'Loading location details...'

  return (
    <main className="report-details">
      <Link className="report-details__back" to="/browse">Back to reports</Link>
      <p className="report-details__location">{locationName}</p>
      <h1>{report.title || report.description}</h1>
      <div className="report-details__tags">
        <span>{report.category}</span>
        <span className={`report-details__status report-details__status--${report.status.toLowerCase()}`}>
          {report.status}
        </span>
      </div>
      {report.photo?.url ? (
        <img className="report-details__photo" src={report.photo.url} alt={report.photo.alt || ''} />
      ) : (
        <div className="report-details__photo-placeholder" role="img" aria-label="No photo attached">
          No photo attached
        </div>
      )}
      <p className="report-details__description">{report.description}</p>
      <dl className="report-details__times">
        <div><dt>First observed</dt><dd>{new Date(report.observedAt).toLocaleString()}</dd></div>
        <div><dt>Last updated</dt><dd>{new Date(report.updatedAt).toLocaleString()}</dd></div>
      </dl>
    </main>
  )
}

export default ReportDetailsPage
