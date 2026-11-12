import { expect } from 'chai'
import readData from '../data/readData.js'

// Gillani's tests for reading the mock data files
describe('readData', function () {
  it('reads the list of buildings', function () {
    const data = readData('buildings.json')

    expect(data.buildings.length).to.be.above(0)
  })

  it('reads the list of entrances and floors', function () {
    const locations = readData('locations.json')

    expect(locations.length).to.be.above(0)
  })
})
