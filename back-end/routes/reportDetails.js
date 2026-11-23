import express from 'express'
import fs from 'fs'
import { randomUUID } from 'node:crypto'
import readData from '../data/readData.js'
import validateUpdate from '../validation/validateUpdate.js'

const router = express.Router()

function sendReport(request, response) {
  const reports = readData('reports.json')
  const report = reports.find((item) => item.id === request.params.reportId)

  if (!report) {
    response.status(404).json({ error: 'Report not found.' })
    return
  }

  const updates = report.updates || []
  response.json({ ...report, updates, updateCount: updates.length })
}

function addUpdate(request, response) {
  const reports = readData('reports.json')
  const report = reports.find((item) => item.id === request.params.reportId)

  if (!report) {
    response.status(404).json({ error: 'Report not found.' })
    return
  }

  const errors = validateUpdate(request.body)
  if (Object.keys(errors).length > 0) {
    response.status(400).json({ errors })
    return
  }

  const { choice, note } = request.body

  const update = {
    id: randomUUID(),
    reportId: report.id,
    choice,
    note: note.trim(),
    createdAt: new Date().toISOString(),
    photo: null,
  }

  report.updates = [...(report.updates || []), update]
  report.updateCount = report.updates.length
  report.updatedAt = update.createdAt
  report.status = 'Active'

  const temporaryPath = `data/reports-${update.id}.tmp`
  try {
    fs.writeFileSync(temporaryPath, JSON.stringify(reports, null, 2) + '\n')
    fs.renameSync(temporaryPath, 'data/reports.json')
  } finally {
    fs.rmSync(temporaryPath, { force: true })
  }

  response.status(201).json(report)
}

router.get('/:reportId', sendReport)
router.post('/:reportId/updates', addUpdate)

export default router
