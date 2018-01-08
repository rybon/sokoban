const fs = require('fs')
const path = require('path')

const levels = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '..', '..', 'api', 'levels.json'))
)
const getScores = () =>
  JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '..', '..', 'api', 'scores.json'))
  )

module.exports = {
  levels,
  getScores
}
