import { expect } from 'chai'
import validateReport from '../validation/validateReport.js'

const locations = [
  {
    buildingId: 'kimmel-center',
    locationId: 'kimmel-main',
    locationType: 'entrance',
  },
  {
    buildingId: 'kimmel-center',
    locationId: 'kimmel-floor-1',
    locationType: 'floor',
  },
]

function makeValidReport() {
  return {
    buildingId: 'kimmel-center',
    entranceId: 'kimmel-main',
    floorId: null,
    category: 'Blocked ramp',
    description: 'The main entrance ramp is blocked by several large boxes.',
    observedAt: '2026-11-01T15:00:00.000Z',
  }
}

describe('validateReport', function () {
  it('accepts a valid report without a photo', function () {
    const report = makeValidReport()

    const errors = validateReport(report, locations)

    expect(errors).to.deep.equal({})
  })

  describe('description', function () {
    it('rejects a nine-word description even with extra spaces', function () {
      const report = makeValidReport()
      report.description = '  Several heavy boxes are blocking the main entrance ramp.  '

      const errors = validateReport(report, locations)

      expect(errors.description).to.equal('Please use 10 words Atleast.')
    })

    it('accepts a description with exactly ten words', function () {
      const report = makeValidReport()
      report.description = 'Several heavy boxes are blocking the main entrance ramp today.'

      const errors = validateReport(report, locations)

      expect(errors.description).to.equal(undefined)
    })

    it('rejects a missing description', function () {
      const report = makeValidReport()
      delete report.description

      const errors = validateReport(report, locations)

      expect(errors.description).to.equal('Describe the barrier in at least 10 words.')
    })

    it('rejects a description that is a number', function () {
      const report = makeValidReport()
      report.description = 123

      const errors = validateReport(report, locations)

      expect(errors.description).to.equal('Describe the barrier in at least 10 words.')
    })
  })

  describe('category', function () {
    it('accepts a supported category', function () {
      const report = makeValidReport()
      report.category = 'Other'

      const errors = validateReport(report, locations)

      expect(errors.category).to.equal(undefined)
    })

    it('rejects an unsupported category', function () {
      const report = makeValidReport()
      report.category = 'Broken escalator'

      const errors = validateReport(report, locations)

      expect(errors.category).to.equal('Choose a valid category.')
    })

    it('rejects a missing category', function () {
      const report = makeValidReport()
      delete report.category

      const errors = validateReport(report, locations)

      expect(errors.category).to.equal('Choose a valid category.')
    })
  })

  describe('location', function () {
    it('accepts an entrance in the selected building', function () {
      const report = makeValidReport()

      const errors = validateReport(report, locations)

      expect(errors.location).to.equal(undefined)
    })

    it('rejects an entrance from a different building', function () {
      const report = makeValidReport()
      report.buildingId = 'bobst-library'

      const errors = validateReport(report, locations)

      expect(errors.location).to.equal('Choose a valid entrance or floor for the selected building.')
    })

    it('accepts a floor in the selected building', function () {
      const report = makeValidReport()
      report.entranceId = null
      report.floorId = 'kimmel-floor-1'

      const errors = validateReport(report, locations)

      expect(errors.location).to.equal(undefined)
    })

    it('rejects a floor from a different building', function () {
      const report = makeValidReport()
      report.entranceId = null
      report.floorId = 'kimmel-floor-1'
      report.buildingId = 'bobst-library'

      const errors = validateReport(report, locations)

      expect(errors.location).to.equal('Choose a valid entrance or floor for the selected building.')
    })

    it('rejects a building selection with no entrance or floor', function () {
      const report = makeValidReport()
      report.entranceId = null

      const errors = validateReport(report, locations)

      expect(errors.location).to.equal('Choose a valid entrance or floor for the selected building.')
    })
  })

  describe('observation time', function () {
    it('accepts a past observation time', function () {
      const report = makeValidReport()

      const errors = validateReport(report, locations)

      expect(errors.observedAt).to.equal(undefined)
    })

    it('rejects a future observation time', function () {
      const report = makeValidReport()
      report.observedAt = new Date(Date.now() + 60_000).toISOString()

      const errors = validateReport(report, locations)

      expect(errors.observedAt).to.equal('The observation time cannot be in the future.')
    })

    it('rejects a missing observation time', function () {
      const report = makeValidReport()
      delete report.observedAt

      const errors = validateReport(report, locations)

      expect(errors.observedAt).to.equal('Choose a valid observation date and time.')
    })

    it('rejects an invalid observation time', function () {
      const report = makeValidReport()
      report.observedAt = 'yesterday-ish'

      const errors = validateReport(report, locations)

      expect(errors.observedAt).to.equal('Choose a valid observation date and time.')
    })
  })
})