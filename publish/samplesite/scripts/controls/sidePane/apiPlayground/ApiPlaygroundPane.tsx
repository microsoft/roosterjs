import * as React from 'react';
import ApiPaneProps, { ApiPlaygroundComponent } from './ApiPaneProps';
import BlockElementsPane from './blockElements/BlockElementsPane';
import SanitizerPane from './sanitizer/SanitizerPane';
import { PluginEvent } from 'roosterjs-editor-types';

const styles = require('./ApiPlaygroundPane.scss');

interface ApiEntry {
    name: string;
    component?: { new (prpos: ApiPaneProps): ApiPlaygroundComponent };
}

const apiEntries: { [key: string]: ApiEntry } = {
    empty: {
        name: 'Please select',
    },
    block: {
        name: 'Block Elements',
        component: BlockElementsPane,
    },
    sanitizer: {
        name: 'HTML Sanitizer',
        component: SanitizerPane,
    },
    more: {
        name: 'Coming soon...',
    },
};

export interface ApiPlaygroundPaneState {
    current: string;
}

export default class ApiPlaygroundPane extends React.Component<
    ApiPaneProps,
    ApiPlaygroundPaneState
> {
    private select = React.createRef<HTMLSelectElement>();
    private pane = React.createRef<ApiPlaygroundComponent>();

    constructor(props: ApiPaneProps) {
        super(props);
        this.state = { current: 'empty' };
    }

    render() {
        let componentClass = apiEntries[this.state.current].component;
        let pane: JSX.Element = null;
        if (componentClass) {
            pane = React.createElement(componentClass, { ...this.props, ref: this.pane });
        }

        return (
            <>
                <div className={styles.header}>
                    <h3>Select an API to try</h3>

                    <select
                        ref={this.select}
                        defaultValue={this.state.current}
                        onChange={this.onChange}>
                        {Object.keys(apiEntries).map(key => (
                            <option value={key}>{apiEntries[key].name}</option>
                        ))}
                    </select>
                </div>
                {pane}
            </>
        );
    }

    onPluginEvent(e: PluginEvent) {
        if (this.pane.current.onPluginEvent) {
            this.pane.current.onPluginEvent(e);
        }
    }

    private onChange = () => {
        this.setState({
            current: this.select.current.value,
        });
    };
}
