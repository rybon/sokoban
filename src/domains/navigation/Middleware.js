import ActionTypes from './ActionTypes';

const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD';
const MULTIPLE_STEPS_METHOD = 'go';

const navigationMiddleware = (history) => {
    return () => next => action => {
        if (action.type !== CALL_HISTORY_METHOD) {
            return next(action);
        }

        const { payload: { method, args } } = action;
        if (method === MULTIPLE_STEPS_METHOD && args[0] < 0) {
            next({
                type: ActionTypes.GO_BACK_MULTIPLE_STEPS,
                payload: {
                    steps: args[0]
                }
            });
        }
        history[method](...args);
    };
};

export default navigationMiddleware;
