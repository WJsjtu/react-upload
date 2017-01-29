import * as types from '../constants/ActionTypes';
import * as status from '../constants/TaskStatus';
import documentVisible  from '../utils/documentVisible';

const initialState = [
    /**
     * Task {
     *      id:             {string}    Identity of a task.
     *      data:           {object}    jQuery.fileUpload raw object.
     *
     *      file:           {File|Blob} Raw file object.
     *
     *      //Native File Object info.
     *      name:           {string}    File name.
     *      size:           {number}    File size.
     *      lastModified    {number}    File lastModify
     *      type            {string}    File type.
     *
     *      preview         {Element}
     *
     *
     *      loaded:         {number}    File uploaded size.
     *      update:         {number}    The timestamp for update.
     *      lastLoaded:     {number}    The loaded size when updated last time.
     *      lastUpdate:     {number}    The timestamp (million seconds) info updated.
     *      speed:          {number}    The speed.
     *
     *      status:         {string}    'PENDING' | 'UPLOADING' | 'PAUSED' | 'ERROR' | 'CANCELED' | 'REMOVED'
     *      url:            {string}    Download url.
     * }
     */
];

/**
 *
 * @param {object} state
 * @param {object} action
 * @param {string} stateString
 * @param {function|undefined} callback
 * @return {Array.<object>}
 */
const updateStateById = (state, action, stateString, callback) => {
    const index = getFileIndexById(state, action);
    if (index >= 0) {
        state[index].status = stateString;
        if (typeof callback === 'function') {
            callback(state[index]);
        }
    }
    return state.slice();
};

/**
 *
 * @param {object} state
 * @param {object} action
 * @return {number}
 */
const getFileIndexById = (state, action) => {
    for (let i = 0, l = state.length; i < l; i++) {
        if (state[i].id === action.id) {
            return i;
        }
    }
    return -1;
};
export default function tasks(state = initialState, action) {
    switch (action.type) {

        case types.ADD_FILE:

            if (Array.isArray(action.data.files) && action.data.files.length == 1) {

                const file = action.data.files[0];
                const {name, lastModified, size, type} =  file;

                return [{
                    id: action.id,
                    data: action.data,

                    name, lastModified, size, type, file,

                    preview: null,

                    loaded: 0,
                    update: undefined,
                    lastLoaded: 0,
                    lastUpdate: undefined,
                    speed: undefined,

                    status: status.ADDING,
                    url: undefined
                }, ...state];

            } else {
                return state;
            }

        case types.PROCESS_FILE:

            return updateStateById(state, action, status.PENDING);


        case types.START_FILE:

            return updateStateById(state, action, status.UPLOADING, (fileState) => {
                setTimeout(() => {
                    fileState.data.submit();
                }, 50);
            });

        case types.CANCEL_FILE:

            return updateStateById(state, action, status.CANCELED);

        case types.REMOVE_FILE:

            return updateStateById(state, action, status.REMOVED);

        case types.PAUSE_FILE:

            return updateStateById(state, action, status.PAUSED);

        case types.RESUME_FILE:

            return updateStateById(state, action, status.UPLOADING);

        case types.DONE_FILE:
        case types.ERROR_FILE:

        case types.UPDATE_FILE_NAME:
        case types.UPDATE_FILE_SIZE:
            return (() => {
                const index = getFileIndexById(state, action);
                if (index == -1 || state[index].size === action.size) return state;
                state[index].size = action.size;
                return state.slice();
            })();
        case types.UPDATE_FILE_LOADED:
            return (() => {
                const index = getFileIndexById(state, action);
                if (index == -1 || state[index].loaded === action.loaded) return state;

                const timestamp = +(new Date);

                if (isNaN(+state[index].lastUpdate) || isNaN(+state[index].lastLoaded)) {
                    state[index].lastUpdate = timestamp;
                    state[index].update = timestamp;
                    state[index].loaded = action.loaded;
                    state[index].lastLoaded = action.loaded;
                    state[index].speed = undefined;
                    //avoid update
                    return state;
                } else if (timestamp - state[index].lastUpdate < 500) {
                    state[index].update = timestamp;
                    state[index].loaded = action.loaded;
                    //avoid update
                    return state;
                } else {
                    const deltaTime = timestamp - state[index].lastUpdate, deltaLoaded = action.loaded - state[index].lastLoaded;
                    state[index].lastUpdate = timestamp;
                    state[index].lastLoaded = state[index].loaded;
                    state[index].loaded = action.loaded;
                    state[index].speed = deltaLoaded / deltaTime;
                    return documentVisible ? state.slice() : state;
                }
            })();
        default:
            return state;
    }
}