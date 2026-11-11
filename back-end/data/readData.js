import fs from 'fs'

// Reads one of the mock data files in this folder, like 'buildings.json',
// and turns it into JavaScript objects and lists.
// Run the back end from the back-end folder so the path below is found.
function readData(fileName) {
  const text = fs.readFileSync('data/' + fileName, 'utf-8')

  return JSON.parse(text)
}

export default readData
