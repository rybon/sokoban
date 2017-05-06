import styles from './styles';

import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
    ActionCreators as NavigationActionCreators,
    Selectors as NavigationSelectors
} from 'domains/navigation';
import {
    Constants as LevelConstants
} from 'domains/level';
import {
    ActionCreators as ScoresActionCreators,
    Selectors as ScoresSelectors
} from 'domains/scores';
import { ContainerComponent } from 'components/base';
import {
    Container,
    Message,
    Button
} from 'components/presentational';

const mapStateToProps = (state) => ({
    scores: ScoresSelectors.levelsScores(state),
    selectedItemIndex: NavigationSelectors.currentViewState(state).get('selectedItemIndex') || 0
});
const mapDispatchToProps = {
    updateViewState: NavigationActionCreators.updateViewState,
    removeAllScores: ScoresActionCreators.removeAllScores,
    removeScore: ScoresActionCreators.removeScore,
    back: NavigationActionCreators.navigateBack
};

class HighScores extends ContainerComponent {
    constructor(props) {
        super(props);
        this.keyMap = {
            ArrowUp: () => {
                const { selectedItemIndex, updateViewState } = this.props;

                if (selectedItemIndex > 0) {
                    updateViewState({ selectedItemIndex: selectedItemIndex - 1 });
                }
            },
            ArrowDown: () => {
                const { selectedItemIndex, updateViewState } = this.props;

                if ((selectedItemIndex + 1) <= LevelConstants.NUMBER_OF_LEVELS) {
                    updateViewState({ selectedItemIndex: selectedItemIndex + 1 });
                }
            },
            ArrowLeft: () => {
                const { selectedItemIndex, updateViewState } = this.props;

                if ((selectedItemIndex - 10) > 0) {
                    updateViewState({ selectedItemIndex: selectedItemIndex - 10 });
                }
            },
            ArrowRight: () => {
                const { selectedItemIndex, updateViewState } = this.props;

                if ((selectedItemIndex + 10) <= LevelConstants.NUMBER_OF_LEVELS) {
                    updateViewState({ selectedItemIndex: selectedItemIndex + 10 });
                }
            },
            Space: () => {
                const { selectedItemIndex, removeScore, removeAllScores } = this.props;

                if (selectedItemIndex === 0) {
                    removeAllScores();
                } else if (selectedItemIndex > 0 && selectedItemIndex <= LevelConstants.NUMBER_OF_LEVELS) {
                    removeScore(selectedItemIndex);
                }
            },
            KeyB: () => {
                this.props.back();
            }
        };
    }

    render() {
        const { scores, selectedItemIndex } = this.props;
        const explanation = 'Level: player moves / box moves';
        const removeAllLevels = 'Remove all levels';
        const removeLevel = 'Remove level';
        const lists = [];
        let children = [];
        for (let i = 1; i <= LevelConstants.NUMBER_OF_LEVELS; i++) {
            children.push(<Message key={`m${i}`} className={classNames(styles.message, (scores.getIn(['' + i, 'playerMoves']) || scores.getIn(['' + i, 'boxMoves'])) && styles.success)}>{`${i}: ${scores.getIn(['' + i, 'playerMoves']) || '-'} / ${scores.getIn(['' + i, 'boxMoves']) || '-'}`}</Message>);
            children.push(<Button key={`b${i}`} selected={selectedItemIndex === i}>{removeLevel}</Button>);
            if (i % 10 === 0) {
                lists.push(<Container key={i} className={styles.list}>{children}</Container>);
                children = [];
            }
        }

        return (
            <Container>
                <Message>{explanation}</Message>
                <Button selected={selectedItemIndex === 0}>{removeAllLevels}</Button>
                {lists}
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HighScores);
