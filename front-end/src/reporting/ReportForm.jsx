import { useRef, useState } from 'react'
import useReports from '../reports/useReports'
import LocationSelector from './LocationSelector'
import ObservationTimeEditor from './ObservationTimeEditor'
import PhotoSelector from './PhotoSelector'
import validateReport from './validateReport'
import ReportConfirmation from './ReportConfirmation'
import './ReportForm.css'

function ReportForm() {
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const [observedAt, setObservedAt] = useState(() => new Date())
  const [location, setLocation] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionError, setSubmissionError] = useState('')
  const [submittedReport, setSubmittedReport] = useState(null)
  const [forceFailure, setForceFailure] = useState(false)
  const submissionLock = useRef(false)

  const { loading, error, retryLoad, submitReport } = useReports()
  const errorCount = Object.keys(errors).length

  function changeField(setter, value) {
    setter(value)
    setSubmissionError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (submissionLock.current || submittedReport || loading || error) {
      return
    }

    const values = {
      location,
      category,
      observedAt,
      description,
      photo,
    }

    const nextErrors = validateReport(values)
    setErrors(nextErrors)
    setSubmissionError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    submissionLock.current = true
    setIsSubmitting(true)

    try {
      const report = await submitReport(values, { forceFailure })
      setSubmittedReport(report)
    } catch (submitError) {
      setSubmissionError(submitError.message)
      submissionLock.current = false
    } finally {
      setIsSubmitting(false)
    }
  }

  function startNewReport() {
    setLocation(null)
    setCategory('')
    setObservedAt(new Date())
    setDescription('')
    setPhoto(null)
    setErrors({})
    setSubmissionError('')
    setSubmittedReport(null)
    setForceFailure(false)
    submissionLock.current = false
  }

  if (submittedReport) {
    return (
      <ReportConfirmation
        report={submittedReport}
        location={location}
        onNewReport={startNewReport}
      />
    )
  }

  return (
    <main className="reporting">
      <h1 className="reporting__title">Report a barrier</h1>
      <p className="reporting__intro">
        Your report is shared anonymously with other students.
      </p>

      <form noValidate onSubmit={handleSubmit}>
        {loading && <p role="status">Loading reports…</p>}

        {error && (
          <div role="alert">
            <p className="reporting__error">{error}</p>
            <button
              type="button"
              className="reporting__button"
              onClick={retryLoad}
            >
              Retry loading reports
            </button>
          </div>
        )}

        <fieldset
          className="reporting__fieldset"
          disabled={isSubmitting || loading || Boolean(error)}
        >
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

          {import.meta.env.DEV && (
            <div className="reporting__field">
              <label>
                <input
                  type="checkbox"
                  checked={forceFailure}
                  onChange={(event) => setForceFailure(event.target.checked)}
                />{' '}
                Simulate submission failure
              </label>
            </div>
          )}

          {submissionError && (
            <p className="reporting__error" role="alert">
              {submissionError}
            </p>
          )}

          <button
            type="submit"
            className="reporting__button reporting__button--primary reporting__submit"
          >
            {isSubmitting ? 'Submitting…' : 'Submit report'}
          </button>
          {isSubmitting && <p role="status">Submitting your report…</p>}
        </fieldset>
      </form>
    </main>
  )
}

export default ReportForm
