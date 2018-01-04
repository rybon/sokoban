import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { makeGetLevelRow } from 'domains/level/selectors'
import { Tile } from 'components/presentational'

import styles from './styles.css'

const makeMapStateToProps = () => {
  const getLevelRow = makeGetLevelRow()
  const mapStateToProps = (state, props) => ({
    row: getLevelRow(state, props)
  })

  return mapStateToProps
}

const LevelRow = ({ row }) => (
  <div className={styles.row}>
    {row.map((tile, tileIndex) => (
      <Tile
        key={tileIndex} // eslint-disable-line react/no-array-index-key
        type={tile}
      />
    ))}
  </div>
)

LevelRow.propTypes = {
  row: PropTypes.shape({ map: PropTypes.func.isRequired }).isRequired
}

export default connect(makeMapStateToProps, null)(LevelRow)
