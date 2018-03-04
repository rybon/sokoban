const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const redis = require('redis')

let client

if (process.env.REDIS_URL) {
  client = redis.createClient({ url: process.env.REDIS_URL })
} else {
  client = redis.createClient()
}

const getAsync = promisify(client.get).bind(client)
const setAsync = promisify(client.set).bind(client)

const levelsPath = path.resolve(__dirname, '..', '..', 'api', 'levels.json')

const levels = JSON.parse(fs.readFileSync(levelsPath))

const emptyScores = Object.keys(levels)
  .map(level => ({
    id: level,
    playerMoves: null,
    boxMoves: null
  }))
  .reduce((acc, val) => {
    acc[val.id] = val
    return acc
  }, {})

const getScores = () =>
  getAsync('scores').then(scores => (scores ? JSON.parse(scores) : emptyScores))
const setScores = scores => setAsync('scores', JSON.stringify(scores))

module.exports = {
  levels,
  getScores,
  setScores
}
