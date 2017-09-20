import styles from './styles'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ActionCreators as InteractionActionCreators } from 'domains/interaction'
import {
  ActionCreators as NavigationActionCreators,
  Selectors as NavigationSelectors
} from 'domains/navigation'
import {
  ActionCreators as LevelActionCreators,
  Constants as LevelConstants
} from 'domains/level'
import { Container, Button } from 'components/presentational'
import { ROUTES } from 'routes/paths'

const mapStateToProps = state => {
  const level = NavigationSelectors.currentViewState(state).get('level') || 1

  return {
    options: [
      { type: 'PLAY', label: 'Play' },
      { type: 'JUMP_TO_LEVEL', label: `Jump to level ${level}` },
      { type: 'RANDOM_LEVEL', label: 'Jump to random level' },
      { type: 'HIGH_SCORES', label: 'High scores' },
      { type: 'HELP', label: 'Help' }
    ],
    selectedItemIndex:
      NavigationSelectors.currentViewState(state).get('selectedItemIndex') || 0,
    level: level
  }
}
const mapDispatchToProps = {
  bindKeys: InteractionActionCreators.bindKeys,
  unbindKeys: InteractionActionCreators.unbindKeys,
  updateViewState: NavigationActionCreators.updateViewState,
  navigateTo: NavigationActionCreators.navigateTo,
  resume: LevelActionCreators.resume,
  jumpToLevel: LevelActionCreators.jumpToLevel,
  randomLevel: LevelActionCreators.randomLevel
}

class MainMenu extends Component {
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

MainMenu.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(MainMenu)
