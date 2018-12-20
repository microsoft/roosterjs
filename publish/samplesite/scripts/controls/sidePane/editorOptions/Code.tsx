import * as React from 'react';
import BuildInPluginState from '../../BuildInPluginState';
import CodeElement from './codes/CodeElement';
import EditorCode from './codes/EditorCode';

export interface CodeProps {
    state: BuildInPluginState;
}

export default class Code extends React.Component<CodeProps, {}> {
    render() {
        let editor = new EditorCode(this.props.state);
        return (
            <div>
                <pre>
                    {CodeElement.mergeImport(editor.getImports())}
                    {'\n'}
                    {editor.getCode()}
                </pre>
            </div>
        );
    }
}
