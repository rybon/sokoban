const fs = require('fs')
const path = require('path')

const levelsPath = path.resolve(__dirname, '..', '..', 'api', 'levels.json')
const scoresPath = path.resolve(__dirname, '..', '..', 'api', 'scores.json')

const levels = JSON.parse(fs.readFileSync(levelsPath))
const getScores = () => JSON.parse(fs.readFileSync(scoresPath))

module.exports = {
  levels,
  getScores
}
