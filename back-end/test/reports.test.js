// Abdullah's tests for GET /api/reports and POST /api/reports go here.
// Look at app.test.js for an example of how to write one.

import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'
import fs from 'fs'


describe('GET /api/reports', function () {
  it('returns the seeded report with its original fields', async function () {
    const response = await request(app).get('/api/reports')

    expect(response.status).to.equal(200)
    expect(response.body).to.be.an('array')

    const report = response.body.find(function (report) {
      return report.id === 'mock-report-1'
    })

    expect(report).to.deep.equal({
      id: 'mock-report-1',
      buildingId: 'kimmel-center',
      entranceId: 'kimmel-main',
      floorId: null,
      category: 'Blocked ramp',
      description: 'The main entrance ramp is blocked by several large boxes.',
      observedAt: '2026-11-01T15:00:00.000Z',
      createdAt: '2026-11-01T15:05:00.000Z',
      updatedAt: '2026-11-01T15:05:00.000Z',
      photo: null,
      status: 'Active',
    })
  })
  it('returns an empty list when no reports exist', async function () {
  const originalText = fs.readFileSync('data/reports.json', 'utf-8')

  try {
    fs.writeFileSync('data/reports.json', '[]')

    const response = await request(app).get('/api/reports')

    expect(response.status).to.equal(200)
    expect(response.body).to.deep.equal([])
  } finally {
    fs.writeFileSync('data/reports.json', originalText)
  }
})
})