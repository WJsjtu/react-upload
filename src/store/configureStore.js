import {createStore, compose} from 'redux';
import {persistState} from 'redux-devtools';
import rootReducer from '../reducers';
import DevTools from '../containers/DevTools';


export default function configureStore(initialState) {
    if (process.env.NODE_ENV === 'production') {
        return createStore(rootReducer, initialState);
    } else {


        /**
         *
         * Webpack's Tree-Shaking problems may need long time to solve.
         * It is still unknown whether the dead code is removed first or Tree-Shaking will be proceeded first .
         * It is also unknown that whether the unused declaration will still treated as side-affect by UglifyJS.
         * Keeping declaration here is currently used to remove dead code here only!
         * `DevTools` will still be imported if Tree-Shaking problems are not solved or
         * Tree-Shaking is proceeded before removing dead code.
         * This only works when webpack removed dead code first and then proceed Tree-Shaking later, or
         * Webpack's Tree-Shaking can tell the module `DevTools` is no longer needed
         * even the dead code is not removed (Well, I think this is not practical).
         *
         * **Note**  Define plugin only replace process.env.NODE_ENV by value set in options, it will not remove dead code.
         *
         *
         */
        const enhancer = compose(
            DevTools.instrument(),
            persistState(
                window.location.href.match(
                    /[?&]debug_session=([^&#]+)\b/
                )
            )
        );

        return createStore(rootReducer, initialState, enhancer);
    }

}