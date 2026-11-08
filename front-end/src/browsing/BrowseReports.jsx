import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ReportCard from '../components/ReportCard'
import useReports from '../reports/useReports'
import './BrowseReports.css'

const PAGE_SIZE = 10
const DEFAULT_FILTERS = {
  category: 'All',
  observationPeriod: 'any',
  sort: 'updated-newest',
}

function BrowseReports() {
  // Use the same report list as Home and Search.
  const { reports, loading, error, retryLoad } = useReports()
  const [locations, setLocations] = useState([])
  const [locationsError, setLocationsError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [searchParams] = useSearchParams()
  const filtersDialog = useRef(null)
  const buildingId = searchParams.get('buildingId') || ''

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

  const searchTerm = search.toLowerCase()
  const categories = [
    ...new Set(reports.map((report) => report.category)),
  ].sort()
  const now = new Date()

  function matchesConditions(report, selectedFilters) {
    const searchableText =
      `${report.category} ${report.description} ${report.buildingId}`.toLowerCase()
    const observedAt = new Date(report.observedAt)
    let observationStart = null

    if (selectedFilters.observationPeriod === 'today') {
      observationStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      )
    } else if (selectedFilters.observationPeriod === 'past-week') {
      observationStart = new Date(now)
      observationStart.setDate(observationStart.getDate() - 7)
    } else if (selectedFilters.observationPeriod === 'past-month') {
      observationStart = new Date(now)
      const dayOfMonth = observationStart.getDate()
      observationStart.setDate(1)
      observationStart.setMonth(observationStart.getMonth() - 1)
      const lastDayOfPreviousMonth = new Date(
        observationStart.getFullYear(),
        observationStart.getMonth() + 1,
        0,
      ).getDate()
      observationStart.setDate(Math.min(dayOfMonth, lastDayOfPreviousMonth))
    }

    return (
      (searchTerm === '' || searchableText.includes(searchTerm)) &&
      (status === 'All' || report.status === status) &&
      (!buildingId || report.buildingId === buildingId) &&
      (selectedFilters.category === 'All' ||
        report.category === selectedFilters.category) &&
      (!observationStart || observedAt >= observationStart)
    )
  }

  const matchingReports = reports.filter((report) =>
    matchesConditions(report, filters),
  )
  const draftMatchingCount = reports.filter((report) =>
    matchesConditions(report, draftFilters),
  ).length

  const sortedReports = [...matchingReports].sort((first, second) => {
    const [field, direction] = filters.sort.split('-')
    const timestampField = field === 'observed' ? 'observedAt' : 'updatedAt'
    const difference =
      new Date(second[timestampField]) - new Date(first[timestampField])
    return direction === 'newest' ? difference : -difference
  })
  const visibleReports = sortedReports.slice(0, visibleCount)
  const buildingName = locations.find(
    (location) => location.buildingId === buildingId,
  )?.buildingName

  function openFilters() {
    setDraftFilters(filters)
    filtersDialog.current?.showModal()
  }

  function applyFilters(event) {
    event.preventDefault()
    setFilters(draftFilters)
    setVisibleCount(PAGE_SIZE)
    filtersDialog.current?.close()
  }

  function resetFilters() {
    setDraftFilters({
      ...draftFilters,
      category: 'All',
      observationPeriod: 'any',
      sort: 'updated-newest',
    })
  }

  return (
    <main className="browse-reports">
      <h1 className="browse-reports__title">Browse reports</h1>

      {buildingId && (
        <p className="browse-reports__building">
          Reports for <strong>{buildingName || buildingId}</strong>
        </p>
      )}

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
            onChange={(event) => {
              setSearch(event.target.value)
              setVisibleCount(PAGE_SIZE)
            }}
          />
        </div>

        <button
          className="browse-reports__filter-button"
          type="button"
          onClick={openFilters}
        >
          Filters
        </button>
      </div>

      <div
        className="browse-reports__status-tabs"
        role="group"
        aria-label="Filter by status"
      >
        {['All', 'Active', 'Resolved'].map((option) => (
          <button
            key={option}
            type="button"
            className={status === option ? 'is-selected' : ''}
            aria-pressed={status === option}
            onClick={() => {
              setStatus(option)
              setVisibleCount(PAGE_SIZE)
            }}
          >
            {option}
          </button>
        ))}
      </div>

      <dialog
        ref={filtersDialog}
        className="browse-reports__dialog"
        aria-labelledby="filters-title"
      >
        <form onSubmit={applyFilters}>
          <h2 id="filters-title">Filter reports</h2>
          <label className="browse-reports__label" htmlFor="reports-category">
            Category
          </label>
          <select
            id="reports-category"
            className="browse-reports__select"
            value={draftFilters.category}
            onChange={(event) =>
              setDraftFilters({ ...draftFilters, category: event.target.value })
            }
          >
            <option value="All">All categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <label
            className="browse-reports__label"
            htmlFor="reports-observation-period"
          >
            Observation date
          </label>
          <select
            id="reports-observation-period"
            className="browse-reports__select"
            value={draftFilters.observationPeriod}
            onChange={(event) =>
              setDraftFilters({
                ...draftFilters,
                observationPeriod: event.target.value,
              })
            }
          >
            <option value="any">Any time</option>
            <option value="today">Today</option>
            <option value="past-week">Past week</option>
            <option value="past-month">Past month</option>
          </select>
          <label className="browse-reports__label" htmlFor="reports-sort">
            Sort by
          </label>
          <select
            id="reports-sort"
            className="browse-reports__select"
            value={draftFilters.sort}
            onChange={(event) =>
              setDraftFilters({ ...draftFilters, sort: event.target.value })
            }
          >
            <option value="updated-newest">Last updated, newest first</option>
            <option value="updated-oldest">Last updated, oldest first</option>
            <option value="observed-newest">
              First observed, newest first
            </option>
            <option value="observed-oldest">
              First observed, oldest first
            </option>
          </select>
          <div className="browse-reports__dialog-actions">
            <button type="button" onClick={resetFilters}>
              Reset
            </button>
            <button
              type="button"
              onClick={() => filtersDialog.current?.close()}
            >
              Cancel
            </button>
            <button type="submit">
              Show {draftMatchingCount}{' '}
              {draftMatchingCount === 1 ? 'report' : 'reports'}
            </button>
          </div>
        </form>
      </dialog>

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
            {matchingReports.length}{' '}
            {matchingReports.length === 1
              ? 'matching report'
              : 'matching reports'}
            {' · Sorted by '}
            {filters.sort.startsWith('updated')
              ? 'last updated'
              : 'first observed'}
            {filters.sort.endsWith('newest')
              ? ', newest first'
              : ', oldest first'}
          </p>

          {matchingReports.length === 0 ? (
            <p className="browse-reports__empty">
              {reports.length === 0
                ? 'No reports have been posted yet.'
                : 'No reports match these search and filter choices. This does not mean there are no barriers.'}
            </p>
          ) : (
            <section className="browse-reports__list" aria-label="Reports">
              {/* The shared card also links each result to its detail page. */}
              {visibleReports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  locations={locations}
                />
              ))}
            </section>
          )}
          {visibleCount < matchingReports.length && (
            <button
              className="browse-reports__load-more"
              type="button"
              onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            >
              Load more reports
            </button>
          )}
        </>
      ) : null}
    </main>
  )
}

export default BrowseReports
