function validateUpdate({ choice, note, photo }) {
  const errors = {}
  const choices = ['Still there', "It's cleared", 'It has changed']

  if (!choices.includes(choice)) {
    errors.choice = 'Choose what you observed.'
  }

  if (!note.trim()) {
    errors.note = 'Describe what you observed.'
  }

  if (choice === "It's cleared" && !photo?.file) {
    errors.photo = 'Add a photo showing the cleared location.'
  }

  return errors
}

export default validateUpdate
