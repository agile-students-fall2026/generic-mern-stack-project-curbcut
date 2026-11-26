import express from 'express'
import readData from '../data/readData.js'

// Huzaifa's route: GET /api/about
// app.js mounts this router at /api/about.
const router = express.Router()

function sendCoverage(request, response) {
  const buildingData = readData('buildings.json')
  const locations = readData('locations.json')

  // The About page should list only buildings currently marked available.
  const buildings = buildingData.buildings.filter(
    (building) => building.availability === 'available',
  )

  // Count documented floors only for those available buildings.
  const availableBuildingIds = new Set(buildings.map((building) => building.id))
  const floorCount = locations.filter(
    (location) =>
      location.locationType === 'floor' &&
      availableBuildingIds.has(location.buildingId),
  ).length

  response.json({ buildings, floorCount })
}

router.get('/', sendCoverage)

export default router
