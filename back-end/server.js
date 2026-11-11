// Reads the settings in the .env file, like PORT, if there is one
import 'dotenv/config'
import app from './app.js'

// The port comes from the .env file, or 3000 if there is no .env file
const port = process.env.PORT || 3000

// Starts the back end and prints where it is running
app.listen(port, function () {
  console.log('CurbCut back end is running at http://localhost:' + port)
})
