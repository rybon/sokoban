// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindKeys, unbindKeys } from 'domains/interaction/actionCreators'
import { navigateTo } from 'domains/navigation/actionCreators'
import { updateLocalState } from 'domains/local/actionCreators'
import { localState } from 'domains/local/selectors'
import { resume, jumpToLevel, randomLevel } from 'domains/level/actionCreators'
import * as LevelConstants from 'domains/level/constants'
import { Container, Button } from 'components/presentational'
import { ROUTES } from 'routes/paths'

import styles from './styles.css'

const localKey = 'mainMenu'

const mapStateToProps = state => {
  const level = localState(state, localKey).get('level') || 1
  return {
    options: [
      { type: 'PLAY', label: 'Play' },
      { type: 'JUMP_TO_LEVEL', label: `Jump to level ${level}` },
      { type: 'RANDOM_LEVEL', label: 'Jump to random level' },
      { type: 'HIGH_SCORES', label: 'High scores' },
      { type: 'HELP', label: 'Help' }
    ],
    selectedItemIndex:
      localState(state, localKey).get('selectedItemIndex') || 0,
    level
  }
}

const mapDispatchToProps = {
  bindKeys,
  unbindKeys,
  updateLocalState,
  navigateTo,
  resume,
  jumpToLevel,
  randomLevel
}

type Props = {
  options: Array<Object>,
  selectedItemIndex: number,
  level: number,
  bindKeys(keyMap: Object): void,
  unbindKeys(keyMap: Object): void,
  updateLocalState(localKey: string, newState: Object): void,
  navigateTo(pathname: string): void,
  resume(): void,
  jumpToLevel(id: string): void,
  randomLevel(): void
}

class MainMenu extends Component<Props> {
  constructor(props) {
    super(props)

    this.keyMap = {
      ArrowUp: () => {
        if (this.props.selectedItemIndex > 0) {
          this.props.updateLocalState(localKey, {
            selectedItemIndex: this.props.selectedItemIndex - 1
          })
        }
      },
      ArrowDown: () => {
        if (this.props.selectedItemIndex + 1 < this.props.options.length) {
          this.props.updateLocalState(localKey, {
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
          this.props.updateLocalState(localKey, { level: this.props.level - 1 })
        }
      },
      ArrowRight: () => {
        if (
          this.props.options[this.props.selectedItemIndex].type ===
            'JUMP_TO_LEVEL' &&
          this.props.level < LevelConstants.NUMBER_OF_LEVELS
        ) {
          this.props.updateLocalState(localKey, { level: this.props.level + 1 })
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
