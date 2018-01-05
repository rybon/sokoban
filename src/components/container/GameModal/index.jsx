// @flow

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindKeys, unbindKeys } from 'domains/interaction/actionCreators'
import { nextLevel } from 'domains/level/actionCreators'
import { Container, Message, Button } from 'components/presentational'

import styles from './styles.css'

const mapDispatchToProps = {
  bindKeys,
  unbindKeys,
  nextLevel
}

type Props = {
  bindKeys: (keyMap: Object) => mixed,
  unbindKeys: (keyMap: Object) => mixed,
  nextLevel: () => mixed
}

class GameModal extends Component<Props> {
  constructor(props) {
    super(props)

    this.modalKeyMap = {
      Space: () => {
        this.props.nextLevel()
      }
    }
  }

  componentDidMount() {
    if (this.modalKeyMap) {
      this.props.bindKeys(this.modalKeyMap)
    }
  }

  componentWillUnmount() {
    if (this.modalKeyMap) {
      this.props.unbindKeys(this.modalKeyMap)
    }
    this.modalKeyMap = null
  }

  modalKeyMap: Object | null

  render() {
    const message = 'You have done a good job!'
    const button = 'OK'

    return (
      <Container className={styles.overlay}>
        <Container className={styles.modal}>
          <Message>{message}</Message>
          <Button selected>{button}</Button>
        </Container>
      </Container>
    )
  }
}

export default connect(null, mapDispatchToProps)(GameModal)
