import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import packageInfo from '../../package.json'
import './About.css'

function About() {
  const [coverage, setCoverage] = useState(null)
  const [coverageError, setCoverageError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    async function loadCoverage() {
      try {
        const [buildingsResponse, locationsResponse] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}data/buildings.json`, {
            signal: controller.signal,
          }),
          fetch(`${import.meta.env.BASE_URL}data/locations.json`, {
            signal: controller.signal,
          }),
        ])

        if (!buildingsResponse.ok || !locationsResponse.ok) {
          throw new Error('Coverage information could not be loaded.')
        }

        const [buildingData, locations] = await Promise.all([
          buildingsResponse.json(),
          locationsResponse.json(),
        ])

        if (
          !Array.isArray(buildingData.buildings) ||
          !Array.isArray(locations)
        ) {
          throw new Error('Coverage information is invalid.')
        }

        const availableBuildings = buildingData.buildings.filter(
          (building) => building.availability === 'available',
        )
        const availableBuildingIds = new Set(
          availableBuildings.map((building) => building.id),
        )
        const floorCount = locations.filter(
          (location) =>
            location.locationType === 'floor' &&
            availableBuildingIds.has(location.buildingId),
        ).length

        if (!controller.signal.aborted) {
          setCoverage({ buildings: availableBuildings, floorCount })
          setCoverageError('')
        }
      } catch {
        if (!controller.signal.aborted) {
          setCoverageError('Coverage information could not be loaded.')
        }
      }
    }

    loadCoverage()
    return () => controller.abort()
  }, [loadAttempt])

  return (
    <main className="about">
      <h1 className="about__title">About CurbCut</h1>

      <section className="about__section" aria-labelledby="about-purpose">
        <h2 id="about-purpose">Check access before you go</h2>
        <p>
          CurbCut helps NYU students and community members, especially people
          with mobility-related access needs, check building entrance and floor
          information and recent barrier observations before traveling.
        </p>
      </section>

      <section className="about__section" aria-labelledby="about-coverage">
        <h2 id="about-coverage">Current coverage</h2>
        {coverage === null && coverageError === '' && (
          <p role="status">Loading coverage...</p>
        )}
        {coverageError !== '' && (
          <div className="about__error" role="alert">
            <p>{coverageError}</p>
            <button
              type="button"
              onClick={() => setLoadAttempt((attempt) => attempt + 1)}
            >
              Try again
            </button>
          </div>
        )}
        {coverage && (
          <>
            <p>
              CurbCut currently covers {coverage.buildings.length}{' '}
              {coverage.buildings.length === 1 ? 'building' : 'buildings'} and{' '}
              {coverage.floorCount} documented{' '}
              {coverage.floorCount === 1 ? 'floor' : 'floors'}.
            </p>
            {coverage.buildings.length > 0 && (
              <ul className="about__building-list">
                {coverage.buildings.map((building) => (
                  <li key={building.id}>{building.name}</li>
                ))}
              </ul>
            )}
          </>
        )}
        <Link className="about__link" to="/buildings">
          View supported buildings
        </Link>
      </section>

      <section className="about__section" aria-labelledby="about-information">
        <h2 id="about-information">Two kinds of information</h2>
        <h3>Documented building information</h3>
        <p>
          Entrance and floor details are maintained separately from community
          reports. The team checks and updates documented information; a
          verification date is shown when one is available. Current sample
          records may not yet have been verified.
        </p>
        <h3>Community reports</h3>
        <p>
          People contribute reports through the report form by selecting a
          location and barrier category, recording when they observed it, and
          adding a description. Reports reflect conditions at the time they were
          observed and may become outdated.
        </p>
        <p className="about__notice">
          A missing report does not confirm that a building or route is
          accessible. CurbCut does not currently provide automatic route
          planning.
        </p>
        <Link className="about__link" to="/report">
          Report a barrier
        </Link>
      </section>

      <section className="about__section" aria-labelledby="about-help">
        <h2 id="about-help">Need help?</h2>
        <p>
          The team coordinates help in the CurbCut Discord channel. For project
          questions or to report an issue, visit the team repository.
        </p>
        <a
          className="about__link"
          href="https://github.com/agile-students-fall2026/generic-mern-stack-project-curbcut"
          target="_blank"
          rel="noreferrer"
        >
          CurbCut team repository
        </a>
      </section>

      <footer className="about__footer">
        <p>Application version {packageInfo.version}</p>
      </footer>
    </main>
  )
}

export default About
