const path = require('path')
const fs = require('fs')

const scoresPath = path.resolve(__dirname, '..', 'api', 'scores.json')

if (!fs.existsSync(scoresPath)) {
  fs.writeFileSync(scoresPath, '{}')
}
