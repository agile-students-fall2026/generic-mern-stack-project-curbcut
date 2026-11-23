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

describe('POST /api/reports', function () {
  it('rejects a report with a numeric description and leaves stored reports unchanged', async function () {
    const before = fs.readFileSync('data/reports.json', 'utf-8')

    const report = {
      buildingId: 'kimmel-center',
      entranceId: 'kimmel-main',
      floorId: null,
      category: 'Blocked ramp',
      observedAt: '2026-11-01T15:00:00.000Z',
      description: 123,
    }

    const response = await request(app).post('/api/reports').send(report)
    const after = fs.readFileSync('data/reports.json', 'utf-8')

    expect(response.status).to.equal(400)
    expect(response.body.errors.description).to.equal(
      'Describe the barrier in at least 10 words.'
    )
    expect(after).to.equal(before)
  })
  it('rejects a report with a missing observation time', async function () {
    const report = {
      buildingId: 'kimmel-center',
      entranceId: 'kimmel-main',
      floorId: null,
      category: 'Blocked ramp',
      description: 'The main entrance ramp is blocked by several large boxes.',
    }

    const response = await request(app).post('/api/reports').send(report)

    expect(response.status).to.equal(400)
    expect(response.body.errors.observedAt).to.equal(
      'Choose a valid observation date and time.'
    )
  })
  
  it('rejects a valid floor with an invalid entrance and leaves stored reports unchanged', async function () {
    const before = fs.readFileSync('data/reports.json', 'utf-8')

    const report = {
      buildingId: 'kimmel-center',
      entranceId: 'does-not-exist',
      floorId: 'kimmel-floor-1',
      category: 'Elevator outage',
      observedAt: '2026-11-01T15:00:00.000Z',
      description:
        'The elevator on the first floor is out of service and blocking wheelchair access.',
    }

    try {
      const response = await request(app).post('/api/reports').send(report)
      const after = fs.readFileSync('data/reports.json', 'utf-8')

      expect(response.status).to.equal(400)
      expect(response.body.errors.location).to.equal(
        'Choose a valid entrance or floor for the selected building.'
      )
      expect(after).to.equal(before)
    } finally {
      fs.writeFileSync('data/reports.json', before)
    }
  })
})

