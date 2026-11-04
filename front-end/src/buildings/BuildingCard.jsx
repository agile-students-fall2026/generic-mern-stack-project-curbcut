import { Link } from 'react-router-dom'
import './BuildingCard.css'

function BuildingCard({ building, locations, locationStatus, href }) {
  const buildingLocations = locations.filter(
    (location) => location.buildingId === building.id,
  )
  const floors = buildingLocations.filter(
    (location) => location.locationType === 'floor',
  )
  const entrances = buildingLocations.filter(
    (location) => location.locationType === 'entrance',
  )

  let floorCoverage = 'Floor coverage not documented'
  if (floors.length > 0) {
    const floorNames = floors.map((floor) => floor.locationName)
    floorCoverage = floorNames.join(', ')
  }

  let entranceCoverage = 'Entrances not documented'
  if (entrances.length === 1) {
    entranceCoverage = '1 documented entrance'
  } else if (entrances.length > 1) {
    entranceCoverage = `${entrances.length} documented entrances`
  }

  return (
    <Link className="building-card" to={href}>
      <div className="building-card-heading">
        <h3 className="building-card-name">{building.name}</h3>
        <span className="building-card-badge">Available</span>
      </div>
      <p className="building-card-address">
        {building.address || 'Address not documented'}
      </p>
      {locationStatus === 'ready' && (
        <div className="building-card-coverage">
          <p className="building-card-detail">{floorCoverage}</p>
          <p className="building-card-detail">{entranceCoverage}</p>
        </div>
      )}
      {locationStatus === 'loading' && (
        <p className="building-card-coverage">
          Loading floor and entrance coverage…
        </p>
      )}
      {locationStatus === 'error' && (
        <p className="building-card-coverage">
          Floor and entrance coverage unavailable
        </p>
      )}
      <span className="building-card-open">
        View building details <span aria-hidden="true">→</span>
      </span>
    </Link>
  )
}

export default BuildingCard
