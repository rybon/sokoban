import styles from './styles'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindKeys, unbindKeys } from 'domains/interaction/actionCreators'
import { updateViewState, navigateTo } from 'domains/navigation/actionCreators'
import { currentViewState } from 'domains/navigation/selectors'
import { resume, jumpToLevel, randomLevel } from 'domains/level/actionCreators'
import * as LevelConstants from 'domains/level/constants'
import { Container, Button } from 'components/presentational'
import { ROUTES } from 'routes/paths'

const mapStateToProps = state => {
  const level = currentViewState(state).get('level') || 1

  return {
    options: [
      { type: 'PLAY', label: 'Play' },
      { type: 'JUMP_TO_LEVEL', label: `Jump to level ${level}` },
      { type: 'RANDOM_LEVEL', label: 'Jump to random level' },
      { type: 'HIGH_SCORES', label: 'High scores' },
      { type: 'HELP', label: 'Help' }
    ],
    selectedItemIndex: currentViewState(state).get('selectedItemIndex') || 0,
    level: level
  }
}

const mapDispatchToProps = {
  bindKeys,
  unbindKeys,
  updateViewState,
  navigateTo,
  resume,
  jumpToLevel,
  randomLevel
}

class MainMenu extends Component {
  static propTypes = {
    options: PropTypes.array.isRequired,
    selectedItemIndex: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
    bindKeys: PropTypes.func.isRequired,
    unbindKeys: PropTypes.func.isRequired,
    updateViewState: PropTypes.func.isRequired,
    navigateTo: PropTypes.func.isRequired,
    resume: PropTypes.func.isRequired,
    jumpToLevel: PropTypes.func.isRequired,
    randomLevel: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.keyMap = {
      ArrowUp: () => {
        const { selectedItemIndex, updateViewState } = this.props

        if (selectedItemIndex > 0) {
          updateViewState({ selectedItemIndex: selectedItemIndex - 1 })
        }
      },
      ArrowDown: () => {
        const { options, selectedItemIndex, updateViewState } = this.props

        if (selectedItemIndex + 1 < options.length) {
          updateViewState({ selectedItemIndex: selectedItemIndex + 1 })
        }
      },
      ArrowLeft: () => {
        const {
          options,
          selectedItemIndex,
          updateViewState,
          level
        } = this.props

        if (options[selectedItemIndex].type === 'JUMP_TO_LEVEL' && level > 1) {
          updateViewState({ level: level - 1 })
        }
      },
      ArrowRight: () => {
        const {
          options,
          selectedItemIndex,
          updateViewState,
          level
        } = this.props

        if (
          options[selectedItemIndex].type === 'JUMP_TO_LEVEL' &&
          level < LevelConstants.NUMBER_OF_LEVELS
        ) {
          updateViewState({ level: level + 1 })
        }
      },
      Space: () => {
        const {
          options,
          selectedItemIndex,
          updateViewState,
          level,
          navigateTo,
          resume,
          jumpToLevel,
          randomLevel
        } = this.props

        if (options[selectedItemIndex].type === 'PLAY') {
          resume()
        } else if (options[selectedItemIndex].type === 'JUMP_TO_LEVEL') {
          jumpToLevel(level)
        } else if (options[selectedItemIndex].type === 'RANDOM_LEVEL') {
          randomLevel()
        } else if (options[selectedItemIndex].type === 'HIGH_SCORES') {
          navigateTo(ROUTES.HIGH_SCORES)
        } else if (options[selectedItemIndex].type === 'HELP') {
          navigateTo(ROUTES.HELP)
        }
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
    const { options, selectedItemIndex } = this.props
    const children = []
    options.forEach((option, index) => {
      children.push(
        <Button
          key={index}
          selected={selectedItemIndex === index}
          className={styles.button}
        >
          {option.label}
        </Button>
      )
    })

    return <Container className={styles.list}>{children}</Container>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu)
