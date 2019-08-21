import * as React from 'react';
import * as ReactDom from 'react-dom';
import BuildInPluginState from './BuildInPluginState';
import Editor from './editor/Editor';
import MainPaneBase from './MainPaneBase';
import Ribbon from './ribbon/Ribbon';
import SidePane from './sidePane/SidePane';
import TitleBar from './titleBar/TitleBar';
import { getAllPluginArray, getPlugins, getSidePanePluginArray } from './plugins';

const styles = require('./MainPane.scss');

class MainPane extends MainPaneBase {
    private mouseX: number;
    private editor = React.createRef<Editor>();

    constructor(props: {}) {
        super(props);

        this.state = {
            showSidePane: window.location.hash != '',
            showRibbon: true,
        };
    }

    render() {
        let plugins = getPlugins();

        return (
            <div className={styles.mainPane}>
                <TitleBar className={styles.noGrow} />
                {this.state.showRibbon && (
                    <Ribbon
                        plugin={plugins.ribbon}
                        className={styles.noGrow}
                        ref={plugins.ribbon.refCallback}
                    />
                )}
                <div className={styles.body}>
                    <Editor
                        plugins={getAllPluginArray(this.state.showSidePane)}
                        className={styles.editor}
                        ref={this.editor}
                        initState={plugins.editorOptions.getBuildInPluginState()}
                        undo={plugins.snapshot}
                    />
                    {this.state.showSidePane ? (
                        <>
                            <div className={styles.resizer} onMouseDown={this.onMouseDown} />
                            <SidePane
                                ref={ref => (this.sidePane = ref)}
                                plugins={getSidePanePluginArray()}
                                className={`main-pane ${styles.sidePane}`}
                            />
                            <button
                                className={`side-pane-toggle open ${styles.showSidePane}`}
                                onClick={this.onHideSidePane}>
                                <div>Hide side pane</div>
                            </button>
                        </>
                    ) : (
                        <button
                            className={`side-pane-toggle closed ${styles.showSidePane}`}
                            onClick={this.onShowSidePane}>
                            <div>Show side pane</div>
                        </button>
                    )}
                </div>
            </div>
        );
    }

    resetEditorPlugin(pluginState: BuildInPluginState) {
        this.editor.current.resetEditorPlugin(pluginState);
    }

    updateFormatState() {
        getPlugins().formatState.updateFormatState();
    }

    setIsRibbonShown(isShown: boolean) {
        this.setState({
            showRibbon: isShown,
        });
    }

    private onMouseDown = (e: React.MouseEvent<EventTarget>) => {
        document.addEventListener('mousemove', this.onMouseMove, true);
        document.addEventListener('mouseup', this.onMouseUp, true);
        document.body.style.userSelect = 'none';
        this.mouseX = e.pageX;
    };

    private onMouseMove = (e: MouseEvent) => {
        this.sidePane.changeWidth(this.mouseX - e.pageX);
        this.mouseX = e.pageX;
    };

    private onMouseUp = (e: MouseEvent) => {
        document.removeEventListener('mousemove', this.onMouseMove, true);
        document.removeEventListener('mouseup', this.onMouseUp, true);
        document.body.style.userSelect = '';
    };

    private onShowSidePane = () => {
        this.setState({
            showSidePane: true,
        });
    };

    private onHideSidePane = () => {
        this.setState({
            showSidePane: false,
        });
        window.location.hash = '';
    };
}

export function mount(parent: HTMLElement) {
    ReactDom.render(<MainPane />, parent);
}
