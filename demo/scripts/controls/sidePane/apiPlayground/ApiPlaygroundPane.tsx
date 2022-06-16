import * as React from 'react';
import apiEntries, { ApiPlaygroundReactComponent } from './apiEntries';
import ApiPaneProps from './ApiPaneProps';
import { getObjectKeys } from 'roosterjs-editor-dom';
import { PluginEvent } from 'roosterjs-editor-types';
import { SidePaneElement } from '../SidePaneElement';

const styles = require('./ApiPlaygroundPane.scss');

export interface ApiPlaygroundPaneState {
    current: string;
}

export default class ApiPlaygroundPane extends React.Component<ApiPaneProps, ApiPlaygroundPaneState>
    implements SidePaneElement {
    private select = React.createRef<HTMLSelectElement>();
    private pane = React.createRef<ApiPlaygroundReactComponent>();
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

                    <select ref={this.select} value={this.state.current} onChange={this.onChange}>
                        {getObjectKeys(apiEntries).map(key => (
                            <option value={key} key={key}>
                                {apiEntries[key].name}
                            </option>
                        ))}
                    </select>
                </div>
                {pane}
            </>
        );
    }

    onPluginEvent(e: PluginEvent) {
        if (this.pane.current && this.pane.current.onPluginEvent) {
            this.pane.current.onPluginEvent(e);
        }
    }

    setHashPath(path: string[]) {
        let paneName = path && getObjectKeys(apiEntries).indexOf(path[0]) >= 0 ? path[0] : null;

        if (paneName && paneName != this.state.current) {
            this.setState({
                current: paneName,
            });
        } else {
            this.props.updateHash(null, [this.state.current]);
        }
    }

    private onChange = () => {
        this.props.updateHash(null, [this.select.current.value]);
    };
}
