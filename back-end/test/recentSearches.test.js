import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'

// Gillani's tests for GET and POST /api/recent-searches.
// These tests run in order, and each one adds to the same list.
describe('Recent searches', function () {
  it('starts with an empty list', async function () {
    const response = await request(app).get('/api/recent-searches')

    expect(response.status).to.equal(200)
    expect(response.body).to.deep.equal([])
  })

  it('saves a search', async function () {
    const response = await request(app)
      .post('/api/recent-searches')
      .send({ search: 'ramp' })

    expect(response.status).to.equal(201)
    expect(response.body).to.deep.equal(['ramp'])
  })

  it('puts the newest search first', async function () {
    const response = await request(app)
      .post('/api/recent-searches')
      .send({ search: 'elevator' })

    expect(response.body).to.deep.equal(['elevator', 'ramp'])
  })

  it('does not repeat a search, but moves it to the top', async function () {
    const response = await request(app)
      .post('/api/recent-searches')
      .send({ search: 'ramp' })

    expect(response.body).to.deep.equal(['ramp', 'elevator'])
  })

  it('removes extra spaces before saving', async function () {
    const response = await request(app)
      .post('/api/recent-searches')
      .send({ search: '  elevator  ' })

    expect(response.body).to.deep.equal(['elevator', 'ramp'])
  })

  it('does not save an empty search', async function () {
    const response = await request(app)
      .post('/api/recent-searches')
      .send({ search: '   ' })

    expect(response.status).to.equal(400)
    expect(response.body.error).to.equal('Please send a search.')
  })

  it('keeps only the 5 newest searches', async function () {
    const searches = ['a', 'b', 'c', 'd', 'e', 'f']

    for (const search of searches) {
      await request(app).post('/api/recent-searches').send({ search: search })
    }

    const response = await request(app).get('/api/recent-searches')

    expect(response.body).to.deep.equal(['f', 'e', 'd', 'c', 'b'])
  })
})
