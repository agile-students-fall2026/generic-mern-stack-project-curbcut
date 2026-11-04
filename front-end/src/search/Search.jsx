import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import SearchSuggestions from './SearchSuggestions'
import './Search.css'

// The Search screen (M03, M04)
function Search() {
  // What the user has typed in the search box
  const [search, setSearch] = useState('')
  const [buildings, setBuildings] = useState([])
  const [error, setError] = useState('')

  // Load the list of buildings once, when the page opens
  useEffect(() => {
    fetch('/data/buildings.json')
      .then((response) => response.json())
      .then((data) => setBuildings(data.buildings))
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

  return (
    <main className="search">
      <h1 className="search__title">Search</h1>

      {/* Pressing Enter to search is added in #83 */}
      <form onSubmit={(event) => event.preventDefault()}>
        <label className="search__label" htmlFor="search-input">
          Search buildings and barriers
        </label>

        <div className="search__row">
          <input
            id="search-input"
            className="search__input"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by building or barrier"
          />

          {search !== '' && (
            <button
              type="button"
              className="search__clear"
              onClick={() => setSearch('')}
            >
              Clear
            </button>
          )}
        </div>
      </form>

      {error !== '' && <p className="search__error">{error}</p>}

      {search === '' && (
        <div>
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
      {search !== '' && (
        <SearchSuggestions
          buildings={matchingBuildings}
          onCancel={() => setSearch('')}
        />
      )}
    </main>
  )
}

export default Search
