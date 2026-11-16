import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'

// Gillani's tests for GET and POST /api/recent-searches.
// These tests run in order, and each one adds to the same browser's list.
describe('Recent searches', function () {
  it('starts with an empty list for a new browser', async function () {
    const response = await request(app).get(
      '/api/recent-searches?visitorId=browser-a',
    )

    expect(response.status).to.equal(200)
    expect(response.body).to.deep.equal([])
  })

  it('saves a search', async function () {
    const response = await request(app)
      .post('/api/recent-searches')
      .send({ visitorId: 'browser-a', search: 'ramp' })

    expect(response.status).to.equal(201)
    expect(response.body).to.deep.equal(['ramp'])
  })

  it('puts the newest search first', async function () {
    const response = await request(app)
      .post('/api/recent-searches')
      .send({ visitorId: 'browser-a', search: 'elevator' })

    expect(response.body).to.deep.equal(['elevator', 'ramp'])
  })

  it('does not repeat a search, but moves it to the top', async function () {
    const response = await request(app)
      .post('/api/recent-searches')
      .send({ visitorId: 'browser-a', search: 'ramp' })

    expect(response.body).to.deep.equal(['ramp', 'elevator'])
  })

  it('removes extra spaces before saving', async function () {
    const response = await request(app)
      .post('/api/recent-searches')
      .send({ visitorId: 'browser-a', search: '  elevator  ' })

    expect(response.body).to.deep.equal(['elevator', 'ramp'])
  })

  it('keeps each browser apart', async function () {
    const response = await request(app).get(
      '/api/recent-searches?visitorId=browser-b',
    )

    // Browser B never searched, so it does not see browser A's searches
    expect(response.body).to.deep.equal([])
  })

  it('does not save an empty search', async function () {
    const response = await request(app)
      .post('/api/recent-searches')
      .send({ visitorId: 'browser-a', search: '   ' })

    expect(response.status).to.equal(400)
    expect(response.body.error).to.equal('Send a visitor id and a search.')
  })

  it('does not save a search that is not text', async function () {
    const response = await request(app)
      .post('/api/recent-searches')
      .send({ visitorId: 'browser-a', search: 123 })

    expect(response.status).to.equal(400)
  })

  it('needs a visitor id to save a search', async function () {
    const response = await request(app)
      .post('/api/recent-searches')
      .send({ search: 'ramp' })

    expect(response.status).to.equal(400)
  })

  it('needs a visitor id to send the list', async function () {
    const response = await request(app).get('/api/recent-searches')

    expect(response.status).to.equal(400)
    expect(response.body.error).to.equal('Send a visitor id.')
  })

  it('keeps only the 5 newest searches', async function () {
    const searches = ['a', 'b', 'c', 'd', 'e', 'f']

    for (const search of searches) {
      await request(app)
        .post('/api/recent-searches')
        .send({ visitorId: 'browser-c', search: search })
    }

    const response = await request(app).get(
      '/api/recent-searches?visitorId=browser-c',
    )

    expect(response.body).to.deep.equal(['f', 'e', 'd', 'c', 'b'])
  })
})
