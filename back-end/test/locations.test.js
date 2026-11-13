import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'

// Gillani's tests for GET /api/locations
describe('GET /api/locations', function () {
  it('sends the list of entrances and floors', async function () {
    const response = await request(app).get('/api/locations')

    expect(response.status).to.equal(200)
    expect(response.body.length).to.be.above(0)
  })

  it('includes the Kimmel Center main entrance', async function () {
    const response = await request(app).get('/api/locations')

    // Look through the list for the main entrance
    let mainEntrance = null

    for (const item of response.body) {
      if (item.locationId === 'kimmel-main') {
        mainEntrance = item
      }
    }

    expect(mainEntrance.buildingName).to.equal('Kimmel Center')
    expect(mainEntrance.locationName).to.equal('Main entrance')
  })
})
