import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { bindKeys, unbindKeys } from 'domains/interaction/actionCreators'
import {
  navigateBack,
  updateViewState
} from 'domains/navigation/actionCreators'
import { currentViewState } from 'domains/navigation/selectors'
import * as LevelConstants from 'domains/level/constants'
import { removeAllScores, removeScore } from 'domains/scores/actionCreators'
import { levelsScores, backgroundImage } from 'domains/scores/selectors'
import { Container, Message, Button } from 'components/presentational'

import styles from './styles.css'

const mapStateToProps = state => ({
  scores: levelsScores(state),
  backgroundImage: backgroundImage(state),
  selectedItemIndex: currentViewState(state).get('selectedItemIndex') || 0
})

const mapDispatchToProps = {
  bindKeys,
  unbindKeys,
  updateViewState,
  removeAllScores,
  removeScore,
  back: navigateBack
}

class HighScores extends Component {
  static propTypes = {
    scores: PropTypes.shape({ getIn: PropTypes.func }).isRequired,
    backgroundImage: PropTypes.string.isRequired,
    selectedItemIndex: PropTypes.number.isRequired,
    bindKeys: PropTypes.func.isRequired,
    unbindKeys: PropTypes.func.isRequired,
    updateViewState: PropTypes.func.isRequired,
    removeAllScores: PropTypes.func.isRequired,
    removeScore: PropTypes.func.isRequired,
    back: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.keyMap = {
      ArrowUp: () => {
        if (this.props.selectedItemIndex > 0) {
          this.props.updateViewState({
            selectedItemIndex: this.props.selectedItemIndex - 1
          })
        }
      },
      ArrowDown: () => {
        if (
          this.props.selectedItemIndex + 1 <=
          LevelConstants.NUMBER_OF_LEVELS
        ) {
          this.props.updateViewState({
            selectedItemIndex: this.props.selectedItemIndex + 1
          })
        }
      },
      ArrowLeft: () => {
        if (this.props.selectedItemIndex - 10 > 0) {
          this.props.updateViewState({
            selectedItemIndex: this.props.selectedItemIndex - 10
          })
        }
      },
      ArrowRight: () => {
        if (
          this.props.selectedItemIndex + 10 <=
          LevelConstants.NUMBER_OF_LEVELS
        ) {
          this.props.updateViewState({
            selectedItemIndex: this.props.selectedItemIndex + 10
          })
        }
      },
      Space: () => {
        if (this.props.selectedItemIndex === 0) {
          this.props.removeAllScores()
        } else if (
          this.props.selectedItemIndex > 0 &&
          this.props.selectedItemIndex <= LevelConstants.NUMBER_OF_LEVELS
        ) {
          this.props.removeScore(this.props.selectedItemIndex)
        }
      },
      KeyB: () => {
        this.props.back()
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
    const explanation = 'Level: player moves / box moves'
    const removeAllLevels = 'Remove all levels'
    const removeLevel = 'Remove level'
    const lists = []
    let children = []
    Array(LevelConstants.NUMBER_OF_LEVELS)
      .fill()
      .forEach((_, index) => {
        const realIndex = index + 1
        children.push(
          <Message
            key={`m${realIndex}`}
            className={classNames(
              styles.message,
              (this.props.scores.getIn([`${realIndex}`, 'playerMoves']) ||
                this.props.scores.getIn([`${realIndex}`, 'boxMoves'])) &&
                styles.success
            )}
          >{`${realIndex}: ${this.props.scores.getIn([
            `${realIndex}`,
            'playerMoves'
          ]) || '-'} / ${this.props.scores.getIn([
            `${realIndex}`,
            'boxMoves'
          ]) || '-'}`}</Message>
        )
        children.push(
          <Button
            key={`b${realIndex}`}
            selected={this.props.selectedItemIndex === realIndex}
          >
            {removeLevel}
          </Button>
        )
        if (realIndex % 10 === 0) {
          lists.push(
            <Container key={realIndex} className={styles.list}>
              {children}
            </Container>
          )
          children = []
        }
      })

    return (
      <Container>
        <img
          src={this.props.backgroundImage}
          alt=""
          width={600}
          height={400}
          className={styles.backgroundImage}
        />
        <Message>{explanation}</Message>
        <Button selected={this.props.selectedItemIndex === 0}>
          {removeAllLevels}
        </Button>
        {lists}
      </Container>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HighScores)
