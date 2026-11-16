import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SearchSuggestions from './SearchSuggestions'
import SearchResults from './SearchResults'
import RecentSearches from './RecentSearches'
import sortNewestFirst from '../reports/sortNewestFirst'
import getVisitorId from './getVisitorId'
import useReports from '../reports/useReports'
import './Search.css'

// The Search screen (M03 to M07)
function Search() {
  const { reports } = useReports()
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

  // When the page opens, ask the back end for this browser's recent searches
  useEffect(() => {
    async function loadRecentSearches() {
      try {
        const address = '/api/recent-searches?visitorId=' + getVisitorId()
        const response = await fetch(address)

        // Only use the answer if it worked, otherwise keep the empty list
        if (response.ok) {
          const data = await response.json()

          setRecentSearches(data)
        }
      } catch {
        // If the back end cannot be reached, there are no recent searches
      }
    }

    loadRecentSearches()
  }, [])

  // When the page opens, ask the back end for the supported buildings and
  // for the entrances and floors
  useEffect(() => {
    async function loadStartScreen() {
      try {
        // A search with nothing typed sends back every supported building
        const searchResponse = await fetch('/api/search?q=')
        const locationsResponse = await fetch('/api/locations')

        // A failed answer does not have buildings or locations in it
        if (!searchResponse.ok || !locationsResponse.ok) {
          setError('Buildings could not be loaded. Please refresh.')
          return
        }

        const searchData = await searchResponse.json()
        const locationsData = await locationsResponse.json()

        setSupportedBuildings(searchData.buildings)
        setLocations(locationsData)
      } catch {
        setError('Buildings could not be loaded. Please refresh.')
      }
    }

    loadStartScreen()
  }, [])

  // Every time the search box changes, ask the back end what matches
  useEffect(() => {
    // Becomes true once the user types something newer. Then this answer is
    // old, so it is skipped even if it arrives late.
    let isOld = false

    async function loadMatches() {
      try {
        // The address to ask, like /api/search?q=ramp.
        // encodeURIComponent makes symbols like & and # safe in the address.
        const address = '/api/search?q=' + encodeURIComponent(search)
        const response = await fetch(address)

        // A failed answer does not have results in it
        if (!response.ok) {
          setError('Results could not be loaded. Please refresh.')
          return
        }

        const data = await response.json()

        // Skip this answer if the user has typed something newer since
        if (isOld) {
          return
        }

        setMatchingBuildings(data.buildings)
        setMatchingReports(data.reports)
      } catch {
        setError('Results could not be loaded. Please refresh.')
      }
    }

    // Only ask when something has been typed
    if (search.trim() !== '') {
      loadMatches()
    }

    // React runs this when the search changes again, which makes this
    // answer old
    return () => {
      isOld = true
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
        // This browser's id and the search, like
        // { "visitorId": "a1b2c3", "search": "ramp" }
        body: JSON.stringify({ visitorId: getVisitorId(), search: text }),
      })

      // Only use the answer if it worked, otherwise keep the old list
      if (response.ok) {
        const data = await response.json()

        setRecentSearches(data)
      }
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

  const currentReports = matchingReports.map((result) => {
    const sharedReport = reports.find((report) => report.id === result.id)

    if (sharedReport) {
      return sharedReport
    }

    return result
  })
  const sortedReports = sortNewestFirst(currentReports)

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
          reports={sortedReports}
          onSeeAll={seeAllResults}
          onCancel={clearSearch}
        />
      )}

      {/* After Enter or "See all results", show the full results */}
      {screen === 'results' && (
        <SearchResults
          search={search}
          buildings={matchingBuildings}
          reports={sortedReports}
          locations={locations}
          onNewSearch={clearSearch}
        />
      )}
    </main>
  )
}

export default Search
