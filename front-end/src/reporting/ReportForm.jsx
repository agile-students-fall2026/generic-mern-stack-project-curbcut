import { useState } from 'react'
import LocationSelector from './LocationSelector'
import ObservationTimeEditor from './ObservationTimeEditor'
import PhotoSelector from './PhotoSelector'
import validateReport from './validateReport'
import './ReportForm.css'

function ReportForm() {
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [observedAt, setObservedAt] = useState(() => new Date())
  const [location, setLocation] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [errors, setErrors] = useState({})
  const [validationPassed, setValidationPassed] = useState(false)

  const errorCount = Object.keys(errors).length

  function changeField(setter, value) {
    setter(value)
    setValidationPassed(false)
  }

  function checkReport(event) {
    event.preventDefault()

    const nextErrors = validateReport({
      location,
      category,
      observedAt,
      description,
    })

    setErrors(nextErrors)
    setValidationPassed(Object.keys(nextErrors).length === 0)
  }

  return (
    <main className="reporting">
      <h1 className="reporting__title">Report a barrier</h1>

      <p className="reporting__intro">
        Your report is shared anonymously with other students.
      </p>

      <form noValidate onSubmit={checkReport}>
        {errorCount > 0 && (
          <div className="reporting__error-summary" role="alert">
            {errorCount} {errorCount === 1 ? 'field needs' : 'fields need'}{' '}
            attention. Check the messages below.
          </div>
        )}

        <div
          className="reporting__field"
          role="group"
          aria-labelledby="location-label"
          aria-describedby={errors.location ? 'location-error' : undefined}
          aria-invalid={Boolean(errors.location)}
        >
          <p id="location-label" className="reporting__label">
            Location *
          </p>

          <LocationSelector
            location={location}
            onSelect={(value) => changeField(setLocation, value)}
          />

          {errors.location && (
            <p id="location-error" className="reporting__error">
              {errors.location}
            </p>
          )}
        </div>

        <div className="reporting__field">
          <p id="category-label" className="reporting__label">
            Barrier category *
          </p>

          <div
            className="reporting__categories"
            role="group"
            aria-labelledby="category-label"
            aria-describedby={errors.category ? 'category-error' : undefined}
            aria-invalid={Boolean(errors.category)}
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
                onClick={() => changeField(setCategory, option)}
              >
                {option}
              </button>
            ))}
          </div>

          {errors.category && (
            <p id="category-error" className="reporting__error">
              {errors.category}
            </p>
          )}
        </div>

        <div className="reporting__field">
          <p id="observation-label" className="reporting__label">
            When did you see it? *
          </p>

          <div
            className="reporting__input reporting__row"
            role="group"
            aria-labelledby="observation-label"
            aria-describedby={
              errors.observedAt ? 'observation-error' : undefined
            }
            aria-invalid={Boolean(errors.observedAt)}
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

            <ObservationTimeEditor
              observedAt={observedAt}
              onConfirm={(value) => changeField(setObservedAt, value)}
            />
          </div>

          {errors.observedAt && (
            <p id="observation-error" className="reporting__error">
              {errors.observedAt}
            </p>
          )}
        </div>

        <div className="reporting__field">
          <label className="reporting__label" htmlFor="description">
            Description *
          </label>

          <textarea
            id="description"
            className="reporting__input reporting__description"
            value={description}
            onChange={(event) =>
              changeField(setDescription, event.target.value)
            }
            placeholder="What is blocking access? Is there a way around it?"
            aria-describedby={
              errors.description
                ? 'description-hint description-error'
                : 'description-hint'
            }
            aria-invalid={Boolean(errors.description)}
            required
          />

          <p id="description-hint" className="reporting__hint">
            Describe the barrier in at least 10 words.
          </p>

          {errors.description && (
            <p id="description-error" className="reporting__error">
              {errors.description}
            </p>
          )}
        </div>

        <PhotoSelector
          photo={photo}
          onChange={(value) => changeField(setPhoto, value)}
        />

        <button
          type="submit"
          className="reporting__button reporting__button--primary reporting__submit"
        >
          Check report
        </button>

        {validationPassed && (
          <p className="reporting__hint" role="status">
            Required fields passed validation. This report has not been
            submitted.
          </p>
        )}
      </form>
    </main>
  )
}

export default ReportForm
