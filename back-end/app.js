import express from 'express'

// Each teammate's routes are in their own file in the routes folder
import locationsRouter from './routes/locations.js'
import searchRouter from './routes/search.js'
import reportsRouter from './routes/reports.js'
import buildingsRouter from './routes/buildings.js'
import reportDetailsRouter from './routes/reportDetails.js'
import browseRouter from './routes/browse.js'
import aboutRouter from './routes/about.js'

// The CurbCut back end. server.js starts it, and the tests use it directly.
const app = express()

// Lets our routes read JSON that the front end sends, like a new report
app.use(express.json())

// Files in the public folder, like uploaded photos, are sent as they are
app.use(express.static('public'))

// A quick check that the back end is running
app.get('/api', function (request, response) {
  response.json({ message: 'CurbCut back end is running' })
})

// Gillani
app.use('/api/locations', locationsRouter)
app.use('/api/search', searchRouter)

// Abdullah
app.use('/api/reports', reportsRouter)

// Hoang
app.use('/api/buildings', buildingsRouter)
app.use('/api/reports', reportDetailsRouter)

// Huzaifa
app.use('/api/browse', browseRouter)
app.use('/api/about', aboutRouter)

// Any other /api address does not exist
app.use('/api', function (request, response) {
  response.status(404).json({ error: 'This address does not exist.' })
})

// If something goes wrong in a route, answer with a short message instead of
// a long error page. Express knows this is the error handler because it takes
// four things: the error, the request, the response and next.
function handleError(error, request, response, next) {
  // Some errors come with their own number, like 400 for unreadable data.
  // Anything else is our fault, so it is 500.
  let status = 500

  if (error.status) {
    status = error.status
  }

  // Print our own mistakes in the terminal, so we can fix them
  if (status === 500) {
    console.error(error)
  }

  response.status(status).json({ error: 'Something went wrong.' })
}

app.use(handleError)

export default app
