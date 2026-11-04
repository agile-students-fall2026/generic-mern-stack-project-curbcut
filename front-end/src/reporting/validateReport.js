function validateReport({ location, category, observedAt, description }) {
  const errors = {}

  if (!location?.buildingId || !location?.locationId) {
    errors.location = 'Choose a building and entrance or floor.'
  }

  const categories = [
    'Blocked ramp',
    'Elevator outage',
    'Construction',
    'Door issue',
    'Other',
  ]

  if (!categories.includes(category)) {
    errors.category = 'Choose one barrier category.'
  }

  if (!(observedAt instanceof Date) || Number.isNaN(observedAt.getTime())) {
    errors.observedAt = 'Choose a valid observation date and time.'
  } else if (observedAt.getTime() > Date.now()) {
    errors.observedAt = 'The observation time cannot be in the future.'
  }

  const trimmedDescription = description.trim()
  const wordCount =
    trimmedDescription === '' ? 0 : trimmedDescription.split(/\s+/).length

  if (wordCount < 10) {
    errors.description = 'Describe the barrier in at least 10 words.'
  }

  return errors
}

export default validateReport
