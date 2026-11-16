import express from 'express'

// Gillani's routes: GET /api/recent-searches and POST /api/recent-searches
const router = express.Router()

// Each browser's recent searches, newest first, kept apart by a visitor id
// that the browser makes up, like 'a1b2c3' -> ['ramp', 'elevator'].
// A Map is a list of pairs: get(id) reads a list and set(id, list) saves one.
// They are only kept while the back end is running, so they are cleared
// when it restarts. In Sprint 3 they will be saved in the database.
const searchesByVisitor = new Map()

// Sends the recent searches of one browser, like
// GET /api/recent-searches?visitorId=a1b2c3
function sendRecentSearches(request, response) {
  const visitorId = request.query.visitorId

  // The visitor id must be text that is not empty
  if (typeof visitorId !== 'string' || visitorId === '') {
    response.status(400).json({ error: 'Send a visitor id.' })
    return
  }

  // A browser that never searched gets an empty list
  let searches = searchesByVisitor.get(visitorId)

  if (!searches) {
    searches = []
  }

  response.json(searches)
}

// Adds a search to the top of one browser's list and sends back the new list.
// The front end sends something like { "visitorId": "a1b2c3", "search": "ramp" }
function addRecentSearch(request, response) {
  let visitorId = ''
  let search = ''

  // Only accept text. A number like 123 or a list would break .trim()
  if (request.body && typeof request.body.visitorId === 'string') {
    visitorId = request.body.visitorId
  }

  if (request.body && typeof request.body.search === 'string') {
    search = request.body.search.trim()
  }

  if (visitorId === '' || search === '') {
    response.status(400).json({ error: 'Send a visitor id and a search.' })
    return
  }

  let oldSearches = searchesByVisitor.get(visitorId)

  if (!oldSearches) {
    oldSearches = []
  }

  // Put the new search first, then the older ones without repeating it.
  // Keep only the 5 newest searches.
  const updatedSearches = [search]

  for (const oldSearch of oldSearches) {
    if (oldSearch !== search && updatedSearches.length < 5) {
      updatedSearches.push(oldSearch)
    }
  }

  searchesByVisitor.set(visitorId, updatedSearches)

  response.status(201).json(updatedSearches)
}

// When someone asks for /api/recent-searches, run sendRecentSearches
router.get('/', sendRecentSearches)

// When someone sends a search to /api/recent-searches, run addRecentSearch
router.post('/', addRecentSearch)

export default router
