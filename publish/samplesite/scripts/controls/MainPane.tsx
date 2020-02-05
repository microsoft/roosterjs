import * as React from 'react';
import * as ReactDom from 'react-dom';
import BuildInPluginState from './BuildInPluginState';
import Editor from './editor/Editor';
import MainPaneBase from './MainPaneBase';
import PopoutMainPane from './PopoutMainPane';
import Ribbon from './ribbon/Ribbon';
import SidePane from './sidePane/SidePane';
import TitleBar from './titleBar/TitleBar';
import { getAllPluginArray, getPlugins, getSidePanePluginArray } from './plugins';

const styles = require('./MainPane.scss');
const PopoutRoot = 'mainPane';
const POPOUT_HTML = `<!doctype html><html><head><title>RoosterJs Demo Page PopOut</title></head><body><div id=${PopoutRoot}></div></body></html>`;
const POPOUT_FEATURES = 'menubar=no,statusbar=no,width=1200,height=800';
const POPOUT_URL = 'about:blank';
const POPOUT_TARGET = '_blank';

class MainPane extends MainPaneBase {
    private mouseX: number;
    private popoutRoot: HTMLElement;
    private content: string = null;
    private editor = React.createRef<Editor>();
    private popoutMainPane = React.createRef<PopoutMainPane>();

    constructor(props: {}) {
        super(props);

        this.state = {
            showSidePane: window.location.hash != '',
            showRibbon: true,
            isPopoutShown: false,
        };
    }

    render() {
        let plugins = getPlugins();

        return (
            <div className={styles.mainPane}>
                <TitleBar className={styles.noGrow} />
                {this.state.showRibbon && !this.state.isPopoutShown && (
                    <Ribbon
                        plugin={plugins.ribbon}
                        className={styles.noGrow}
                        ref={plugins.ribbon.refCallback}
                    />
                )}
                <div className={styles.body}>
                    {this.state.isPopoutShown ? (
                        <SidePane
                            ref={ref => (this.sidePane = ref)}
                            plugins={getSidePanePluginArray()}
                            className={`main-pane ${styles.sidePane} ${styles.sidePaneFullWidth}`}
                        />
                    ) : (
                        <>
                            <Editor
                                plugins={getAllPluginArray(this.state.showSidePane)}
                                className={styles.editor}
                                ref={this.editor}
                                initState={plugins.editorOptions.getBuildInPluginState()}
                                undo={plugins.snapshot}
                                content={this.content}
                            />

                            {this.state.showSidePane ? (
                                <>
                                    <div
                                        className={styles.resizer}
                                        onMouseDown={this.onMouseDown}
                                    />
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
                        </>
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

    popout() {
        const win = window.open(POPOUT_URL, POPOUT_TARGET, POPOUT_FEATURES);
        win.document.write(POPOUT_HTML);
        win.addEventListener('unload', () => {
            this.content = this.popoutMainPane.current.getContent();
            if (this.popoutRoot) {
                ReactDom.unmountComponentAtNode(this.popoutRoot);
            }
            window.setTimeout(() => {
                this.setState({ isPopoutShown: false });
            }, 100);
        });

        let styles = document.getElementsByTagName('STYLE');
        for (let i = 0; i < styles.length; i++) {
            let newStyle = win.document.createElement('STYLE') as HTMLStyleElement;
            let sheet = (styles[i] as HTMLStyleElement).sheet as CSSStyleSheet;
            let cssText = '';
            for (let j = 0; j < sheet.cssRules.length; j++) {
                cssText += sheet.cssRules[j].cssText;
            }
            newStyle.innerHTML = cssText;
            win.document.head.appendChild(newStyle);
        }

        this.content = this.editor.current.getContent();

        this.setState({
            isPopoutShown: true,
        });

        this.popoutRoot = win.document.getElementById(PopoutRoot);

        window.setTimeout(() => {
            ReactDom.render(
                <PopoutMainPane ref={this.popoutMainPane} content={this.content} />,
                this.popoutRoot
            );
        }, 0);
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
