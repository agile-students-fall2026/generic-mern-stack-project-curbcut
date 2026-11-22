import express from 'express'
import fs from 'fs'
import { randomUUID } from 'node:crypto'
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
  const { buildingId, entranceId, floorId, category, description, observedAt } = request.body
  const now = new Date().toISOString()

  const report = {
    id: randomUUID(),
    buildingId,
    entranceId: entranceId ?? null,
    floorId: floorId ?? null,
    category,
    description,
    observedAt,
    createdAt: now,
    updatedAt: now,
    photo: null,
    status: 'Active',
  }

  const reports = readData('reports.json')
  reports.push(report)

  const temporaryPath = `data/reports-${report.id}.tmp`
  try {
    fs.writeFileSync(temporaryPath, JSON.stringify(reports, null, 2) + '\n')
    fs.renameSync(temporaryPath, 'data/reports.json')
  } finally {
    fs.rmSync(temporaryPath, { force: true })
  }

  return response.status(201).json(report)
})

export default router