import express from 'express'
import readData from '../data/readData.js'

// Huzaifa's route: GET /api/browse
// app.js mounts this router at /api/browse.
const router = express.Router()

function sendBrowseResults(request, response) {
  const reports = readData('reports.json')
  const locations = readData('locations.json')
  const {
    status,
    category,
    buildingId,
    building,
    sort = 'updated-newest',
    search = '',
    observationPeriod = 'any',
    page = '1',
    pageSize = '10',
  } = request.query

  // Convert pagination values once and reject values that cannot form a page.
  const parsedPage = Number.parseInt(page, 10)
  const parsedPageSize = Number.parseInt(pageSize, 10)

  if (
    Number.isNaN(parsedPage) ||
    parsedPage < 1 ||
    Number.isNaN(parsedPageSize) ||
    parsedPageSize < 1 ||
    parsedPageSize > 100
  ) {
    response.status(400).json({ error: 'Invalid pagination options.' })
    return
  }

  // Accept buildingId for the frontend and building for shorter API queries.
  const selectedBuilding = buildingId || building || ''
  const searchText = typeof search === 'string' ? search.trim().toLowerCase() : ''

  // Determine the oldest observation date allowed by the period filter.
  let observationStart = null
  if (observationPeriod === 'today') {
    const today = new Date()
    observationStart = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  } else if (observationPeriod === 'past-week') {
    observationStart = new Date()
    observationStart.setDate(observationStart.getDate() - 7)
  } else if (observationPeriod === 'past-month') {
    observationStart = new Date()
    const dayOfMonth = observationStart.getDate()
    observationStart.setDate(1)
    observationStart.setMonth(observationStart.getMonth() - 1)
    const lastDayOfPreviousMonth = new Date(
      observationStart.getFullYear(),
      observationStart.getMonth() + 1,
      0,
    ).getDate()
    observationStart.setDate(Math.min(dayOfMonth, lastDayOfPreviousMonth))
  }

  // Apply every requested filter before sorting or slicing the result.
  const matchingReports = reports.filter((report) => {
    const location = locations.find((item) =>
      item.locationId === report.entranceId || item.locationId === report.floorId,
    )

    const searchableText = [
      report.category,
      report.description,
      report.title,
      report.status,
      location?.buildingName,
      location?.locationName,
      location?.location,
    ].filter(Boolean).join(' ').toLowerCase()

    return (
      (!status || status === 'All' || report.status === status) &&
      (!category || category === 'All' || report.category === category) &&
      (!selectedBuilding || report.buildingId === selectedBuilding) &&
      (!searchText || searchableText.includes(searchText)) &&
      (!observationStart || new Date(report.observedAt) >= observationStart)
    )
  })

  // Keep these names aligned with the Browse page's existing sort choices.
  const sortDirections = {
    'updated-newest': ['updatedAt', 'desc'],
    'updated-oldest': ['updatedAt', 'asc'],
    'observed-newest': ['observedAt', 'desc'],
    'observed-oldest': ['observedAt', 'asc'],
  }
  const [sortField, sortDirection] =
    sortDirections[sort] || sortDirections['updated-newest']

  matchingReports.sort((first, second) => {
    const difference = new Date(second[sortField]) - new Date(first[sortField])
    return sortDirection === 'desc' ? difference : -difference
  })

  // Return only the requested page along with enough metadata for pagination.
  const total = matchingReports.length
  const totalPages = Math.ceil(total / parsedPageSize)
  const start = (parsedPage - 1) * parsedPageSize
  const pageReports = matchingReports.slice(start, start + parsedPageSize)
  const categories = [...new Set(reports.map((report) => report.category))].sort()

  response.json({
    reports: pageReports,
    categories,
    pagination: {
      page: parsedPage,
      pageSize: parsedPageSize,
      total,
      totalPages,
    },
  })
}

router.get('/', sendBrowseResults)

export default router
