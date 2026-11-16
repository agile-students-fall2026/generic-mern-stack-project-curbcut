import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'

describe('Building routes', function () {
  it('lists available and coming-soon buildings with their existing IDs', async function () {
    const response = await request(app).get('/api/buildings')

    expect(response.status).to.equal(200)
    expect(response.headers['content-type']).to.include('application/json')
    expect(response.body.dataKind).to.equal('mock')
    expect(response.body.buildings).to.be.an('array')

    const kimmel = response.body.buildings.find(
      (building) => building.id === 'kimmel-center',
    )
    const bobst = response.body.buildings.find(
      (building) => building.id === 'bobst-library',
    )

    expect(kimmel).to.include({
      name: 'Kimmel Center',
      availability: 'available',
    })
    expect(bobst).to.include({
      name: 'Bobst Library',
      availability: 'coming-soon',
    })
  })

  it('returns the selected building and its elevator definitions', async function () {
    const response = await request(app).get('/api/buildings/kimmel-center')

    expect(response.status).to.equal(200)
    expect(response.body).to.include({
      id: 'kimmel-center',
      name: 'Kimmel Center',
      address: '60 Washington Square South, New York, NY',
      availability: 'available',
      photo: null,
      lastVerifiedAt: null,
    })
    expect(response.body.elevators).to.deep.equal([
      { id: 'kimmel-elevator-a', name: 'Elevator A' },
      { id: 'kimmel-elevator-b', name: 'Elevator B' },
    ])
  })

  it('preserves coming-soon availability and unknown information', async function () {
    const response = await request(app).get('/api/buildings/bobst-library')

    expect(response.status).to.equal(200)
    expect(response.body).to.include({
      id: 'bobst-library',
      availability: 'coming-soon',
      photo: null,
      lastVerifiedAt: null,
      elevators: null,
    })
  })

  it('returns a JSON 404 for an unknown building', async function () {
    const response = await request(app).get('/api/buildings/unknown-building')

    expect(response.status).to.equal(404)
    expect(response.headers['content-type']).to.include('application/json')
    expect(response.body).to.deep.equal({ error: 'Building not found.' })
  })
})
