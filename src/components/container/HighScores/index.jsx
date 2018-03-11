// @flow

import React, { Component, Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { connect } from 'react-redux'
import classNames from 'classnames'
import { bindKeys, unbindKeys } from 'domains/interaction/actionCreators'
import { navigateBack } from 'domains/navigation/actionCreators'
import { createOrUpdateLocalState } from 'domains/local/actionCreators'
import { localState } from 'domains/local/selectors'
import * as LevelConstants from 'domains/level/constants'
import { removeAllScores, removeScore } from 'domains/scores/actionCreators'
import { levelsScores, backgroundImage } from 'domains/scores/selectors'
import { Container, Message, Button } from 'components/presentational'

import styles from './styles.css'

const localKey = 'highScores'

const mapStateToProps = state => ({
  scores: levelsScores(state),
  backgroundImage: backgroundImage(state),
  selectedItemIndex: localState(state, localKey).get('selectedItemIndex') || 0
})

const mapDispatchToProps = {
  bindKeys,
  unbindKeys,
  createOrUpdateLocalState,
  removeAllScores,
  removeScore,
  back: navigateBack
}

type Props = {
  scores: Object,
  backgroundImage: string,
  selectedItemIndex: number,
  bindKeys(keyMap: Object): void,
  unbindKeys(keyMap: Object): void,
  createOrUpdateLocalState(localKey: string, localState: Object): void,
  removeAllScores(): void,
  removeScore(id: number): void,
  back(): void
}

class HighScores extends Component<Props> {
  constructor(props) {
    super(props)

    this.keyMap = {
      ArrowUp: () => {
        if (this.props.selectedItemIndex > 0) {
          this.props.createOrUpdateLocalState(localKey, {
            selectedItemIndex: this.props.selectedItemIndex - 1
          })
        }
      },
      ArrowDown: () => {
        if (
          this.props.selectedItemIndex + 1 <=
          LevelConstants.NUMBER_OF_LEVELS
        ) {
          this.props.createOrUpdateLocalState(localKey, {
            selectedItemIndex: this.props.selectedItemIndex + 1
          })
        }
      },
      ArrowLeft: () => {
        if (this.props.selectedItemIndex - 10 > 0) {
          this.props.createOrUpdateLocalState(localKey, {
            selectedItemIndex: this.props.selectedItemIndex - 10
          })
        }
      },
      ArrowRight: () => {
        if (
          this.props.selectedItemIndex + 10 <=
          LevelConstants.NUMBER_OF_LEVELS
        ) {
          this.props.createOrUpdateLocalState(localKey, {
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

  componentDidMount() {
    if (this.keyMap) {
      this.props.bindKeys(this.keyMap)
    }
  }

  componentWillUnmount() {
    if (this.keyMap) {
      this.props.unbindKeys(this.keyMap)
    }
    this.keyMap = null
  }

  keyMap: Object | null

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
      <Fragment>
        <Helmet title="High scores" />
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
      </Fragment>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HighScores)
