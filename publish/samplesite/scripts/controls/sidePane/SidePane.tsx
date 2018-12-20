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
            currentPane: props.plugins[0],
        };
    }
    render() {
        let className = (this.props.className || '') + ' ' + styles.sidePane;
        return (
            <div className={className} ref={this.div}>
                {this.props.plugins.map(this.renderSidePane)}
            </div>
        );
    }

    setActiveSidePane(plugin: SidePanePlugin) {
        this.setState({
            currentPane: plugin,
        });
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
}
