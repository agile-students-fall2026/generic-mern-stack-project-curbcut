import { expect } from 'chai'
import request from 'supertest'
import app from '../app.js'

// Gillani's tests for the back end itself.
// request(app).get(...) visits an address, and await waits for the answer.
describe('The back end', function () {
  it('says it is running at /api', async function () {
    const response = await request(app).get('/api')

    expect(response.status).to.equal(200)
    expect(response.body.message).to.equal('CurbCut back end is running')
  })

  it('answers 404 for an address that does not exist', async function () {
    const response = await request(app).get('/api/does-not-exist')

    expect(response.status).to.equal(404)
    expect(response.body.error).to.equal('This address does not exist.')
  })

  it('answers with a short message for unreadable data', async function () {
    // Send broken JSON, like a form that was cut off halfway
    const response = await request(app)
      .post('/api/search')
      .set('Content-Type', 'application/json')
      .send('{ "search": ')

    expect(response.status).to.equal(400)
    expect(response.body.error).to.equal('Something went wrong.')
  })
})
