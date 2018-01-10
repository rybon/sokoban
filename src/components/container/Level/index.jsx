// @flow

import React, { Component } from 'react'
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
import { navigateTo, navigateBack } from 'domains/navigation/actionCreators'
import {
  createOrUpdateLocalState,
  deleteLocalState
} from 'domains/local/actionCreators'
import { localState } from 'domains/local/selectors'
import { GameModal } from 'components/container'
import { Container, Message } from 'components/presentational'
import classNames from 'classnames'
import { ROUTES } from 'routes/paths'
import LevelRow from './LevelRow'

import styles from './styles.css'

const localKey = 'level'

const identifier = keys => keys.join(':')

const mapStateToProps = state => ({
  id: levelId(state),
  tiles: tiles(state),
  playerMoves: playerMoves(state),
  boxMoves: boxMoves(state),
  bestPlayerMoves: bestPlayerMovesForLevel(state, levelId(state)),
  bestBoxMoves: bestBoxMovesForLevel(state, levelId(state)),
  win: winCondition(state),
  scale:
    localState(state, identifier([localKey, levelId(state)])).get('scale') !==
    false
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
  createOrUpdateLocalState,
  deleteLocalState
}

type Props = {
  id: string,
  tiles: Object,
  playerMoves: number,
  boxMoves: number,
  bestPlayerMoves: ?number,
  bestBoxMoves: ?number,
  win: boolean,
  scale: boolean,
  bindKeys(keyMap: Object): void,
  unbindKeys(keyMap: Object): void,
  up(): void,
  down(): void,
  left(): void,
  right(): void,
  undo(): void,
  restart(): void,
  navigateTo(pathname: string): void,
  navigateBack(): void,
  createOrUpdateLocalState(localKey: string, localState: Object): void,
  deleteLocalState(localKey: string): void
}

class Level extends Component<Props> {
  static defaultProps = {
    bestPlayerMoves: null,
    bestBoxMoves: null
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
        if (this.props.id) {
          this.props.createOrUpdateLocalState(
            identifier([localKey, this.props.id]),
            {
              scale: true
            }
          )
        }
      },
      Minus: () => {
        if (this.props.id) {
          this.props.createOrUpdateLocalState(
            identifier([localKey, this.props.id]),
            {
              scale: false
            }
          )
        }
      }
    }
  }

  componentDidMount() {
    if (this.keyMap) {
      this.props.bindKeys(this.keyMap)
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.id && nextProps.id && this.props.id !== nextProps.id) {
      this.props.deleteLocalState(identifier([localKey, this.props.id]))
    }
  }

  componentWillUnmount() {
    if (this.keyMap) {
      this.props.unbindKeys(this.keyMap)
    }
    this.keyMap = null
    if (this.props.id) {
      this.props.deleteLocalState(identifier([localKey, this.props.id]))
    }
  }

  keyMap: Object | null

  render() {
    const levelIndicator = `Level ${this.props.id} / ${
      LevelConstants.NUMBER_OF_LEVELS
    }`
    const playerMovesIndicator = `Player moves / best: ${
      this.props.playerMoves
    } / ${this.props.bestPlayerMoves || '-'}`
    const boxMovesIndicator = `Box moves / best: ${this.props.boxMoves} / ${this
      .props.bestBoxMoves || '-'}`
    const numberOfRows = this.props.tiles.size
    const children = []
    Array(numberOfRows)
      .fill()
      .forEach((_, index) => {
        children.push(<LevelRow key={index} rowIndex={index} />) // eslint-disable-line react/no-array-index-key
      })

    return (
      <Container className={styles.wrapper}>
        <Message className={styles.topLeft}>
          {this.props.id && levelIndicator}
        </Message>
        <Message className={styles.bottomLeft}>
          {this.props.id && playerMovesIndicator}
        </Message>
        <Message className={styles.bottomRight}>
          {this.props.id && boxMovesIndicator}
        </Message>
        {this.props.win && <GameModal key={numberOfRows} />}
        <Container
          className={classNames(styles.level, this.props.scale && styles.scale)}
        >
          {children}
        </Container>
      </Container>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Level)
