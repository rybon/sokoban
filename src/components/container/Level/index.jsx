import styles from './styles'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindKeys, unbindKeys } from 'domains/interaction/actionCreators'
import {
  goUp as up,
  goDown as down,
  goLeft as left,
  goRight as right,
  undo,
  restart
} from 'domains/level/actionCreators'
import {
  levelId,
  tiles,
  playerMoves,
  boxMoves,
  winCondition
} from 'domains/level/selectors'
import * as LevelConstants from 'domains/level/constants'
import {
  bestPlayerMovesForLevel,
  bestBoxMovesForLevel
} from 'domains/scores/selectors'
import {
  navigateTo,
  navigateBack,
  updateViewState
} from 'domains/navigation/actionCreators'
import { currentViewState } from 'domains/navigation/selectors'
import { GameModal } from 'components/container'
import { Container, Message } from 'components/presentational'
import LevelRow from './LevelRow'
import classNames from 'classnames'
import { ROUTES } from 'routes/paths'

const mapStateToProps = state => ({
  id: levelId(state),
  tiles: tiles(state),
  playerMoves: playerMoves(state),
  boxMoves: boxMoves(state),
  bestPlayerMoves: bestPlayerMovesForLevel(state, levelId(state)),
  bestBoxMoves: bestBoxMovesForLevel(state, levelId(state)),
  win: winCondition(state),
  scale: currentViewState(state).get('scale') === false ? false : true
})

const mapDispatchToProps = {
  bindKeys,
  unbindKeys,
  up,
  down,
  left,
  right,
  undo,
  restart,
  navigateTo,
  navigateBack,
  updateViewState
}

class Level extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    tiles: PropTypes.object,
    playerMoves: PropTypes.number.isRequired,
    boxMoves: PropTypes.number.isRequired,
    bestPlayerMoves: PropTypes.number,
    bestBoxMoves: PropTypes.number,
    win: PropTypes.bool.isRequired,
    scale: PropTypes.bool.isRequired,
    bindKeys: PropTypes.func.isRequired,
    unbindKeys: PropTypes.func.isRequired,
    up: PropTypes.func.isRequired,
    down: PropTypes.func.isRequired,
    left: PropTypes.func.isRequired,
    right: PropTypes.func.isRequired,
    undo: PropTypes.func.isRequired,
    restart: PropTypes.func.isRequired,
    navigateTo: PropTypes.func.isRequired,
    navigateBack: PropTypes.func.isRequired,
    updateViewState: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.keyMap = {
      ArrowUp: () => {
        this.props.up()
      },
      ArrowDown: () => {
        this.props.down()
      },
      ArrowLeft: () => {
        this.props.left()
      },
      ArrowRight: () => {
        this.props.right()
      },
      KeyZ: () => {
        this.props.undo()
      },
      KeyR: () => {
        this.props.restart()
      },
      KeyM: () => {
        this.props.navigateTo(ROUTES.ROOT)
      },
      KeyB: () => {
        this.props.navigateBack()
      },
      Equal: () => {
        this.props.updateViewState({
          scale: true
        })
      },
      Minus: () => {
        this.props.updateViewState({
          scale: false
        })
      }
    }
  }

  componentWillMount() {
    this.props.bindKeys(this.keyMap)
  }

  componentWillUnmount() {
    this.props.unbindKeys(this.keyMap)
    this.keyMap = null
  }

  render() {
    const {
      id,
      tiles,
      playerMoves,
      boxMoves,
      bestPlayerMoves,
      bestBoxMoves,
      win,
      scale
    } = this.props
    const levelIndicator = `Level ${id} / ${LevelConstants.NUMBER_OF_LEVELS}`
    const playerMovesIndicator = `Player moves / best: ${playerMoves} / ${bestPlayerMoves ||
      '-'}`
    const boxMovesIndicator = `Box moves / best: ${boxMoves} / ${bestBoxMoves ||
      '-'}`
    const numberOfRows = tiles.size
    const children = []
    Array(numberOfRows)
      .fill()
      .forEach((_, index) => {
        children.push(<LevelRow key={index} rowIndex={index} />)
      })

    return (
      <Container className={styles.wrapper}>
        <Message className={styles.topLeft}>{id && levelIndicator}</Message>
        <Message className={styles.bottomLeft}>{playerMovesIndicator}</Message>
        <Message className={styles.bottomRight}>{boxMovesIndicator}</Message>
        {win && <GameModal key={numberOfRows} />}
        <Container className={classNames(styles.level, scale && styles.scale)}>
          {children}
        </Container>
      </Container>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Level)
