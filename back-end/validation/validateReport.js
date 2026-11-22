function validateReport(report, locations = []) {
  const errors = {}

  const description = report?.description
  if (typeof description !== 'string') {
    errors.description = 'Describe the barrier in at least 10 words.'
  } else {
    const trimmedDescription = description.trim()
    const wordCount =
      trimmedDescription === '' ? 0 : trimmedDescription.split(/\s+/).length

    if (wordCount < 10) {
      errors.description = 'Please use 10 words Atleast.'
    }
  }


  const allowedCategories = [
    'Blocked ramp',
    'Elevator outage',
    'Construction',
    'Door issue',
    'Other',
  ]
  const category = report?.category
  if (!allowedCategories.includes(category)){
    errors.category = 'Choose a valid category.'
  }

  const buildingId = report?.buildingId
  const entranceId = report?.entranceId
  const floorId = report?.floorId

  const locationBelongsToBuilding = locations.some(function (location) {
    const matchesEntrance =
      location.locationType === 'entrance' && location.locationId === entranceId
    const matchesFloor =
      location.locationType === 'floor' && location.locationId === floorId

    return location.buildingId === buildingId && (matchesEntrance || matchesFloor)
  })

  if (!locationBelongsToBuilding) {
    errors.location = 'Choose a valid entrance or floor for the selected building.'
  }
  
  const observedAt = report?.observedAt
  const observedAtTime =
    typeof observedAt === 'string' ? Date.parse(observedAt) : NaN
  if (Number.isNaN(observedAtTime)) {
    errors.observedAt = 'Choose a valid observation date and time.'
  } else if (observedAtTime > Date.now()) {
    errors.observedAt = 'The observation time cannot be in the future.'
  }
  return errors
}

export default validateReport
