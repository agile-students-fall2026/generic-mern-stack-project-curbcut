import { useNavigate, useParams } from 'react-router-dom'
import BuildingDetails from '../buildings/BuildingDetails'
import useReports from '../reports/useReports'

// Shows Hoang's Building details screen at /buildings/<building id>
function BuildingDetailsPage() {
  const navigate = useNavigate()

  // Read the building id from the page address,
  // for example "kimmel-center" from /buildings/kimmel-center
  const { buildingId } = useParams()

  // Abdullah's shared list of reports (#65)
  const { reports } = useReports()

  // The link to one entrance of this building
  function getEntranceLink(entranceBuildingId, entranceId) {
    return '/buildings/' + entranceBuildingId + '/entrances/' + entranceId
  }

  // The link to one report
  function getReportLink(reportId) {
    return '/reports/' + reportId
  }

  // Go back to the page before
  function goBack() {
    navigate(-1)
  }

  return (
    <BuildingDetails
      buildingId={buildingId}
      reports={reports}
      getEntranceHref={getEntranceLink}
      getReportHref={getReportLink}
      browseReportsHref="/browse"
      reportBarrierHref="/report"
      onBack={goBack}
    />
  )
}

export default BuildingDetailsPage
