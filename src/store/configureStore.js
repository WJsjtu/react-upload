import {createStore, compose} from 'redux';
import rootReducer from '../reducers';

//<#IF_DEF DEBUG>
import {persistState} from 'redux-devtools';
import DevTools from '../containers/DevTools';

const enhancer = compose(
    DevTools.instrument(),
    persistState(
        window.location.href.match(
            /[?&]debug_session=([^&#]+)\b/
        )
    )
);

//<#END_IF>

export default function configureStore(initialState) {

    let store;

    //<#IF_DEF DEBUG>

    store = createStore(rootReducer, initialState, enhancer);

    //<#ELSE>

    store = createStore(rootReducer, initialState);

    //<#END_IF>
    return store;

}