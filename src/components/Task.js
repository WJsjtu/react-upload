import Preview from './../components/Preview';
import ProgressBar from './../components/ProgressBar';

import getSizeString from './../utils/getSizeString';
import dateFormat from './../utils/dateFormat';


import getModuleStyle from './../utils/getModuleStyle';
import styles from './../style.less';

export default function Task(task, actions, options) {
    return (
        <div key={task.id} className={getModuleStyle('taskRow row')}>
            <div className={getModuleStyle('col-md-8 col-sm-7 col-xs-12')} style={{overflow: 'auto'}}>
                <div style={{float: 'left'}} className={getModuleStyle('hidden-xs')}>
                    <Preview file={task.file}
                             width={options.previewMaxWidth}
                             height={options.previewMaxHeight}
                             previewed={!!task.file.preview}
                             iconUrl={this.props.iconUrl}
                    />
                </div>
                <div style={{float: 'left', marginLeft: 15}}>
                    <div>
                        <span>{task.name}</span>
                    </div>
                    <div>
                        <span>{getSizeString(task.size) || '- -'}</span>
                        <span>{dateFormat(task.lastModified, 'yyyy年MM月dd日 HH时mm分ss秒')}</span>
                        <span>{task.type}</span>
                    </div>
                </div>
                <div style={{clear: 'both'}}></div>
            </div>
            <div className={getModuleStyle('col-md-2 col-sm-3 col-xs-12')}>
                <ProgressBar loaded={task.loaded} total={task.size} height={16}/>
            </div>

            <div className={getModuleStyle('col-md-2 col-sm-2 hidden-xs')}
                 style={{textAlign: 'center'}}>
                <div>
                    <span>{(getSizeString(task.speed) || '- -') + ' / s'}</span>
                </div>
                <div>
                    <span onClick={() => {
                        actions.startFile(task.id);
                    }}><i className='fa fa-play'> </i></span>
                </div>
            </div>
        </div>
    );
}