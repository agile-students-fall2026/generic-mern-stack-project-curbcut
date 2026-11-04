import { useNavigate, useParams } from 'react-router-dom'
import SupportedBuildings from './SupportedBuildings'
import BuildingDetails from './BuildingDetails'
import EntranceDetails from './EntranceDetails'
import useReports from '../reports/useReports'

function getBuildingHref(buildingId) {
  return `/buildings/${encodeURIComponent(buildingId)}`
}

function getEntranceHref(buildingId, entranceId) {
  return `${getBuildingHref(buildingId)}/entrances/${encodeURIComponent(entranceId)}`
}

function getReportHref(reportId) {
  return `/reports/${encodeURIComponent(reportId)}`
}

function ReportLoadingState({ loading, error, retryLoad }) {
  if (loading) {
    return (
      <main className="reporting">
        <p role="status">Loading community reports…</p>
      </main>
    )
  }

  return (
    <main className="reporting">
      <p role="alert">{error}</p>
      <button type="button" className="reporting__button" onClick={retryLoad}>
        Retry loading reports
      </button>
    </main>
  )
}

export function SupportedBuildingsRoute() {
  const navigate = useNavigate()

  return (
    <SupportedBuildings
      getBuildingHref={getBuildingHref}
      onBack={() => navigate('/')}
    />
  )
}

export function BuildingDetailsRoute() {
  const { buildingId } = useParams()
  const navigate = useNavigate()
  const { reports, loading, error, retryLoad } = useReports()

  if (loading || error) {
    return (
      <ReportLoadingState
        loading={loading}
        error={error}
        retryLoad={retryLoad}
      />
    )
  }

  return (
    <BuildingDetails
      key={buildingId}
      buildingId={buildingId}
      reports={reports}
      getEntranceHref={getEntranceHref}
      getReportHref={getReportHref}
      browseReportsHref={`/browse?buildingId=${encodeURIComponent(buildingId)}`}
      reportBarrierHref={`/report?buildingId=${encodeURIComponent(buildingId)}`}
      onBack={() => navigate('/buildings')}
    />
  )
}

export function EntranceDetailsRoute() {
  const { buildingId, entranceId } = useParams()
  const { reports, loading, error, retryLoad } = useReports()

  if (loading || error) {
    return (
      <ReportLoadingState
        loading={loading}
        error={error}
        retryLoad={retryLoad}
      />
    )
  }

  return (
    <EntranceDetails
      key={`${buildingId}/${entranceId}`}
      buildingId={buildingId}
      entranceId={entranceId}
      reports={reports}
      buildingHref={getBuildingHref(buildingId)}
      getReportHref={getReportHref}
      reportBarrierHref={`/report?buildingId=${encodeURIComponent(buildingId)}&entranceId=${encodeURIComponent(entranceId)}`}
    />
  )
}
