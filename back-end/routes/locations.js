import express from 'express'
import readData from '../data/readData.js'

// Gillani's route: GET /api/locations
const router = express.Router()

// Sends every entrance and floor, so the app can show their names
function sendLocations(request, response) {
  const locations = readData('locations.json')

  response.json(locations)
}

// When someone asks for /api/locations, run sendLocations
router.get('/', sendLocations)

export default router
