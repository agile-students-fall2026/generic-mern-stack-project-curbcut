import { useEffect, useRef, useState } from 'react'
import PhotoSelector from '../reporting/PhotoSelector'
import validateUpdate from './validateUpdate'
import '../reporting/ReportForm.css'

function AddUpdateForm({
  report,
  locationName,
  initialChoice,
  onCancel,
  onSuccess,
}) {
  const [choice, setChoice] = useState(initialChoice)
  const [note, setNote] = useState('')
  const [photo, setPhoto] = useState(null)
  const [errors, setErrors] = useState({})
  const [submissionError, setSubmissionError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const submissionLock = useRef(false)
  const mountedRef = useRef(false)
  const headingRef = useRef(null)
  const errorRef = useRef(null)

  useEffect(() => {
    mountedRef.current = true
    headingRef.current.focus()

    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (Object.keys(errors).length > 0 || submissionError) {
      errorRef.current.focus()
    }
  }, [errors, submissionError])

  async function handleSubmit(event) {
    event.preventDefault()

    if (submissionLock.current) {
      return
    }

    const values = { choice, note, photo }
    const nextErrors = validateUpdate(values)
    if (photo?.file || choice === "It's cleared") {
      nextErrors.photo = 'Photo updates and clearance are not available yet.'
    }
    setErrors(nextErrors)
    setSubmissionError('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    submissionLock.current = true
    setIsSubmitting(true)

    try {
      const response = await fetch(
        `/api/reports/${encodeURIComponent(report.id)}/updates`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ choice, note: note.trim() }),
        },
      )
      const data = await response.json()

      if (!response.ok) {
        if (data.errors) {
          if (mountedRef.current) {
            setErrors(data.errors)
          }
          return
        }
        throw new Error(data.error || 'Could not post your update. Try again.')
      }

      if (mountedRef.current) {
        onSuccess(data)
      }
    } catch (error) {
      if (mountedRef.current) {
        setSubmissionError(error.message)
      }
    } finally {
      submissionLock.current = false

      if (mountedRef.current) {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <section className="reporting" aria-labelledby="update-heading">
      <h2 id="update-heading" ref={headingRef} tabIndex={-1}>
        Add an update
      </h2>
      <p>
        {report.title || report.category} — {locationName}
      </p>
      <form
        noValidate
        onSubmit={handleSubmit}
        onChange={() => setSubmissionError('')}
      >
        {(Object.keys(errors).length > 0 || submissionError) && (
          <div
            className="reporting__error-summary"
            role="alert"
            ref={errorRef}
            tabIndex={-1}
          >
            {submissionError || 'Check the fields below.'}
          </div>
        )}
        <fieldset className="reporting__fieldset" disabled={isSubmitting}>
          <fieldset className="reporting__fieldset">
            <legend className="reporting__label">What did you observe?</legend>
            <div className="reporting__categories reporting__field">
              {['Still there', "It's cleared", 'It has changed'].map(
                (option) => (
                  <label className="reporting__button" key={option}>
                    <input
                      type="radio"
                      name="update-choice"
                      value={option}
                      checked={choice === option}
                      onChange={(event) => setChoice(event.target.value)}
                      aria-invalid={Boolean(errors.choice)}
                      aria-describedby={
                        errors.choice ? 'update-choice-error' : undefined
                      }
                      required
                    />{' '}
                    {option}
                  </label>
                ),
              )}
            </div>
            {errors.choice && (
              <p id="update-choice-error" className="reporting__error">
                {errors.choice}
              </p>
            )}
          </fieldset>
          <div className="reporting__field">
            <label className="reporting__label" htmlFor="update-note">
              Written observation (required)
            </label>
            <textarea
              id="update-note"
              className="reporting__input reporting__description"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              aria-invalid={Boolean(errors.note)}
              aria-describedby={errors.note ? 'update-note-error' : undefined}
              required
            />
            {errors.note && (
              <p id="update-note-error" className="reporting__error">
                {errors.note}
              </p>
            )}
          </div>
          <PhotoSelector
            photo={photo}
            onChange={(value) => {
              setPhoto(value)
              setSubmissionError('')
            }}
            required={choice === "It's cleared"}
            validationError={errors.photo}
          />
          <p className="reporting__hint">
            Text updates are saved and remain after refresh. Photo updates and
            clearance are not available yet.
          </p>
          <div className="reporting__actions">
            <button
              className="reporting__button reporting__button--primary"
              type="submit"
            >
              Post update
            </button>
            <button
              className="reporting__button"
              type="button"
              onClick={onCancel}
            >
              Cancel
            </button>
          </div>
        </fieldset>
        {isSubmitting && <p role="status">Posting your update…</p>}
      </form>
    </section>
  )
}

export default AddUpdateForm
