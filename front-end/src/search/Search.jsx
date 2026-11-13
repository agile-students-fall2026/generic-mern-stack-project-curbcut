import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SearchSuggestions from './SearchSuggestions'
import SearchResults from './SearchResults'
import RecentSearches from './RecentSearches'
import sortNewestFirst from '../reports/sortNewestFirst'
import './Search.css'

// The Search screen (M03 to M07)
function Search() {
  // What the user has typed in the search box
  const [search, setSearch] = useState('')
  // Becomes true when the user presses Enter or "See all results"
  const [showResults, setShowResults] = useState(false)
  // Searches made earlier, newest first. They are saved on the back end.
  const [recentSearches, setRecentSearches] = useState([])
  // The buildings CurbCut covers right now
  const [supportedBuildings, setSupportedBuildings] = useState([])
  // The buildings and reports that match what the user typed
  const [matchingBuildings, setMatchingBuildings] = useState([])
  const [matchingReports, setMatchingReports] = useState([])
  // The entrances and floors, so each card can show where its report is
  const [locations, setLocations] = useState([])
  const [error, setError] = useState('')

  // When the page opens, ask the back end for the recent searches, the
  // supported buildings, and the entrances and floors
  useEffect(() => {
    async function loadStartScreen() {
      try {
        const recentResponse = await fetch('/api/recent-searches')
        const recentData = await recentResponse.json()

        setRecentSearches(recentData)

        // A search with nothing typed sends back every supported building
        const searchResponse = await fetch('/api/search?q=')
        const searchData = await searchResponse.json()

        setSupportedBuildings(searchData.buildings)

        const locationsResponse = await fetch('/api/locations')
        const locationsData = await locationsResponse.json()

        setLocations(locationsData)
      } catch {
        setError('Buildings could not be loaded. Please refresh.')
      }
    }

    loadStartScreen()
  }, [])

  // Every time the search box changes, ask the back end what matches
  useEffect(() => {
    async function loadMatches() {
      try {
        // The address to ask, like /api/search?q=ramp.
        // encodeURIComponent makes symbols like & and # safe in the address.
        const address = '/api/search?q=' + encodeURIComponent(search)
        const response = await fetch(address)
        const data = await response.json()

        setMatchingBuildings(data.buildings)
        setMatchingReports(sortNewestFirst(data.reports))
      } catch {
        setError('Results could not be loaded. Please refresh.')
      }
    }

    // Only ask when something has been typed
    if (search.trim() !== '') {
      loadMatches()
    }
  }, [search])

  // Typing goes back to the suggestions
  function typeSearch(event) {
    setSearch(event.target.value)
    setShowResults(false)
  }

  // Send a search to the back end, which saves it and sends back the new list
  async function saveSearch(text) {
    try {
      const response = await fetch('/api/recent-searches', {
        // POST means we are sending something, not just asking
        method: 'POST',
        // Tells the back end that what we send is JSON
        headers: { 'Content-Type': 'application/json' },
        // The search itself, like { "search": "ramp" }
        body: JSON.stringify({ search: text }),
      })
      const data = await response.json()

      setRecentSearches(data)
    } catch {
      // If the back end cannot be reached, the list just stays the same
    }
  }

  // Show the full results for a search, but only if it is not empty
  function showSearchResults(text) {
    if (text.trim() === '') {
      return
    }

    saveSearch(text)
    setSearch(text)
    setShowResults(true)
  }

  // Pressing Enter shows the full results instead of reloading the page
  function submitSearch(event) {
    event.preventDefault()
    showSearchResults(search)
  }

  // "See all results" shows the full results for what is typed
  function seeAllResults() {
    showSearchResults(search)
  }

  // Empty the search box and go back to the start
  function clearSearch() {
    setSearch('')
    setShowResults(false)
  }

  // Which part of the screen to show:
  // 'start' when nothing is typed, 'suggestions' while typing,
  // and 'results' after Enter or "See all results"
  let screen = 'start'

  if (search !== '' && !showResults) {
    screen = 'suggestions'
  }

  if (search !== '' && showResults) {
    screen = 'results'
  }

  return (
    <main className="search">
      <h1 className="search__title">Search</h1>

      <form onSubmit={submitSearch}>
        <label className="search__label" htmlFor="search-input">
          Search buildings and barriers
        </label>

        <div className="search__row">
          <input
            id="search-input"
            className="search__input"
            value={search}
            onChange={typeSearch}
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

      {screen === 'start' && (
        <div>
          <RecentSearches
            searches={recentSearches}
            onSelect={showSearchResults}
          />

          <h2 className="search__subtitle">Supported buildings</h2>

          {supportedBuildings.map((building) => (
            <Link
              key={building.id}
              to={'/buildings/' + building.id}
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

      {/* While the user is typing, show matching buildings and barriers */}
      {screen === 'suggestions' && (
        <SearchSuggestions
          buildings={matchingBuildings}
          reports={matchingReports}
          onSeeAll={seeAllResults}
          onCancel={clearSearch}
        />
      )}

      {/* After Enter or "See all results", show the full results */}
      {screen === 'results' && (
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
