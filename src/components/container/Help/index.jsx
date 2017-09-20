import styles from './styles'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ActionCreators as InteractionActionCreators } from 'domains/interaction'
import { ActionCreators as NavigationActionCreators } from 'domains/navigation'
import { Container, Message, Tile } from 'components/presentational'

const mapDispatchToProps = {
  bindKeys: InteractionActionCreators.bindKeys,
  unbindKeys: InteractionActionCreators.unbindKeys,
  navigateBack: NavigationActionCreators.navigateBack
}

class Help extends Component {
  constructor(props) {
    super(props)
    this.keyMap = {
      KeyB: () => {
        this.props.navigateBack()
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
              <Tile type={'wall'} />
              <Tile type={'wall'} />
              <Tile type={'wall'} />
              <Tile type={'wall'} />
              <Tile type={'wall'} />
            </Container>
            <Container className={styles.row}>
              <Tile type={'wall'} />
              <Tile type={'playerDown'} />
              <Tile type={'box'} />
              <Tile type={'destination'} />
              <Tile type={'wall'} />
            </Container>
            <Container className={styles.row}>
              <Tile type={'wall'} />
              <Tile type={'floor'} />
              <Tile type={'box'} />
              <Tile type={'destination'} />
              <Tile type={'wall'} />
            </Container>
            <Container className={styles.row}>
              <Tile type={'wall'} />
              <Tile type={'wall'} />
              <Tile type={'wall'} />
              <Tile type={'wall'} />
              <Tile type={'wall'} />
            </Container>
          </Container>
          <Container className={styles.spacer}>
            <Message className={styles.arrow}>{rightArrow}</Message>
          </Container>
          <Container className={styles.level}>
            <Container className={styles.row}>
              <Tile type={'wall'} />
              <Tile type={'wall'} />
              <Tile type={'wall'} />
              <Tile type={'wall'} />
              <Tile type={'wall'} />
            </Container>
            <Container className={styles.row}>
              <Tile type={'wall'} />
              <Tile type={'floor'} />
              <Tile type={'floor'} />
              <Tile type={'boxOnDestination'} />
              <Tile type={'wall'} />
            </Container>
            <Container className={styles.row}>
              <Tile type={'wall'} />
              <Tile type={'floor'} />
              <Tile type={'playerRight'} />
              <Tile type={'boxOnDestination'} />
              <Tile type={'wall'} />
            </Container>
            <Container className={styles.row}>
              <Tile type={'wall'} />
              <Tile type={'wall'} />
              <Tile type={'wall'} />
              <Tile type={'wall'} />
              <Tile type={'wall'} />
            </Container>
          </Container>
        </Container>
        <Message className={styles.message}>{theRules}</Message>
        <Container className={styles.rules}>
          <Container className={styles.row}>
            <Message className={styles.checkMark}>{checkMark}</Message>
            <Tile type={'playerRight'} />
            <Tile type={'box'} />
            <Tile type={'floor'} />
            <Message className={styles.rightArrow}>{rightArrow}</Message>
          </Container>
          <Container className={styles.row}>
            <Message className={styles.crossMark}>{crossMark}</Message>
            <Tile type={'playerLeft'} />
            <Tile type={'box'} />
            <Tile type={'floor'} />
            <Message className={styles.leftArrow}>{leftArrow}</Message>
          </Container>
          <Container className={styles.row}>
            <Message className={styles.crossMark}>{crossMark}</Message>
            <Tile type={'playerDown'} />
            <Tile type={'box'} />
            <Tile type={'box'} />
            <Tile type={'floor'} />
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

Help.propTypes = {
  bindKeys: PropTypes.func.isRequired,
  unbindKeys: PropTypes.func.isRequired,
  navigateBack: PropTypes.func.isRequired
}

export default connect(null, mapDispatchToProps)(Help)
