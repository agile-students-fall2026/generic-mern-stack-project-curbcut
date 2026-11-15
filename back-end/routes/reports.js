import express from 'express'
import readData from '../data/readData.js'

const router = express.Router()

router.get('/', function (request, response) {
  const reports = readData('reports.json')
  response.json(reports)
})

export default router