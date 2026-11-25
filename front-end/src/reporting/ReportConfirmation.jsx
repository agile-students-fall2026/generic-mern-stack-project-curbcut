import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './ReportConfirmation.css'

function ReportConfirmation({ report, location, onNewReport }) {
  const headingRef = useRef(null)
  const buildingName = location.buildingName
  const locationName = location.locationName

  useEffect(() => {
    headingRef.current.focus()
  }, [])

  return (
    <main className="reporting report-confirmation">
      <div className="report-confirmation__icon" aria-hidden="true">
        ✓
      </div>

      <h1
        ref={headingRef}
        tabIndex={-1}
        className="reporting__title report-confirmation__title"
      >
        Report submitted
      </h1>

      <p className="report-confirmation__message">
        Thanks! Your report for {buildingName} has been submitted.
      </p>

      <dl className="report-confirmation__summary">
        <div>
          <dt>Category</dt>
          <dd>{report.category}</dd>
        </div>

        <div>
          <dt>Location</dt>
          <dd>
            {buildingName} · {locationName}
          </dd>
        </div>

        <div>
          <dt>Observed</dt>
          <dd>
            <time dateTime={report.observedAt}>
              {new Date(report.observedAt).toLocaleString([], {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </time>
          </dd>
        </div>

        <div>
          <dt>Status</dt>
          <dd>{report.status}</dd>
        </div>
      </dl>

      <div className="report-confirmation__actions">
        <Link
          to={`/buildings/${encodeURIComponent(report.buildingId)}`}
          className="reporting__button reporting__button--primary report-confirmation__link"
        >
          Go to {buildingName}
        </Link>

        <Link to="/" className="reporting__button report-confirmation__link">
          Back to Home
        </Link>

        <button
          type="button"
          className="reporting__text-button"
          onClick={onNewReport}
        >
          Start another report
        </button>
      </div>
    </main>
  )
}

export default ReportConfirmation
