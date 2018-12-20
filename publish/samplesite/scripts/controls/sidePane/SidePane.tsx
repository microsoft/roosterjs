import * as React from 'react';
import SidePanePlugin from '../SidePanePlugin';

const styles = require('./SidePane.scss');

export interface SidePaneProps {
    plugins: SidePanePlugin[];
    className?: string;
}

export interface SidePaneState {
    currentPane: SidePanePlugin;
}

export default class SidePane extends React.Component<SidePaneProps, SidePaneState> {
    private div = React.createRef<HTMLDivElement>();

    constructor(props: SidePaneProps) {
        super(props);
        this.state = {
            currentPane: this.getCurrentPluginFromHash() || this.props.plugins[0],
        };

        window.addEventListener('hashchange', this.setCurrentPlugin);
    }

    render() {
        window.location.hash = this.state.currentPane.getName
            ? this.state.currentPane.getName()
            : '';
        let className = (this.props.className || '') + ' ' + styles.sidePane;
        return (
            <div className={className} ref={this.div}>
                {this.props.plugins.map(this.renderSidePane)}
            </div>
        );
    }

    changeWidth(widthDelta: number) {
        let div = this.div.current;
        if (div) {
            div.style.width = div.clientWidth + widthDelta + 'px';
        }
    }

    private renderSidePane = (plugin: SidePanePlugin): JSX.Element => {
        let title = plugin.getTitle();
        let isCurrent = this.state.currentPane == plugin;
        return (
            <div key={title} className={isCurrent ? styles.activePane : styles.inactivePane}>
                <div
                    className={styles.title}
                    onClick={() => this.setState({ currentPane: plugin })}
                >
                    {title}
                </div>
                <div className={styles.bodyContainer}>
                    <div className={styles.body}>{plugin.renderSidePane()}</div>
                </div>
            </div>
        );
    };

    private setCurrentPlugin = () => {
        let plugin = this.getCurrentPluginFromHash();

        if (plugin && this.state.currentPane != plugin) {
            this.setState({
                currentPane: plugin,
            });
        }
    };

    private getCurrentPluginFromHash() {
        let hash = window.location.hash;
        hash = hash ? hash.substr(1) : null;

        if (hash) {
            for (let plugin of this.props.plugins) {
                let name = plugin.getName && plugin.getName();
                if (name == hash) {
                    return plugin;
                }
            }
        }

        return null;
    }
}
