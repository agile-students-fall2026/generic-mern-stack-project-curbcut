import { useEffect, useState } from 'react'
import BuildingCard from './BuildingCard'
import './SupportedBuildings.css'

function SupportedBuildings({ getBuildingHref, onBack }) {
  const [buildings, setBuildings] = useState([])
  const [locations, setLocations] = useState([])
  const [buildingStatus, setBuildingStatus] = useState('loading')
  const [locationStatus, setLocationStatus] = useState('loading')
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function loadBuildings() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/buildings.json`,
        )
        if (!response.ok) {
          throw new Error('Could not load buildings')
        }
        const data = await response.json()
        if (!Array.isArray(data.buildings)) {
          throw new Error('Invalid building data')
        }
        if (!cancelled) {
          setBuildings(data.buildings)
          setBuildingStatus('ready')
        }
      } catch {
        if (!cancelled) {
          setBuildingStatus('error')
        }
      }
    }

    async function loadLocations() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/locations.json`,
        )
        if (!response.ok) {
          throw new Error('Could not load locations')
        }
        const data = await response.json()
        if (!Array.isArray(data)) {
          throw new Error('Invalid location data')
        }
        if (!cancelled) {
          setLocations(data)
          setLocationStatus('ready')
        }
      } catch {
        if (!cancelled) {
          setLocationStatus('error')
        }
      }
    }

    loadBuildings()
    loadLocations()

    return () => {
      cancelled = true
    }
  }, [reloadCount])

  function retryLoading() {
    setBuildingStatus('loading')
    setLocationStatus('loading')
    setReloadCount(reloadCount + 1)
  }

  const availableBuildings = buildings.filter(
    (building) => building.availability === 'available',
  )
  const comingSoonBuildings = buildings.filter(
    (building) => building.availability === 'coming-soon',
  )

  return (
    <main className="supported-buildings">
      <button
        className="supported-buildings-back"
        type="button"
        onClick={onBack}
      >
        <span aria-hidden="true">←</span> Back
      </button>
      <h1 className="supported-buildings-title">Supported buildings</h1>
      <p className="supported-buildings-intro">
        Explore the buildings currently covered by CurbCut.
      </p>

      {buildingStatus === 'loading' && <p role="status">Loading buildings…</p>}
      {buildingStatus === 'error' && (
        <div className="supported-buildings-error" role="alert">
          <p>We couldn’t load the buildings. Please try again.</p>
          <button
            className="supported-buildings-retry"
            type="button"
            onClick={retryLoading}
          >
            Try again
          </button>
        </div>
      )}

      {buildingStatus === 'ready' && (
        <>
          <section aria-labelledby="available-buildings-heading">
            <h2
              className="supported-buildings-heading"
              id="available-buildings-heading"
            >
              Available now
            </h2>
            {availableBuildings.length === 0 && (
              <p>No buildings are available yet. Please check back soon.</p>
            )}
            <ul className="supported-buildings-list">
              {availableBuildings.map((building) => (
                <li key={building.id}>
                  <BuildingCard
                    building={building}
                    locations={locations}
                    locationStatus={locationStatus}
                    href={getBuildingHref(building.id)}
                  />
                </li>
              ))}
            </ul>
            {availableBuildings.length > 0 && locationStatus === 'error' && (
              <div className="supported-buildings-error" role="alert">
                <p>We couldn’t load floor and entrance coverage.</p>
                <button
                  className="supported-buildings-retry"
                  type="button"
                  onClick={retryLoading}
                >
                  Try again
                </button>
              </div>
            )}
          </section>

          {comingSoonBuildings.length > 0 && (
            <section
              className="supported-buildings-planned"
              aria-labelledby="coming-soon-heading"
            >
              <h2
                className="supported-buildings-heading"
                id="coming-soon-heading"
              >
                Coming soon
              </h2>
              <p className="supported-buildings-intro">
                These buildings aren’t available to explore yet.
              </p>
              <ul className="supported-buildings-list">
                {comingSoonBuildings.map((building) => (
                  <li
                    className="supported-buildings-planned-row"
                    key={building.id}
                  >
                    <div>
                      <h3 className="supported-buildings-name">
                        {building.name}
                      </h3>
                      <p className="supported-buildings-address">
                        {building.address || 'Address not documented'}
                      </p>
                    </div>
                    <span className="supported-buildings-badge">
                      Coming soon
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <p className="supported-buildings-disclaimer">
        Sample data, not verified. Coverage doesn't ensure accessibility. Check
        building details and recent reports before your visit.
      </p>
    </main>
  )
}

export default SupportedBuildings
