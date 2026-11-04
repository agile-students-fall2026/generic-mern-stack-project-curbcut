import { Link } from 'react-router-dom'
import './SearchSuggestions.css'

// The list shown under the search box while the user is typing (M04)
function SearchSuggestions({ buildings, onCancel }) {
  return (
    <div className="suggestions">
      {buildings.length === 0 && <p>No suggestions found.</p>}

      {buildings.map((building) => (
        <Link
          key={building.id}
          to={`/buildings/${building.id}`}
          className="suggestions__item"
        >
          Building: {building.name}
        </Link>
      ))}

      {/* Barrier suggestions come with the shared reports in #86 */}
      {/* The "See all results" button is added in #83 */}

      <button type="button" className="suggestions__cancel" onClick={onCancel}>
        Cancel
      </button>
    </div>
  )
}

export default SearchSuggestions
