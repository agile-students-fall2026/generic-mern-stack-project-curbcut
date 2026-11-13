import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'

// Gillani's tests for GET /api/search
describe('GET /api/search', function () {
  it('finds a report by its category', async function () {
    const response = await request(app).get('/api/search?q=ramp')

    expect(response.status).to.equal(200)
    expect(response.body.buildings.length).to.equal(0)
    expect(response.body.reports.length).to.equal(1)
  })

  it('finds a building and its reports by the building name', async function () {
    const response = await request(app).get('/api/search?q=Kimmel Center')

    expect(response.body.buildings.length).to.equal(1)
    expect(response.body.buildings[0].name).to.equal('Kimmel Center')
    expect(response.body.reports.length).to.equal(1)
  })

  it('finds a report by its entrance name', async function () {
    const response = await request(app).get('/api/search?q=main entrance')

    expect(response.body.reports.length).to.equal(1)
  })

  it('ignores capital letters and extra spaces', async function () {
    const response = await request(app).get('/api/search?q=  KIMMEL  ')

    expect(response.body.buildings.length).to.equal(1)
  })

  it('sends nothing when nothing matches', async function () {
    const response = await request(app).get('/api/search?q=zzz')

    expect(response.body.buildings.length).to.equal(0)
    expect(response.body.reports.length).to.equal(0)
  })

  it('sends every supported building when nothing was typed', async function () {
    const response = await request(app).get('/api/search')

    // Only Kimmel Center is supported right now, the others are coming soon
    expect(response.body.buildings.length).to.equal(1)
  })
})
