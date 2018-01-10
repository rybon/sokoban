// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindKeys, unbindKeys } from 'domains/interaction/actionCreators'
import { navigateBack } from 'domains/navigation/actionCreators'
import { Container, Message, Tile } from 'components/presentational'

import styles from './styles.css'

const mapDispatchToProps = {
  bindKeys,
  unbindKeys,
  navigateBack
}

type Props = {
  bindKeys(keyMap: Object): void,
  unbindKeys(keyMap: Object): void,
  navigateBack(): void
}

class Help extends Component<Props> {
  constructor(props) {
    super(props)

    this.keyMap = {
      KeyB: () => {
        this.props.navigateBack()
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
    const toWin =
      'To win, navigate the player with UP, DOWN, LEFT, RIGHT and move the boxes:'
    const leftArrow = '\u21E6'
    const rightArrow = '\u21E8'
    const theRules = 'The Rules:'
    const checkMark = '\u2713'
    const crossMark = '\u274C'
    const undo = 'Press Z to undo a single box move.'
    const restart = 'Press R to restart the level.'
    const scale = 'Press + or - to zoom in or out.'

    return (
      <Container>
        <Message className={styles.message}>{toWin}</Message>
        <Container className={styles.example}>
          <Container className={styles.level}>
            <Container className={styles.row}>
              <Tile type="wall" />
              <Tile type="wall" />
              <Tile type="wall" />
              <Tile type="wall" />
              <Tile type="wall" />
            </Container>
            <Container className={styles.row}>
              <Tile type="wall" />
              <Tile type="playerDown" />
              <Tile type="box" />
              <Tile type="destination" />
              <Tile type="wall" />
            </Container>
            <Container className={styles.row}>
              <Tile type="wall" />
              <Tile type="floor" />
              <Tile type="box" />
              <Tile type="destination" />
              <Tile type="wall" />
            </Container>
            <Container className={styles.row}>
              <Tile type="wall" />
              <Tile type="wall" />
              <Tile type="wall" />
              <Tile type="wall" />
              <Tile type="wall" />
            </Container>
          </Container>
          <Container className={styles.spacer}>
            <Message className={styles.arrow}>{rightArrow}</Message>
          </Container>
          <Container className={styles.level}>
            <Container className={styles.row}>
              <Tile type="wall" />
              <Tile type="wall" />
              <Tile type="wall" />
              <Tile type="wall" />
              <Tile type="wall" />
            </Container>
            <Container className={styles.row}>
              <Tile type="wall" />
              <Tile type="floor" />
              <Tile type="floor" />
              <Tile type="boxOnDestination" />
              <Tile type="wall" />
            </Container>
            <Container className={styles.row}>
              <Tile type="wall" />
              <Tile type="floor" />
              <Tile type="playerRight" />
              <Tile type="boxOnDestination" />
              <Tile type="wall" />
            </Container>
            <Container className={styles.row}>
              <Tile type="wall" />
              <Tile type="wall" />
              <Tile type="wall" />
              <Tile type="wall" />
              <Tile type="wall" />
            </Container>
          </Container>
        </Container>
        <Message className={styles.message}>{theRules}</Message>
        <Container className={styles.rules}>
          <Container className={styles.row}>
            <Message className={styles.checkMark}>{checkMark}</Message>
            <Tile type="playerRight" />
            <Tile type="box" />
            <Tile type="floor" />
            <Message className={styles.rightArrow}>{rightArrow}</Message>
          </Container>
          <Container className={styles.row}>
            <Message className={styles.crossMark}>{crossMark}</Message>
            <Tile type="playerLeft" />
            <Tile type="box" />
            <Tile type="floor" />
            <Message className={styles.leftArrow}>{leftArrow}</Message>
          </Container>
          <Container className={styles.row}>
            <Message className={styles.crossMark}>{crossMark}</Message>
            <Tile type="playerDown" />
            <Tile type="box" />
            <Tile type="box" />
            <Tile type="floor" />
            <Message className={styles.rightArrow2}>{rightArrow}</Message>
            <Message className={styles.rightArrow3}>{rightArrow}</Message>
          </Container>
        </Container>
        <Message className={styles.message}>{undo}</Message>
        <Message className={styles.message}>{restart}</Message>
        <Message className={styles.message}>{scale}</Message>
      </Container>
    )
  }
}

export default connect(null, mapDispatchToProps)(Help)
