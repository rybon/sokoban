// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindKeys, unbindKeys } from 'domains/interaction/actionCreators'
import { updateViewState, navigateTo } from 'domains/navigation/actionCreators'
import { currentViewState } from 'domains/navigation/selectors'
import { resume, jumpToLevel, randomLevel } from 'domains/level/actionCreators'
import * as LevelConstants from 'domains/level/constants'
import { Container, Button } from 'components/presentational'
import { ROUTES } from 'routes/paths'

import styles from './styles.css'

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
    level
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

type Props = {
  options: Array<Object>,
  selectedItemIndex: number,
  level: number,
  bindKeys: (keyMap: Object) => mixed,
  unbindKeys: (keyMap: Object) => mixed,
  updateViewState: (newViewState: Object) => mixed,
  navigateTo: (pathname: string) => mixed,
  resume: () => mixed,
  jumpToLevel: (id: string) => mixed,
  randomLevel: () => mixed
}

class MainMenu extends Component<Props> {
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
        if (this.props.selectedItemIndex + 1 < this.props.options.length) {
          this.props.updateViewState({
            selectedItemIndex: this.props.selectedItemIndex + 1
          })
        }
      },
      ArrowLeft: () => {
        if (
          this.props.options[this.props.selectedItemIndex].type ===
            'JUMP_TO_LEVEL' &&
          this.props.level > 1
        ) {
          this.props.updateViewState({ level: this.props.level - 1 })
        }
      },
      ArrowRight: () => {
        if (
          this.props.options[this.props.selectedItemIndex].type ===
            'JUMP_TO_LEVEL' &&
          this.props.level < LevelConstants.NUMBER_OF_LEVELS
        ) {
          this.props.updateViewState({ level: this.props.level + 1 })
        }
      },
      Space: () => {
        if (this.props.options[this.props.selectedItemIndex].type === 'PLAY') {
          this.props.resume()
        } else if (
          this.props.options[this.props.selectedItemIndex].type ===
          'JUMP_TO_LEVEL'
        ) {
          this.props.jumpToLevel(`${this.props.level}`)
        } else if (
          this.props.options[this.props.selectedItemIndex].type ===
          'RANDOM_LEVEL'
        ) {
          this.props.randomLevel()
        } else if (
          this.props.options[this.props.selectedItemIndex].type ===
          'HIGH_SCORES'
        ) {
          this.props.navigateTo(ROUTES.HIGH_SCORES)
        } else if (
          this.props.options[this.props.selectedItemIndex].type === 'HELP'
        ) {
          this.props.navigateTo(ROUTES.HELP)
        }
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
    const children = []
    this.props.options.forEach((option, index) => {
      children.push(
        <Button
          key={option.type}
          selected={this.props.selectedItemIndex === index}
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
