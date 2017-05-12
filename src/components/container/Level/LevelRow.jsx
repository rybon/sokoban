import styles from './styles';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
    Selectors as LevelSelectors
} from 'domains/level';
import { Tile } from 'components/presentational';

const makeMapStateToProps = () => {
    const getLevelRow = LevelSelectors.makeGetLevelRow();
    const mapStateToProps = (state, props) => ({
        row: getLevelRow(state, props)
    });
    return mapStateToProps;
}

class LevelRow extends Component {
    render() {
        const { row } = this.props;

        return (
            <div className={styles.row}>
                {
                    row.map((tile, tileIndex) => <Tile key={tileIndex} type={tile} />)
                }
            </div>
        );
    }
}

export default connect(makeMapStateToProps, null)(LevelRow);
