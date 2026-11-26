import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'

describe('GET /api/about', function () {
  it('returns available coverage information', async function () {
    const response = await request(app).get('/api/about')

    expect(response.status).to.equal(200)
    expect(response.body.buildings).to.be.an('array')
    expect(response.body.floorCount).to.be.a('number')
  })

  it('includes only available buildings', async function () {
    const response = await request(app).get('/api/about')

    // A coming-soon building must not contribute to About coverage.
    expect(
      response.body.buildings.every(
        (building) => building.availability === 'available',
      ),
    ).to.equal(true)
  })
})
