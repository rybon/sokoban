const { makeExecutableSchema } = require('graphql-tools')
const { levels, getScores, setScores } = require('./data')

const levelResolver = id => ({ rows: levels[`${id}`], id })
const scoreResolver = async id => {
  const scores = await getScores()
  return { ...scores[`${id}`], id }
}
const scoresResolver = async () => {
  const scores = await getScores()
  return Object.values(scores).map((score, index) => ({
    ...score,
    id: index + 1
  }))
}

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
      async setScore(obj, args) {
        const scores = await getScores()
        if (args.input.id > 0 && args.input.id <= 100) {
          if (args.input.playerMoves === null && args.input.boxMoves === null) {
            scores[`${args.input.id}`] = {}
          } else {
            scores[`${args.input.id}`].playerMoves = args.input.playerMoves
            scores[`${args.input.id}`].boxMoves = args.input.boxMoves
          }
          await setScores(scores)
        }
        return scoreResolver(args.input.id)
      },
      async setScores(obj, args) {
        const scores = await getScores()
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
        await setScores(scores)
        return scoresResolver()
      }
    },
    Level: {
      id(obj) {
        return obj.id
      },
      rows(obj) {
        return obj.rows
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
