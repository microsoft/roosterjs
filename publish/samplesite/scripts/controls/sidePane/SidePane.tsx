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
            currentPane: this.props.plugins[0],
        };

        window.addEventListener('hashchange', this.updateStateFromHash);
    }

    componentDidMount() {
        this.updateStateFromHash();
    }

    render() {
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

    updateHash = (pluginName?: string, path?: string[]) => {
        window.location.hash =
            (pluginName || this.state.currentPane.getName()) + (path ? '/' + path.join('/') : '');
    };

    private updateStateFromHash = () => {
        let hash = window.location.hash;
        let hashes = (hash ? hash.substr(1) : '').split('/');
        let pluginName = hashes[0];
        let plugin =
            pluginName && this.props.plugins.filter(plugin => plugin.getName() == pluginName)[0];

        if (plugin) {
            this.setState({
                currentPane: plugin,
            });

            window.setTimeout(() => {
                hashes.splice(0, 1);
                if (plugin.setHashPath) {
                    plugin.setHashPath(hashes);
                }
            }, 0);
        }
    };

    private renderSidePane = (plugin: SidePanePlugin): JSX.Element => {
        let title = plugin.getTitle();
        let isCurrent = this.state.currentPane == plugin;
        return (
            <div key={title} className={isCurrent ? styles.activePane : styles.inactivePane}>
                <div className={styles.title} onClick={() => this.updateHash(plugin.getName())}>
                    {title}
                </div>
                <div className={styles.bodyContainer}>
                    <div className={styles.body}>{plugin.renderSidePane(this.updateHash)}</div>
                </div>
            </div>
        );
    };
}
