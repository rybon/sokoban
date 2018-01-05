// @flow

import React, { PureComponent } from 'react'

import styles from './styles.css'

type Props = {
  type: string
}

export default class Tile extends PureComponent<Props> {
  render() {
    const { type } = this.props

    return <div className={styles[type]} />
  }
}
