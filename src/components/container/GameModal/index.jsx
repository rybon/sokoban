import styles from './styles.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindKeys, unbindKeys } from 'domains/interaction/actionCreators'
import { nextLevel } from 'domains/level/actionCreators'
import { Container, Message, Button } from 'components/presentational'

const mapDispatchToProps = {
  bindKeys,
  unbindKeys,
  nextLevel
}

class GameModal extends Component {
  static propTypes = {
    bindKeys: PropTypes.func.isRequired,
    unbindKeys: PropTypes.func.isRequired,
    nextLevel: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.modalKeyMap = {
      Space: () => {
        this.props.nextLevel()
      }
    }
  }

  componentDidMount() {
    this.props.bindKeys(this.modalKeyMap)
  }

  componentWillUnmount() {
    this.props.unbindKeys(this.modalKeyMap)
    this.modalKeyMap = null
  }

  render() {
    const message = 'You have done a good job!'
    const button = 'OK'

    return (
      <Container className={styles.overlay}>
        <Container className={styles.modal}>
          <Message>{message}</Message>
          <Button selected={true}>{button}</Button>
        </Container>
      </Container>
    )
  }
}

export default connect(null, mapDispatchToProps)(GameModal)
