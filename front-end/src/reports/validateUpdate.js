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

  const file = photo?.file

  if (file) {
    if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
      errors.photo = 'Choose a JPEG or PNG image.'
    } else if (file.size === 0 || file.size > 5_000_000) {
      errors.photo = 'Choose a nonempty image no larger than 5 MB.'
    }
  }

  return errors
}

export default validateUpdate
