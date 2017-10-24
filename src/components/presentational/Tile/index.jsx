import styles from './styles.css'

import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default class Tile extends PureComponent {
  render() {
    const { type } = this.props

    return <div className={styles[type]} />
  }
}

Tile.propTypes = {
  type: PropTypes.string.isRequired
}
