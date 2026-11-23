import { expect } from 'chai'
import request from 'supertest'
import fs from 'fs'
import path from 'path'
import app from '../app.js'
import readData from '../data/readData.js'
import validateUpdate from '../validation/validateUpdate.js'

describe('Report details and updates', function () {
  let originalDirectory
  let testDirectory
  let originalReport

  before(function () {
    originalDirectory = process.cwd()
    originalReport = readData('reports.json')[0]
    testDirectory = fs.mkdtempSync(
      path.join(originalDirectory, '.report-test-'),
    )
    fs.mkdirSync(path.join(testDirectory, 'data'))
  })

  beforeEach(function () {
    process.chdir(testDirectory)
    fs.writeFileSync('data/reports.json', JSON.stringify([originalReport]))
  })

  afterEach(function () {
    process.chdir(originalDirectory)
  })

  after(function () {
    fs.rmSync(testDirectory, { recursive: true, force: true })
  })

  it('returns original report fields with empty history and count zero', async function () {
    const response = await request(app).get('/api/reports/' + originalReport.id)

    expect(response.status).to.equal(200)
    expect(response.body).to.deep.equal({
      ...originalReport,
      updates: [],
      updateCount: 0,
    })
  })

  it('returns JSON 404 errors for unknown reports without changing data', async function () {
    const before = fs.readFileSync('data/reports.json', 'utf-8')
    const detail = await request(app).get('/api/reports/missing')
    const update = await request(app)
      .post('/api/reports/missing/updates')
      .send({})

    expect(detail.status).to.equal(404)
    expect(detail.body).to.deep.equal({ error: 'Report not found.' })
    expect(update.status).to.equal(404)
    expect(update.body).to.deep.equal(detail.body)
    expect(fs.readFileSync('data/reports.json', 'utf-8')).to.equal(before)
  })

  for (const choice of ['Still there', 'It has changed']) {
    it(
      'reopens a report for ' +
        choice +
        ' and preserves original fields and history',
      async function () {
        const previousUpdate = {
          id: 'previous-update',
          reportId: originalReport.id,
          choice: 'Still there',
          note: 'An earlier observation.',
          createdAt: originalReport.createdAt,
          photo: null,
        }
        const saved = {
          ...originalReport,
          status: 'Resolved',
          updates: [previousUpdate],
        }
        fs.writeFileSync('data/reports.json', JSON.stringify([saved]))

        const response = await request(app)
          .post('/api/reports/' + originalReport.id + '/updates')
          .send({ choice, note: '  Checked the entrance today.  ' })

        expect(response.status).to.equal(201)
        const report = response.body
        const update = report.updates[1]
        expect(report.status).to.equal('Active')
        expect(report.updateCount).to.equal(2)
        expect(report.updates).to.have.length(2)
        expect(report.updates[0]).to.deep.equal(previousUpdate)
        expect(update.note).to.equal('Checked the entrance today.')
        expect(update.choice).to.equal(choice)
        expect(update.reportId).to.equal(originalReport.id)
        expect(update.photo).to.equal(null)
        expect(update.id).to.be.a('string').and.not.be.empty
        expect(update.id).not.to.equal(previousUpdate.id)
        expect(Number.isNaN(Date.parse(update.createdAt))).to.equal(false)
        expect(report.updatedAt).to.equal(update.createdAt)
        for (const field of [
          'description',
          'photo',
          'createdAt',
          'observedAt',
          'buildingId',
          'entranceId',
          'floorId',
          'category',
        ]) {
          expect(report[field]).to.deep.equal(originalReport[field])
        }
        const detail = await request(app).get(
          '/api/reports/' + originalReport.id,
        )
        expect(detail.status).to.equal(200)
        expect(detail.body).to.deep.equal(report)
        expect(readData('reports.json')[0]).to.deep.equal(report)
        expect(fs.readdirSync('data')).to.deep.equal(['reports.json'])
      },
    )
  }

  it('accepts an update without a photo and leaves another report untouched', async function () {
    const other = { ...originalReport, id: 'other-report' }
    fs.writeFileSync(
      'data/reports.json',
      JSON.stringify([originalReport, other]),
    )
    const response = await request(app)
      .post('/api/reports/' + originalReport.id + '/updates')
      .send({ choice: 'Still there', note: 'The ramp is still blocked.' })

    expect(response.status).to.equal(201)
    expect(response.body.updates[0].photo).to.equal(null)
    expect(readData('reports.json')[1]).to.deep.equal(other)
  })

  it('rejects invalid updates without changing the saved report', async function () {
    const invalidUpdates = [
      {},
      { choice: 'wrong', note: 'Checked today.' },
      { choice: 123, note: 'Checked today.' },
      { choice: 'Still there', note: '  ' },
      { choice: 'Still there', note: 123 },
      { choice: "It's cleared", note: 'The ramp is clear.' },
      { choice: 'Still there', note: 'Checked.', photo: 'bad' },
      {
        choice: 'Still there',
        note: 'Checked.',
        photo: { url: 'blob:temporary' },
      },
      {
        choice: "It's cleared",
        note: 'Checked.',
        photo: { url: '/some-photo.png' },
      },
    ]
    const before = fs.readFileSync('data/reports.json', 'utf-8')
    for (const values of invalidUpdates) {
      const response = await request(app)
        .post('/api/reports/' + originalReport.id + '/updates')
        .send(values)

      expect(response.status).to.equal(400)
      expect(response.body.errors).to.be.an('object').and.not.be.empty
      expect(fs.readFileSync('data/reports.json', 'utf-8')).to.equal(before)
    }
  })

  it('validates missing input and accepts a valid observation directly', function () {
    expect(validateUpdate(undefined)).to.have.keys('choice', 'note')
    expect(validateUpdate(null)).to.have.keys('choice', 'note')
    expect(
      validateUpdate({ choice: 'Still there', note: 'Checked.', photo: null }),
    ).to.deep.equal({})
  })
})
