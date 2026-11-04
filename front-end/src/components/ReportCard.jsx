import { Link } from 'react-router-dom'
import './ReportCard.css'

// One barrier report shown as a small card
function ReportCard({ report, locations }) {
  // Find the name of the entrance or floor this report is about
  let locationName = 'Unknown location'

  for (const item of locations) {
    if (
      item.locationId === report.entranceId ||
      item.locationId === report.floorId
    ) {
      locationName = item.buildingName + ' — ' + item.locationName
    }
  }

  // Resolved reports get the green label, Active ones keep the red label
  let statusClass = 'report-card__status'

  if (report.status === 'Resolved') {
    statusClass = 'report-card__status report-card__status--resolved'
  }

  // Turn the saved times into readable text like "11/2/2026, 3:15:00 PM"
  const observedTime = new Date(report.observedAt).toLocaleString()
  const updatedTime = new Date(report.updatedAt).toLocaleString()

  return (
    <Link to={`/reports/${report.id}`} className="report-card">
      <div className="report-card__tags">
        <span className="report-card__category">{report.category}</span>
        <span className={statusClass}>{report.status}</span>
      </div>

      <p className="report-card__location">{locationName}</p>

      <p className="report-card__description">{report.description}</p>

      <p className="report-card__times">Observed {observedTime}</p>
      <p className="report-card__times">Updated {updatedTime}</p>
    </Link>
  )
}

export default ReportCard
