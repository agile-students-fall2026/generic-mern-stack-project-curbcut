import { useEffect, useState } from 'react'
import ReportCard from '../components/ReportCard'
import useReports from '../reports/useReports'
import sortNewestFirst from '../reports/sortNewestFirst'
import './BrowseReports.css'

function BrowseReports() {
    // Use the same report list as Home and Search.
    const { reports, loading, error, retryLoad } = useReports()
    const [locations, setLocations] = useState([])
    const [locationsError, setLocationsError] = useState('')
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('All')

    useEffect(() => {
        // ReportCard uses this list to turn entrance and floor IDs into names.
        const controller = new AbortController()

        async function loadLocations() {
            try {
                const response = await fetch(
                    `${import.meta.env.BASE_URL}data/locations.json`,
                    { signal: controller.signal },
                )

                if (!response.ok) {
                    throw new Error('Location details could not be loaded.')
                }

                const data = await response.json()

                if (!Array.isArray(data)) {
                    throw new Error('Location details are invalid.')
                }

                if (!controller.signal.aborted) {
                    setLocations(data)
                    setLocationsError('')
                }
            } catch (loadError) {
                if (!controller.signal.aborted) {
                    setLocationsError(loadError.message)
                }
            }
        }

        loadLocations()

        return () => controller.abort()
    }, [])

    // Search readable location names as well as report details; keep results newest first.
    const searchTerm = search.trim().toLowerCase()
    const filteredReports = sortNewestFirst(reports).filter((report) => {
        const location = locations.find(
            (item) =>
                item.locationId === report.entranceId ||
                item.locationId === report.floorId,
        )
        const searchableText = [
            report.category,
            report.description,
            report.buildingId,
            location?.buildingName,
            location?.locationName,
        ]
            .join(' ')
            .toLowerCase()

        return (
            (searchTerm === '' || searchableText.includes(searchTerm)) &&
            (status === 'All' || report.status === status)
        )
    })

    return (
        <main className="browse-reports">
            <h1 className="browse-reports__title">Browse reports</h1>

            <div className="browse-reports__controls">
                <div>
                    <label className="browse-reports__label" htmlFor="reports-search">
                        Search reports
                    </label>
                    <input
                        id="reports-search"
                        className="browse-reports__input"
                        type="search"
                        placeholder="Category, location, or details"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>

                <div>
                    <label className="browse-reports__label" htmlFor="reports-status">
                        Status
                    </label>
                    <select
                        id="reports-status"
                        className="browse-reports__select"
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                    >
                        <option value="All">All statuses</option>
                        <option value="Active">Active</option>
                        <option value="Resolved">Resolved</option>
                    </select>
                </div>
            </div>

            {error !== '' && (
                <div className="browse-reports__error" role="alert">
                    <p>{error}</p>
                    <button type="button" onClick={retryLoad}>
                        Retry loading reports
                    </button>
                </div>
            )}

            {/* Reports and location details load independently. */}
            {locationsError !== '' && (
                <p className="browse-reports__notice" role="status">
                    {locationsError} Report cards may show an unknown location.
                </p>
            )}

            {loading ? (
                <p className="browse-reports__notice" role="status">
                    Loading reports...
                </p>
            ) : error === '' ? (
                <>
                    <p className="browse-reports__count" aria-live="polite">
                        {filteredReports.length}{' '}
                        {filteredReports.length === 1 ? 'report' : 'reports'}
                    </p>

                    {filteredReports.length === 0 ? (
                        <p className="browse-reports__empty">
                            {reports.length === 0
                                ? 'No reports have been posted yet.'
                                : 'No reports match your search and status filters.'}
                        </p>
                    ) : (
                        <section className="browse-reports__list" aria-label="Reports">
                            {/* The shared card also links each result to its detail page. */}
                            {filteredReports.map((report) => (
                                <ReportCard
                                    key={report.id}
                                    report={report}
                                    locations={locations}
                                />
                            ))}
                        </section>
                    )}
                </>
            ) : null}
        </main>
    )
}

export default BrowseReports