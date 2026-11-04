import { useNavigate } from 'react-router-dom'
import SupportedBuildings from '../buildings/SupportedBuildings'

// Shows Hoang's Supported buildings screen at /buildings
function SupportedBuildingsPage() {
  const navigate = useNavigate()

  // The link to one building's page
  function getBuildingLink(buildingId) {
    return '/buildings/' + buildingId
  }

  // Go back to the page before
  function goBack() {
    navigate(-1)
  }

  return (
    <SupportedBuildings getBuildingHref={getBuildingLink} onBack={goBack} />
  )
}

export default SupportedBuildingsPage
