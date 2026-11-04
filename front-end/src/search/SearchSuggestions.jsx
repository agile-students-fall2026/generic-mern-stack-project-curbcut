import { Link } from 'react-router-dom'
import './SearchSuggestions.css'

// The list shown under the search box while the user is typing (M04)
function SearchSuggestions({ buildings, reports, onSeeAll, onCancel }) {
  return (
    <div className="suggestions">
      {buildings.length === 0 && reports.length === 0 && (
        <p>No suggestions found.</p>
      )}

      {buildings.map((building) => (
        <Link
          key={building.id}
          to={`/buildings/${building.id}`}
          className="suggestions__item"
        >
          Building: {building.name}
        </Link>
      ))}

      {reports.map((report) => (
        <Link
          key={report.id}
          to={`/reports/${report.id}`}
          className="suggestions__item"
        >
          Barrier: {report.category}
        </Link>
      ))}

      <button type="button" className="suggestions__button" onClick={onSeeAll}>
        See all results
      </button>

      <button type="button" className="suggestions__cancel" onClick={onCancel}>
        Cancel
      </button>
    </div>
  )
}

export default SearchSuggestions
