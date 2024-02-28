import * as React from 'react';

export interface CodeProps {
    code: string;
}

export class Code extends React.Component<CodeProps, {}> {
    render() {
        return (
            <div>
                <pre>{this.props.code}</pre>
            </div>
        );
    }
}
