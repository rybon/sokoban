const fs = require('fs')
const path = require('path')
const { makeExecutableSchema } = require('graphql-tools')
const { levels, getScores } = require('./data')
const { INDENTATION } = require('./constants')

const levelResolver = id => ({ rows: levels[`${id}`], id })
const scoreResolver = id => ({ ...getScores()[`${id}`], id })
const scoresResolver = () =>
  Object.values(getScores()).map((score, index) => ({
    ...score,
    id: index + 1
  }))

const graphqlSchema = makeExecutableSchema({
  typeDefs: [
    `
    type Level {
      id: ID!
      rows: [String!]!
    }
    type Score {
      id: ID!
      playerMoves: Int
      boxMoves: Int
    }
    type Query {
      level(id: ID!): Level!
      score(id: ID!): Score!
      scores: [Score!]!
    }
    input ScoreInput {
      id: ID!
      playerMoves: Int
      boxMoves: Int
    }
    input ScoresInput {
      scores: [ScoreInput!]!
    }
    type Mutation {
      setScore(input: ScoreInput!): Score!
      setScores(input: ScoresInput!): [Score!]!
    }
    schema {
      query: Query
      mutation: Mutation
    }
  `
  ],
  resolvers: {
    Query: {
      level(obj, args) {
        return levelResolver(args.id)
      },
      score(obj, args) {
        return scoreResolver(args.id)
      },
      scores() {
        return scoresResolver()
      }
    },
    Mutation: {
      setScore(obj, args) {
        const scores = getScores()
        if (args.input.id > 0 && args.input.id <= 100) {
          if (args.input.playerMoves === null && args.input.boxMoves === null) {
            scores[`${args.input.id}`] = {}
          } else {
            scores[`${args.input.id}`].playerMoves = args.input.playerMoves
            scores[`${args.input.id}`].boxMoves = args.input.boxMoves
          }
          fs.writeFileSync(
            path.resolve(__dirname, '..', '..', 'api', 'scores.json'),
            JSON.stringify(scores, null, INDENTATION)
          )
        }
        return scoreResolver(args.input.id)
      },
      setScores(obj, args) {
        const scores = getScores()
        args.input.scores.forEach(score => {
          if (score.id > 0 && score.id <= 100) {
            if (score.playerMoves === null && score.boxMoves === null) {
              scores[`${score.id}`] = {}
            } else {
              scores[`${score.id}`].playerMoves = score.playerMoves
              scores[`${score.id}`].boxMoves = score.boxMoves
            }
          }
        })
        fs.writeFileSync(
          path.resolve(__dirname, '..', '..', 'api', 'scores.json'),
          JSON.stringify(scores, null, INDENTATION)
        )
        return scoresResolver()
      }
    },
    Level: {
      id(obj) {
        return obj.id
      },
      rows(obj) {
        return new Promise(resolve => {
          setTimeout(() => resolve(obj.rows), 500)
        })
      }
    },
    Score: {
      id(obj) {
        return obj.id
      },
      playerMoves(obj) {
        return obj.playerMoves
      },
      boxMoves(obj) {
        return obj.boxMoves
      }
    }
  }
})

module.exports = {
  graphqlSchema
}
