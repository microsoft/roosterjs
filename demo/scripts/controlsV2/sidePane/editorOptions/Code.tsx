import * as React from 'react';
import { EditorCode } from './codes/EditorCode';
import { OptionState } from './OptionState';

export interface CodeProps {
    state: OptionState;
}

export class Code extends React.Component<CodeProps, {}> {
    render() {
        let editor = new EditorCode(this.props.state);
        return (
            <div>
                <pre>{editor.getCode()}</pre>
            </div>
        );
    }
}
