import { useRef, useState } from 'react'
import './ObservationTimeEditor.css'

function toLocalInputValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hour = String(date.getHours()).padStart(2, '0')
  const minute = String(date.getMinutes()).padStart(2, '0')

  return `${year}-${month}-${day}T${hour}:${minute}`
}

function ObservationTimeEditor({ observedAt, onConfirm }) {
  const dialogRef = useRef(null)
  const inputRef = useRef(null)
  const [draftTime, setDraftTime] = useState('')
  const [error, setError] = useState('')

  function openEditor() {
    setDraftTime(toLocalInputValue(observedAt))
    setError('')
    dialogRef.current.showModal()
  }

  function closeEditor() {
    dialogRef.current.close()
  }

  function confirmTime() {
    if (!draftTime || !inputRef.current.validity.valid) {
      setError('Enter a valid observation date and time.')
      inputRef.current.focus()
      return
    }

    const selectedTime = new Date(draftTime)

    if (Number.isNaN(selectedTime.getTime())) {
      setError('Enter a valid observation date and time.')
      inputRef.current.focus()
      return
    }

    if (selectedTime.getTime() > Date.now()) {
      setError('The observation time cannot be in the future.')
      inputRef.current.focus()
      return
    }

    onConfirm(selectedTime)
    closeEditor()
  }

  return (
    <>
      <button
        type="button"
        className="reporting__text-button"
        aria-haspopup="dialog"
        onClick={openEditor}
      >
        Change
      </button>

      <dialog
        ref={dialogRef}
        className="observation-time-editor"
        aria-labelledby="observation-time-title"
      >
        <h2 id="observation-time-title">When did you see it?</h2>

        <label className="reporting__label" htmlFor="observation-time">
          Observation date and time
        </label>

        <input
          ref={inputRef}
          id="observation-time"
          type="datetime-local"
          className="reporting__input"
          value={draftTime}
          onChange={(event) => {
            setDraftTime(event.target.value)
            setError('')
          }}
          required
          aria-invalid={Boolean(error)}
          aria-describedby="observation-time-hint observation-time-error"
        />

        <p id="observation-time-hint" className="reporting__hint">
          Use your local date and time. Future times are not allowed.
        </p>

        <p
          id="observation-time-error"
          className="reporting__error"
          role="alert"
        >
          {error}
        </p>

        <div className="reporting__actions observation-time-editor__actions">
          <button
            type="button"
            className="reporting__button"
            onClick={closeEditor}
          >
            Cancel
          </button>

          <button
            type="button"
            className="reporting__button reporting__button--primary"
            onClick={confirmTime}
          >
            Confirm
          </button>
        </div>
      </dialog>
    </>
  )
}

export default ObservationTimeEditor
