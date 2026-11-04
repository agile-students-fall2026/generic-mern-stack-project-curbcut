import { useParams } from 'react-router-dom'
import EntranceDetails from '../buildings/EntranceDetails'
import useReports from '../reports/useReports'

// Shows Hoang's Entrance details screen at
// /buildings/<building id>/entrances/<entrance id>
function EntranceDetailsPage() {
  // Read both ids from the page address
  const { buildingId, entranceId } = useParams()

  // Abdullah's shared list of reports (#65)
  const { reports } = useReports()

  // The link to one report
  function getReportLink(reportId) {
    return '/reports/' + reportId
  }

  return (
    <EntranceDetails
      buildingId={buildingId}
      entranceId={entranceId}
      reports={reports}
      buildingHref={'/buildings/' + buildingId}
      getReportHref={getReportLink}
      reportBarrierHref="/report"
    />
  )
}

export default EntranceDetailsPage
