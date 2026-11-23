import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ReportCard from '../components/ReportCard'
import './BrowseReports.css'

const PAGE_SIZE = 10
const DEFAULT_FILTERS = {
  category: 'All',
  observationPeriod: 'any',
  sort: 'updated-newest',
}

function BrowseReports() {
  const [locations, setLocations] = useState([])
  const [locationsError, setLocationsError] = useState('')
  const [reports, setReports] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('All')
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [draftFilters, setDraftFilters] = useState(DEFAULT_FILTERS)
  const [searchParams, setSearchParams] = useSearchParams()
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

  useEffect(() => {
    const controller = new AbortController()

    async function loadReports() {
      setLoading(true)
      setError('')

      const query = new URLSearchParams({
        status,
        category: filters.category,
        buildingId,
        sort: filters.sort,
        search,
        observationPeriod: filters.observationPeriod,
        page: String(page),
        pageSize: String(PAGE_SIZE),
      })

      try {
        const response = await fetch(`/api/browse?${query}`, {
          signal: controller.signal,
        })

        if (!response.ok) {
          throw new Error('Reports could not be loaded.')
        }

        const data = await response.json()

        if (!Array.isArray(data.reports)) {
          throw new Error('The browse report data is invalid.')
        }

        if (!controller.signal.aborted) {
          setReports((previous) =>
            page === 1 ? data.reports : [...previous, ...data.reports],
          )
          setCategories(Array.isArray(data.categories) ? data.categories : [])
          setTotal(data.pagination?.total || 0)
          setLoading(false)
        }
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setError(loadError.message)
          setLoading(false)
        }
      }
    }

    loadReports()

    return () => controller.abort()
  }, [buildingId, filters, loadAttempt, page, search, status])

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
    setReports([])
    setPage(1)
    filtersDialog.current?.close()
  }

  function resetFilters() {
    setDraftFilters({
      category: 'All',
      observationPeriod: 'any',
      sort: 'updated-newest',
    })
  }

  function clearAll() {
    setSearch('')
    setStatus('All')
    setFilters(DEFAULT_FILTERS)
    setDraftFilters(DEFAULT_FILTERS)
    setReports([])
    setPage(1)

    if (buildingId) {
      setSearchParams((previous) => {
        const next = new URLSearchParams(previous)
        next.delete('buildingId')
        return next
      })
    }
  }

  function retryLoad() {
    setLoadAttempt((attempt) => attempt + 1)
  }

  const hasActiveFilters =
    search.trim() !== '' ||
    status !== 'All' ||
    buildingId !== '' ||
    filters.category !== 'All' ||
    filters.observationPeriod !== 'any'

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
              setPage(1)
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
              setPage(1)
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
              Apply filters
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
            {total}{' '}
            {total === 1 ? 'matching report' : 'matching reports'}
            {' · Sorted by '}
            {filters.sort.startsWith('updated')
              ? 'last updated'
              : 'first observed'}
            {filters.sort.endsWith('newest')
              ? ', newest first'
              : ', oldest first'}
          </p>

          {reports.length === 0 ? (
            <>
              <p className="browse-reports__empty">
                {hasActiveFilters
                  ? 'No reports match these search and filter choices. This does not mean there are no barriers.'
                  : 'No reports have been posted yet.'}
              </p>
              {hasActiveFilters && (
                <button
                  className="browse-reports__load-more"
                  type="button"
                  onClick={clearAll}
                >
                  Clear filters
                </button>
              )}
            </>
          ) : (
            <section className="browse-reports__list" aria-label="Reports">
              {/* The shared card also links each result to its detail page. */}
              {reports.map((report) => (
                <ReportCard
                  key={report.id}
                  report={report}
                  locations={locations}
                />
              ))}
            </section>
          )}
          {reports.length < total && (
            <button
              className="browse-reports__load-more"
              type="button"
              onClick={() => setPage((current) => current + 1)}
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
