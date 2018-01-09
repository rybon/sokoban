const reduceToObject = (accumulator, { id, playerMoves, boxMoves }) => {
  const accumulatorReference = accumulator
  accumulatorReference[id] = { playerMoves, boxMoves }
  return accumulatorReference
}

export const formatIncomingScores = ({ data: { scores, setScores } }) => {
  const actualScores = scores || setScores
  return actualScores.reduce(reduceToObject, {})
}

export const formatOutgoingScores = scores => {
  const outgoingScores = []
  Object.keys(scores).forEach(id => {
    const { playerMoves, boxMoves } = scores[id]
    outgoingScores.push({
      id,
      playerMoves,
      boxMoves
    })
  })
  return outgoingScores
}
