import { useState } from 'react'
import LocationSelector from './LocationSelector'
import './ReportForm.css'

function ReportForm() {
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [observedAt] = useState(() => new Date())
  const [location, setLocation] = useState(null)

  return (
    <main className="reporting">
      <h1 className="reporting__title">Report a barrier</h1>

      <p className="reporting__intro">
        Your report is shared anonymously with other students.
      </p>

      <form onSubmit={(event) => event.preventDefault()}>
        <div className="reporting__field">
          <p id="location-label" className="reporting__label">
            Location *
          </p>

          <LocationSelector location={location} onSelect={setLocation} />
        </div>

        <div className="reporting__field">
          <p id="category-label" className="reporting__label">
            Barrier category *
          </p>

          <div
            className="reporting__categories"
            role="group"
            aria-labelledby="category-label"
          >
            {[
              'Blocked ramp',
              'Elevator outage',
              'Construction',
              'Door issue',
              'Other',
            ].map((option) => (
              <button
                key={option}
                type="button"
                className="reporting__button reporting__category"
                aria-pressed={category === option}
                onClick={() => setCategory(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="reporting__field">
          <p id="observation-label" className="reporting__label">
            When did you see it? *
          </p>

          <div
            className="reporting__input reporting__row"
            role="group"
            aria-labelledby="observation-label"
          >
            <time
              className="reporting__row-value"
              dateTime={observedAt.toISOString()}
            >
              {observedAt.toLocaleString([], {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </time>

            {/* Observation-time editing will be connected in #59. */}
            <button type="button" className="reporting__text-button" disabled>
              Change
            </button>
          </div>
        </div>

        <div className="reporting__field">
          <label className="reporting__label" htmlFor="description">
            Description *
          </label>

          <textarea
            id="description"
            className="reporting__input reporting__description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is blocking access? Is there a way around it?"
            aria-describedby="description-hint"
            required
          />

          <p id="description-hint" className="reporting__hint">
            Describe the barrier in at least 10 words.
          </p>
        </div>

        <div className="reporting__field">
          <p id="photo-label" className="reporting__label">
            Photo (optional)
          </p>

          {/* Photo selection will be connected in #60. */}
          <button
            type="button"
            className="reporting__photo-picker"
            aria-labelledby="photo-label photo-action"
            aria-describedby="photo-hint"
            disabled
          >
            <span id="photo-action">Tap to add a photo</span>
          </button>
        </div>

        {/* Validation and submission will be connected in #61 and #65. */}
        <button
          type="submit"
          className="reporting__button reporting__button--primary reporting__submit"
          disabled
        >
          Submit report
        </button>

        <p id="photo-hint" className="reporting__hint">
          Please keep faces and personal details out of photos.
        </p>
      </form>
    </main>
  )
}

export default ReportForm
