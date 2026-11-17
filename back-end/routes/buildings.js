import express from 'express'
import readData from '../data/readData.js'

const router = express.Router()

function sendBuildings(request, response) {
  const data = readData('buildings.json')

  response.json(data)
}

function sendBuilding(request, response) {
  const data = readData('buildings.json')
  const building = data.buildings.find((item) => item.id === request.params.buildingId)

  if (!building) {
    response.status(404).json({ error: "Building not found." })
    return
  }

  response.json(building)
}

router.get('/', sendBuildings)
router.get('/:buildingId', sendBuilding)

export default router
