import React from 'react';
import { Route, IndexRoute } from 'react-router';
import {
    App,
    MainMenu,
    Level,
    Help,
    HighScores
} from 'components/container';
import { PATHS } from './paths';

const getRoutes = () => (
    <Route path={PATHS.ROOT} component={App}>
        <IndexRoute component={MainMenu} />
        <Route path={PATHS.LEVELS} component={Level} />
        <Route path={PATHS.HELP} component={Help} />
        <Route path={PATHS.HIGH_SCORES} component={HighScores} />
    </Route>
);

export default getRoutes;
