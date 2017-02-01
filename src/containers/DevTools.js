import React, {createElement} from 'react';
import {createDevTools} from 'redux-devtools';
import LogMonitor from 'redux-devtools-log-monitor';
import DockMonitor from 'redux-devtools-dock-monitor';

/**
 *
 * My hack for Webpack Tree Shaking problem.
 * In this situation, `redux-devtools*` are totally not needed in production mode,
 * so I can defined these libraries as undefined by setting externals options to Webpack.
 * This will end up with error: `createDevTools of undefined`.
 * So I put the assert here to let UglifyJS remove the dead code,
 * thus avoiding the negative condition from executing. Of course there will be no error any longer.
 *
 */
export default process.env.NODE_ENV === 'production' ? undefined : createDevTools(
    <DockMonitor toggleVisibilityKey='ctrl-h'
                 changePositionKey='ctrl-q'>
        <LogMonitor />
    </DockMonitor>
);