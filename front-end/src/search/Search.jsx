import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SearchSuggestions from './SearchSuggestions'
import SearchResults from './SearchResults'
import RecentSearches from './RecentSearches'
import useReports from '../reports/useReports'
import sortNewestFirst from '../reports/sortNewestFirst'
import './Search.css'

// Earlier searches are kept out here so they stay while moving between pages.
// They are cleared when the page is refreshed.
let savedSearches = []

// The Search screen (M03 to M07)
function Search() {
  // What the user has typed in the search box
  const [search, setSearch] = useState('')
  // Becomes true when the user presses Enter or "See all results"
  const [showResults, setShowResults] = useState(false)
  // Searches made earlier in this visit, newest first
  const [recentSearches, setRecentSearches] = useState(savedSearches)
  const [buildings, setBuildings] = useState([])
  const [locations, setLocations] = useState([])
  const [error, setError] = useState('')

  // Abdullah's shared list of reports (#65)
  const { reports } = useReports()

  // Load the buildings, and their entrances and floors, when the page opens
  useEffect(() => {
    fetch('/data/buildings.json')
      .then((response) => response.json())
      .then((data) => setBuildings(data.buildings))
      .catch(() => setError('Buildings could not be loaded. Please refresh.'))

    fetch('/data/locations.json')
      .then((response) => response.json())
      .then((data) => setLocations(data))
      .catch(() => setError('Buildings could not be loaded. Please refresh.'))
  }, [])

  // Keep only the buildings CurbCut covers right now
  const supportedBuildings = []

  for (const building of buildings) {
    if (building.availability === 'available') {
      supportedBuildings.push(building)
    }
  }

  // Supported buildings whose name contains what the user typed
  const matchingBuildings = []

  for (const building of supportedBuildings) {
    if (building.name.toLowerCase().includes(search.toLowerCase())) {
      matchingBuildings.push(building)
    }
  }

  // Reports whose category, description or building contains what the user
  // typed, newest first
  const matchingReports = []

  for (const report of sortNewestFirst(reports)) {
    const reportText =
      report.category + ' ' + report.description + ' ' + report.buildingId

    if (reportText.toLowerCase().includes(search.toLowerCase())) {
      matchingReports.push(report)
    }
  }

  // Typing goes back to the suggestions
  function typeSearch(text) {
    setSearch(text)
    setShowResults(false)
  }

  // Show the full results for a search, but only if it is not empty
  function showSearchResults(text) {
    if (text.trim() === '') {
      return
    }

    // Put this search at the top of the list, without repeating it
    const updatedSearches = [text]

    for (const oldSearch of recentSearches) {
      if (oldSearch !== text) {
        updatedSearches.push(oldSearch)
      }
    }

    savedSearches = updatedSearches
    setRecentSearches(updatedSearches)
    setSearch(text)
    setShowResults(true)
  }

  // Empty the search box and go back to the start
  function clearSearch() {
    setSearch('')
    setShowResults(false)
  }

  return (
    <main className="search">
      <h1 className="search__title">Search</h1>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          showSearchResults(search)
        }}
      >
        <label className="search__label" htmlFor="search-input">
          Search buildings and barriers
        </label>

        <div className="search__row">
          <input
            id="search-input"
            className="search__input"
            value={search}
            onChange={(event) => typeSearch(event.target.value)}
            placeholder="Search by building or barrier"
          />

          {search !== '' && (
            <button
              type="button"
              className="search__clear"
              onClick={clearSearch}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {error !== '' && <p className="search__error">{error}</p>}

      {search === '' && (
        <div>
          <RecentSearches
            searches={recentSearches}
            onSelect={(item) => showSearchResults(item)}
          />

          <h2 className="search__subtitle">Supported buildings</h2>

          {supportedBuildings.map((building) => (
            <Link
              key={building.id}
              to={`/buildings/${building.id}`}
              className="search__chip"
            >
              {building.name}
            </Link>
          ))}

          <p className="search__note">
            No reports for a place does not mean it is accessible. Check the
            building page for documented entrance information.
          </p>
        </div>
      )}

      {/* While the user is typing, show matching buildings */}
      {search !== '' && !showResults && (
        <SearchSuggestions
          buildings={matchingBuildings}
          reports={matchingReports}
          onSeeAll={() => showSearchResults(search)}
          onCancel={clearSearch}
        />
      )}

      {/* After Enter or "See all results", show the full results */}
      {search !== '' && showResults && (
        <SearchResults
          search={search}
          buildings={matchingBuildings}
          reports={matchingReports}
          locations={locations}
          onNewSearch={clearSearch}
        />
      )}
    </main>
  )
}

export default Search
