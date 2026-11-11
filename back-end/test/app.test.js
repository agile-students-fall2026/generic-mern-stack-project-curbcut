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
})
