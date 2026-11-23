function validateUpdate(values) {
  const errors = {}
  const choice = values?.choice
  const note = values?.note
  const photo = values?.photo
  const choices = ['Still there', "It's cleared", 'It has changed']

  if (!choices.includes(choice)) {
    errors.choice = 'Choose what you observed.'
  }

  if (typeof note !== 'string' || !note.trim()) {
    errors.note = 'Describe what you observed.'
  }

  if (choice === "It's cleared" || (photo !== undefined && photo !== null)) {
    errors.photo = 'Photo updates are not available yet.'
  }

  return errors
}

export default validateUpdate
