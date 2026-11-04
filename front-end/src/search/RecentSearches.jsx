import './RecentSearches.css'

// Searches the user made earlier in this visit (#48)
function RecentSearches({ searches, onSelect }) {
  // Show nothing if there are no earlier searches
  if (searches.length === 0) {
    return null
  }

  return (
    <div className="recent">
      <h2 className="recent__title">Recent searches</h2>

      {searches.map((item) => (
        <button
          key={item}
          type="button"
          className="recent__item"
          onClick={() => onSelect(item)}
        >
          {item}
        </button>
      ))}
    </div>
  )
}

export default RecentSearches
