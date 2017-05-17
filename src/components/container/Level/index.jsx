import styles from './styles'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  ActionCreators as InteractionActionCreators
} from 'domains/interaction'
import {
  ActionCreators as LevelActionCreators,
  Selectors as LevelSelectors,
  Constants as LevelConstants
} from 'domains/level'
import { Selectors as ScoresSelectors } from 'domains/scores'
import {
  ActionCreators as NavigationActionCreators,
  Selectors as NavigationSelectors
} from 'domains/navigation'
import { GameModal } from 'components/container'
import { Container, Message } from 'components/presentational'
import LevelRow from './LevelRow'
import classNames from 'classnames'
import { ROUTES } from 'routes/paths'

const mapStateToProps = state => ({
  id: LevelSelectors.levelId(state),
  tiles: LevelSelectors.tiles(state),
  playerMoves: LevelSelectors.playerMoves(state),
  boxMoves: LevelSelectors.boxMoves(state),
  bestPlayerMoves: ScoresSelectors.bestPlayerMovesForLevel(
    state,
    LevelSelectors.levelId(state)
  ),
  bestBoxMoves: ScoresSelectors.bestBoxMovesForLevel(
    state,
    LevelSelectors.levelId(state)
  ),
  win: LevelSelectors.winCondition(state),
  scale: NavigationSelectors.currentViewState(state).get('scale') === false
    ? false
    : true
})
const mapDispatchToProps = {
  bindKeys: InteractionActionCreators.bindKeys,
  unbindKeys: InteractionActionCreators.unbindKeys,
  up: LevelActionCreators.goUp,
  down: LevelActionCreators.goDown,
  left: LevelActionCreators.goLeft,
  right: LevelActionCreators.goRight,
  undo: LevelActionCreators.undo,
  restart: LevelActionCreators.restart,
  navigateTo: NavigationActionCreators.navigateTo,
  navigateBack: NavigationActionCreators.navigateBack,
  updateViewState: NavigationActionCreators.updateViewState
}

class Level extends Component {
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
    const playerMovesIndicator = `Player moves / best: ${playerMoves} / ${bestPlayerMoves || '-'}`
    const boxMovesIndicator = `Box moves / best: ${boxMoves} / ${bestBoxMoves || '-'}`
    const numberOfRows = tiles.size
    const children = []
    for (let i = 0; i < numberOfRows; i++) {
      children.push(<LevelRow key={i} rowIndex={i} />)
    }

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

Level.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(Level)
