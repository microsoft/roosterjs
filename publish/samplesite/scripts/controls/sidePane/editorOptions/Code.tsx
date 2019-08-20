import * as React from 'react';
import BuildInPluginState from '../../BuildInPluginState';
import EditorCode from './codes/EditorCode';

export interface CodeProps {
    state: BuildInPluginState;
}

export default class Code extends React.Component<CodeProps, {}> {
    render() {
        let editor = new EditorCode(this.props.state);
        return (
            <div>
                <pre>{editor.getCode()}</pre>
            </div>
        );
    }
}
