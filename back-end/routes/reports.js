import express from 'express'
import readData from '../data/readData.js'
import validateReport from '../validation/validateReport.js'

const router = express.Router()

router.get('/', function (request, response) {
  const reports = readData('reports.json')
  response.json(reports)
})

router.post('/', function (request, response) {
  const locations = readData('locations.json')
  const errors = validateReport(request.body, locations)

  if (Object.keys(errors).length > 0) {
    return response.status(400).json({ errors })
  }

  return response.sendStatus(501)
})

export default router