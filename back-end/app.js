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

export default app
