import styles from './styles';

import React from 'react';
import { connect } from 'react-redux';
import {
    ActionCreators as LevelActionCreators,
    Selectors as LevelSelectors,
    Constants as LevelConstants
} from 'domains/level';
import {
    Selectors as ScoresSelectors
} from 'domains/scores';
import {
    ActionCreators as NavigationActionCreators,
    Selectors as NavigationSelectors
} from 'domains/navigation';
import { ContainerComponent } from 'components/base';
import { GameModal } from 'components/container';
import {
    Container,
    Message
} from 'components/presentational';
import LevelRow from './LevelRow';
import classNames from 'classnames';
import { ROUTES } from 'routes/paths';

const mapStateToProps = (state) => ({
    id: LevelSelectors.levelId(state),
    tiles: LevelSelectors.tiles(state),
    playerMoves: LevelSelectors.playerMoves(state),
    boxMoves: LevelSelectors.boxMoves(state),
    bestPlayerMoves: ScoresSelectors.bestPlayerMovesForLevel(state, LevelSelectors.levelId(state)),
    bestBoxMoves: ScoresSelectors.bestBoxMovesForLevel(state, LevelSelectors.levelId(state)),
    win: LevelSelectors.winCondition(state),
    scale: NavigationSelectors.currentViewState(state).get('scale') === false ? false : true
});
const mapDispatchToProps = {
    up: LevelActionCreators.goUp,
    down: LevelActionCreators.goDown,
    left: LevelActionCreators.goLeft,
    right: LevelActionCreators.goRight,
    undo: LevelActionCreators.undo,
    restart: LevelActionCreators.restart,
    navigateTo: NavigationActionCreators.navigateTo,
    navigateBack: NavigationActionCreators.navigateBack,
    updateViewState: NavigationActionCreators.updateViewState
};

class Level extends ContainerComponent {
    constructor() {
        super();
        this.keyMap = {
            ArrowUp: () => {
                this.props.up();
            },
            ArrowDown: () => {
                this.props.down();
            },
            ArrowLeft: () => {
                this.props.left();
            },
            ArrowRight: () => {
                this.props.right();
            },
            KeyZ: () => {
                this.props.undo();
            },
            KeyR: () => {
                this.props.restart();
            },
            KeyM: () => {
                this.props.navigateTo(ROUTES.ROOT);
            },
            KeyB: () => {
                this.props.navigateBack();
            },
            Equal: () => {
                this.props.updateViewState({
                    scale: true
                });
            },
            Minus: () => {
                this.props.updateViewState({
                    scale: false
                });
            }
        };
    }

    render() {
        const { id, tiles, playerMoves, boxMoves, bestPlayerMoves, bestBoxMoves, win, scale } = this.props;
        const levelIndicator = `Level ${id} / ${LevelConstants.NUMBER_OF_LEVELS}`;
        const playerMovesIndicator = `Player moves / best: ${playerMoves} / ${bestPlayerMoves || '-'}`;
        const boxMovesIndicator = `Box moves / best: ${boxMoves} / ${bestBoxMoves || '-'}`;
        const numberOfRows = tiles.size;
        const children = [];
        for (let i = 0; i < numberOfRows; i++) {
            children.push(<LevelRow key={i} rowIndex={i} />);
        }

        return (
            <Container>
                <Message className={styles.topLeft}>{id && levelIndicator}</Message>
                <Message className={styles.bottomLeft}>{playerMovesIndicator}</Message>
                <Message className={styles.bottomRight}>{boxMovesIndicator}</Message>
                {win && <GameModal key={numberOfRows} />}
                <Container className={classNames(styles.level, scale && styles.scale)}>
                    {children}
                </Container>
            </Container>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Level);
