// @flow

import React from 'react'
import { connect } from 'react-redux'
import { makeGetLevelRow } from 'domains/level/selectors'
import { Tile } from 'components/presentational'

import styles from './styles.css'

type MapStateToProps = () => Object

const makeMapStateToProps = (): MapStateToProps => {
  const getLevelRow = makeGetLevelRow()
  const mapStateToProps = (state, props) => ({
    row: getLevelRow(state, props)
  })

  return mapStateToProps
}

type Props = {
  row: Object
}

const LevelRow = ({ row }: Props) => (
  <div className={styles.row}>
    {row.map((tile, tileIndex) => (
      <Tile
        key={tileIndex} // eslint-disable-line react/no-array-index-key
        type={tile}
      />
    ))}
  </div>
)

export default connect(makeMapStateToProps, null)(LevelRow)
