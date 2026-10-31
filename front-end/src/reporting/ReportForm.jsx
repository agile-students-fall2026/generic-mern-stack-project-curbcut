import { useState } from 'react'
import './ReportForm.css'

function ReportForm() {
  const [description, setDescription] = useState('')

  return (
    <main className="reporting">
      <h1 className="reporting__title">Report a barrier</h1>

      <p className="reporting__intro">
        Your report is shared anonymously with other students.
      </p>

      <form onSubmit={(event) => event.preventDefault()}>
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
/* 
| `useState('')` | Starts the description as an empty string. |
| `description` | Holds the current text. |
| `setDescription(...)` | Updates that text in React state. |
| `value={description}` | Makes the text area display the stored text. |
| `onChange` | Updates state whenever the user types or deletes text. |
| `htmlFor="description"` | Connects the label to the input with that ID. |
| `aria-describedby` | Connects the input to its explanatory text for assistive technology. |
| `event.preventDefault()` | Stops the form from reloading the page if submitted. Actual submission comes later. |
*/