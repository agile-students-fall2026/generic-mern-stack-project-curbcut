import { useEffect, useRef, useState } from 'react'
import PhotoSelector from '../reporting/PhotoSelector'
import validateUpdate from './validateUpdate'
import '../reporting/ReportForm.css'

function AddUpdateForm({ report, locationName, initialChoice, onCancel }) {
  const [choice, setChoice] = useState(initialChoice)
  const [note, setNote] = useState('')
  const [photo, setPhoto] = useState(null)
  const [errors, setErrors] = useState({})
  const [feedback, setFeedback] = useState('')
  const headingRef = useRef(null)
  const errorRef = useRef(null)

  useEffect(() => {
    headingRef.current.focus()
  }, [])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      errorRef.current.focus()
    }
  }, [errors])

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validateUpdate({ choice, note, photo })
    setErrors(nextErrors)
    setFeedback('')

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setFeedback('Posting is not available yet. Your update has not been sent.')
  }

  return (
    <section className="reporting" aria-labelledby="update-heading">
      <h2 id="update-heading" ref={headingRef} tabIndex={-1}>
        Add an update
      </h2>
      <p>
        {report.title || report.category} — {locationName}
      </p>
      <form noValidate onSubmit={handleSubmit} onChange={() => setFeedback('')}>
        {Object.keys(errors).length > 0 && (
          <div
            className="reporting__error-summary"
            role="alert"
            ref={errorRef}
            tabIndex={-1}
          >
            Check the fields below.
          </div>
        )}
        <fieldset className="reporting__fieldset">
          <legend className="reporting__label">What did you observe?</legend>
          <div className="reporting__categories reporting__field">
            {['Still there', "It's cleared", 'It has changed'].map((option) => (
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
            ))}
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
            setFeedback('')
          }}
          required={choice === "It's cleared"}
          validationError={errors.photo}
        />
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
        {feedback && <p role="status">{feedback}</p>}
      </form>
    </section>
  )
}

export default AddUpdateForm
