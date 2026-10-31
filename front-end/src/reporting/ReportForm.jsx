import { useState } from 'react'
import './ReportForm.css'

function ReportForm() {
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')

  return (
    <main className="reporting">
      <h1 className="reporting__title">Report a barrier</h1>

      <p className="reporting__intro">
        Your report is shared anonymously with other students.
      </p>

      <form onSubmit={(event) => event.preventDefault()}>
        <div className="reporting__field">
          <p id="category-label" className="reporting__label">
            Category *
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
      </form>
    </main>
  )
}

export default ReportForm
