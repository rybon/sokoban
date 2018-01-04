import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import styles from './styles.css'

export default class Tile extends PureComponent {
  static propTypes = {
    type: PropTypes.string.isRequired
  }

  render() {
    const { type } = this.props

    return <div className={styles[type]} />
  }
}
