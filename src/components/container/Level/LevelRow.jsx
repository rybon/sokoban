import styles from './styles.css'

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { makeGetLevelRow } from 'domains/level/selectors'
import { Tile } from 'components/presentational'

const makeMapStateToProps = () => {
  const getLevelRow = makeGetLevelRow()
  const mapStateToProps = (state, props) => ({
    row: getLevelRow(state, props)
  })

  return mapStateToProps
}

class LevelRow extends Component {
  static propTypes = {
    row: PropTypes.object.isRequired
  }

  render() {
    const { row } = this.props

    return (
      <div className={styles.row}>
        {row.map((tile, tileIndex) => <Tile key={tileIndex} type={tile} />)}
      </div>
    )
  }
}

export default connect(makeMapStateToProps, null)(LevelRow)
