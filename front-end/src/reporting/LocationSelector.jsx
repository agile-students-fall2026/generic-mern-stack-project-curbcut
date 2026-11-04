import { useEffect, useRef, useState } from 'react'
import './LocationSelector.css'

function LocationSelector({ location, onSelect }) {
  const dialogRef = useRef(null)
  const [locations, setLocations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [buildingId, setBuildingId] = useState('')

  useEffect(() => {
    let active = true

    fetch(`${import.meta.env.BASE_URL}data/locations.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Could not load locations.')
        }

        return response.json()
      })
      .then((data) => {
        if (active) {
          setLocations(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (active) {
          setError('Locations could not be loaded. Close and refresh to retry.')
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  const buildings = []

  for (const item of locations) {
    if (!buildings.some((building) => building.id === item.buildingId)) {
      buildings.push({
        id: item.buildingId,
        name: item.buildingName,
      })
    }
  }

  const matchingBuildings = buildings.filter((building) =>
    building.name.toLowerCase().includes(search.trim().toLowerCase()),
  )

  const selectedBuilding = buildings.find(
    (building) => building.id === buildingId,
  )

  const entrances = locations.filter(
    (item) =>
      item.buildingId === buildingId && item.locationType === 'entrance',
  )

  const floors = locations.filter(
    (item) => item.buildingId === buildingId && item.locationType === 'floor',
  )

  function openSelector() {
    setSearch('')
    setBuildingId(location ? location.buildingId : '')
    dialogRef.current.showModal()
  }

  function closeSelector() {
    dialogRef.current.close()
  }

  function chooseLocation(item) {
    onSelect(item)
    closeSelector()
  }

  return (
    <>
      <button
        type="button"
        className="reporting__input reporting__row location-selector__trigger"
        aria-labelledby="location-label location-value"
        aria-haspopup="dialog"
        onClick={openSelector}
      >
        <span id="location-value" className="reporting__row-value">
          {location
            ? location.locationId
              ? `${location.buildingName} — ${location.locationName}`
              : `${location.buildingName} — Choose entrance or floor`
            : 'Choose building and entrance or floor'}
        </span>
        <span aria-hidden="true">›</span>
      </button>

      <dialog
        ref={dialogRef}
        className="location-selector"
        aria-labelledby="location-selector-title"
      >
        <div className="location-selector__header">
          <h2 id="location-selector-title">Choose location</h2>

          <button
            type="button"
            className="reporting__text-button"
            onClick={closeSelector}
          >
            Cancel
          </button>
        </div>

        <p className="reporting__hint">
          Sample locations for the Sprint 1 prototype.
        </p>

        {loading && <p role="status">Loading locations…</p>}

        {error && (
          <p className="reporting__error" role="alert">
            {error}
          </p>
        )}

        {!loading && !error && (
          <>
            <label
              className="reporting__label location-selector__search-label"
              htmlFor="building-search"
            >
              Search buildings
            </label>

            <input
              id="building-search"
              type="search"
              className="reporting__input"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value)
                setBuildingId('')
              }}
              placeholder="Search by building name"
            />

            <div className="location-selector__list">
              {matchingBuildings.length === 0 ? (
                <p role="status">No matching buildings found.</p>
              ) : (
                matchingBuildings.map((building) => (
                  <button
                    key={building.id}
                    type="button"
                    className="reporting__button location-selector__option"
                    aria-pressed={buildingId === building.id}
                    onClick={() => setBuildingId(building.id)}
                  >
                    {building.name}
                  </button>
                ))
              )}
            </div>

            {selectedBuilding && (
              <section aria-labelledby="selected-building-title">
                <h3 id="selected-building-title">{selectedBuilding.name}</h3>

                <h4>Entrances</h4>
                <div className="location-selector__list">
                  {entrances.length === 0 ? (
                    <p>No entrances available.</p>
                  ) : (
                    entrances.map((item) => (
                      <button
                        key={item.locationId}
                        type="button"
                        className="reporting__button location-selector__option"
                        aria-pressed={
                          location?.buildingId === item.buildingId &&
                          location?.locationId === item.locationId
                        }
                        onClick={() => chooseLocation(item)}
                      >
                        {item.locationName}
                      </button>
                    ))
                  )}
                </div>

                <h4>Floors</h4>
                <div className="location-selector__list">
                  {floors.length === 0 ? (
                    <p>No floors available.</p>
                  ) : (
                    floors.map((item) => (
                      <button
                        key={item.locationId}
                        type="button"
                        className="reporting__button location-selector__option"
                        aria-pressed={
                          location?.buildingId === item.buildingId &&
                          location?.locationId === item.locationId
                        }
                        onClick={() => chooseLocation(item)}
                      >
                        {item.locationName}
                      </button>
                    ))
                  )}
                </div>
              </section>
            )}
          </>
        )}
      </dialog>
    </>
  )
}

export default LocationSelector
