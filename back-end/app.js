import express from 'express'

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

export default app
