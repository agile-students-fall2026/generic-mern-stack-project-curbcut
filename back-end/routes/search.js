import express from 'express'
import readData from '../data/readData.js'

// Gillani's route: GET /api/search?q=ramp
const router = express.Router()

// All the words a report can be found by: its title, category, description,
// and the names of its building and its entrance or floor
function getReportSearchText(report, locations) {
  let text = report.category + ' ' + report.description

  // Some reports also have a title
  if (report.title) {
    text = text + ' ' + report.title
  }

  // Find the entrance or floor this report is about, and add its names
  for (const item of locations) {
    if (
      item.locationId === report.entranceId ||
      item.locationId === report.floorId
    ) {
      text = text + ' ' + item.buildingName + ' ' + item.locationName
    }
  }

  // Small letters, so "Kimmel" and "kimmel" both match
  return text.toLowerCase()
}

// Sends the supported buildings and the reports that match what was typed
function sendSearchResults(request, response) {
  // What the user typed, without extra spaces and in small letters.
  // If nothing was typed, everything matches.
  let searchText = ''

  if (request.query.q) {
    searchText = request.query.q.trim().toLowerCase()
  }

  const buildingData = readData('buildings.json')
  const locations = readData('locations.json')
  const reports = readData('reports.json')

  // Supported buildings whose name contains what the user typed
  const matchingBuildings = []

  for (const building of buildingData.buildings) {
    if (
      building.availability === 'available' &&
      building.name.toLowerCase().includes(searchText)
    ) {
      matchingBuildings.push(building)
    }
  }

  // Reports whose words contain what the user typed
  const matchingReports = []

  for (const report of reports) {
    if (getReportSearchText(report, locations).includes(searchText)) {
      matchingReports.push(report)
    }
  }

  response.json({ buildings: matchingBuildings, reports: matchingReports })
}

// When someone asks for /api/search, run sendSearchResults
router.get('/', sendSearchResults)

export default router
