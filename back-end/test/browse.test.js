import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'

describe('GET /api/browse', function () {
  it('returns reports and pagination metadata', async function () {
    const response = await request(app).get('/api/browse?page=1&pageSize=2')

    expect(response.status).to.equal(200)
    expect(response.body.reports).to.be.an('array')
    expect(response.body.reports.length).to.be.at.most(2)
    expect(response.body.pagination.page).to.equal(1)
    expect(response.body.pagination.pageSize).to.equal(2)
  })

  it('filters by status', async function () {
    const response = await request(app).get('/api/browse?status=Active')

    expect(response.status).to.equal(200)
    expect(
      response.body.reports.every((report) => report.status === 'Active'),
    ).to.equal(true)
  })

  it('filters by category and building', async function () {
    const response = await request(app).get(
      '/api/browse?category=Blocked%20ramp&buildingId=kimmel-center',
    )

    expect(response.status).to.equal(200)
    expect(
      response.body.reports.every(
        (report) =>
          report.category === 'Blocked ramp' &&
          report.buildingId === 'kimmel-center',
      ),
    ).to.equal(true)
  })

  it('rejects invalid pagination', async function () {
    const response = await request(app).get('/api/browse?page=0')

    expect(response.status).to.equal(400)
    expect(response.body.error).to.equal('Invalid pagination options.')
  })
})
