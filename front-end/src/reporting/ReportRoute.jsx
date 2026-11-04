import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ReportForm from './ReportForm'

function ReportLocationLoader({ buildingId, entranceId }) {
  const hasRequestedLocation = Boolean(buildingId || entranceId)

  const [loading, setLoading] = useState(hasRequestedLocation)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [initialLocation, setInitialLocation] = useState(null)
  const [loadAttempt, setLoadAttempt] = useState(0)

  useEffect(() => {
    if (!hasRequestedLocation) {
      return
    }

    const controller = new AbortController()

    async function loadRequestedLocation() {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/locations.json`,
          { signal: controller.signal },
        )

        if (!response.ok) {
          throw new Error('Could not load the requested location.')
        }

        const locations = await response.json()

        if (!Array.isArray(locations)) {
          throw new Error('The location data is invalid.')
        }

        let selectedLocation = null
        let message = ''

        const buildingLocations = locations.filter(
          (item) => item.buildingId === buildingId,
        )

        if (!buildingId || buildingLocations.length === 0) {
          message =
            'The requested building is unavailable. Choose a location manually.'
        } else if (entranceId) {
          selectedLocation = buildingLocations.find(
            (item) =>
              item.locationId === entranceId &&
              item.locationType === 'entrance',
          )

          if (!selectedLocation) {
            selectedLocation = {
              buildingId,
              buildingName: buildingLocations[0].buildingName,
              locationId: null,
              locationName: null,
              locationType: null,
            }

            message =
              'The requested entrance is unavailable. Choose an entrance or floor.'
          }
        } else {
          selectedLocation = {
            buildingId,
            buildingName: buildingLocations[0].buildingName,
            locationId: null,
            locationName: null,
            locationType: null,
          }
        }

        if (!controller.signal.aborted) {
          setInitialLocation(selectedLocation)
          setNotice(message)
          setError('')
          setLoading(false)
        }
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError.message)
          setLoading(false)
        }
      }
    }

    loadRequestedLocation()

    return () => controller.abort()
  }, [buildingId, entranceId, hasRequestedLocation, loadAttempt])

  function retryLoading() {
    setLoading(true)
    setError('')
    setLoadAttempt((previous) => previous + 1)
  }

  if (loading) {
    return (
      <main className="reporting">
        <p role="status">Loading selected location…</p>
      </main>
    )
  }

  if (error) {
    return (
      <main className="reporting">
        <p role="alert">{error}</p>

        <button
          type="button"
          className="reporting__button"
          onClick={retryLoading}
        >
          Retry loading location
        </button>
      </main>
    )
  }

  return (
    <>
      {notice && (
        <p className="reporting reporting__hint" role="status">
          {notice}
        </p>
      )}

      <ReportForm initialLocation={initialLocation} />
    </>
  )
}

function ReportRoute() {
  const [searchParams] = useSearchParams()
  const buildingId = searchParams.get('buildingId') || ''
  const entranceId = searchParams.get('entranceId') || ''

  return (
    <ReportLocationLoader
      key={JSON.stringify([buildingId, entranceId])}
      buildingId={buildingId}
      entranceId={entranceId}
    />
  )
}

export default ReportRoute
