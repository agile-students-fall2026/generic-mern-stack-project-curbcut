import express from 'express'

// Gillani's routes: GET /api/recent-searches and POST /api/recent-searches
const router = express.Router()

// The searches people made, newest first.
// They are only kept while the back end is running, so they are cleared
// when it restarts. In Sprint 3 they will be saved in the database.
let recentSearches = []

// Sends the list of recent searches
function sendRecentSearches(request, response) {
  response.json(recentSearches)
}

// Adds a search to the top of the list and sends back the new list
function addRecentSearch(request, response) {
  // The search the front end sent, like { "search": "ramp" }
  let search = ''

  if (request.body && request.body.search) {
    search = request.body.search.trim()
  }

  // An empty search is not saved
  if (search === '') {
    response.status(400).json({ error: 'Please send a search.' })
    return
  }

  // Put the new search first, then the older ones without repeating it.
  // Keep only the 5 newest searches.
  const updatedSearches = [search]

  for (const oldSearch of recentSearches) {
    if (oldSearch !== search && updatedSearches.length < 5) {
      updatedSearches.push(oldSearch)
    }
  }

  recentSearches = updatedSearches

  response.status(201).json(recentSearches)
}

// When someone asks for /api/recent-searches, run sendRecentSearches
router.get('/', sendRecentSearches)

// When someone sends a search to /api/recent-searches, run addRecentSearch
router.post('/', addRecentSearch)

export default router
