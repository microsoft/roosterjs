import * as React from 'react';
import * as ReactDom from 'react-dom';
import ApiPlaygroundPlugin from './sidePane/apiPlayground/ApiPlaygroundPlugin';
import BuildInPluginState from './BuildInPluginState';
import EditorOptionsPlugin from './sidePane/editorOptions/EditorOptionsPlugin';
import EventViewPlugin from './sidePane/eventViewer/EventViewPlugin';
import FormatStatePlugin from './sidePane/formatState/FormatStatePlugin';
import getToggleablePlugins from './getToggleablePlugins';
import MainPaneBase from './MainPaneBase';
import Ribbon from './ribbon/Ribbon';
import RibbonPlugin from './ribbon/RibbonPlugin';
import SidePane from './sidePane/SidePane';
import SnapshotPlugin from './sidePane/snapshot/SnapshotPlugin';
import TitleBar from './titleBar/TitleBar';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions } from 'roosterjs-editor-types';
import { getDarkColor } from 'roosterjs-color-utils';
import { Rooster } from 'roosterjs-react';
import { trustedHTMLHandler } from '../utils/trustedHTMLHandler';
import { UpdateContentPlugin, UpdateMode } from 'roosterjs-react/lib/plugins/UpdateContentPlugin';

const styles = require('./MainPane.scss');
const PopoutRoot = 'mainPane';
const POPOUT_HTML = `<!doctype html><html><head><title>RoosterJs Demo Page PopOut</title></head><body><div id=${PopoutRoot}></div></body></html>`;
const POPOUT_FEATURES = 'menubar=no,statusbar=no,width=1200,height=800';
const POPOUT_URL = 'about:blank';
const POPOUT_TARGET = '_blank';

class MainPane extends MainPaneBase {
    private mouseX: number;
    private popoutRoot: HTMLElement;

    private formatStatePlugin: FormatStatePlugin;
    private editorOptionPlugin: EditorOptionsPlugin;
    private eventViewPlugin: EventViewPlugin;
    private apiPlaygroundPlugin: ApiPlaygroundPlugin;
    private snapshotPlugin: SnapshotPlugin;
    private ribbonPlugin: RibbonPlugin;
    private updateContentPlugin: UpdateContentPlugin;

    private sidePane = React.createRef<SidePane>();

    constructor(props: {}) {
        super(props);

        this.formatStatePlugin = new FormatStatePlugin();
        this.editorOptionPlugin = new EditorOptionsPlugin();
        this.eventViewPlugin = new EventViewPlugin();
        this.apiPlaygroundPlugin = new ApiPlaygroundPlugin();
        this.snapshotPlugin = new SnapshotPlugin();
        this.ribbonPlugin = new RibbonPlugin();
        this.updateContentPlugin = new UpdateContentPlugin(
            UpdateMode.OnDispose | UpdateMode.OnInitialize,
            this.onUpdate
        );
        this.state = {
            showSidePane: window.location.hash != '',
            showRibbon: true,
            isPopoutShown: false,
            initState: this.editorOptionPlugin.getBuildInPluginState(),
            supportDarkMode: true,
            scale: 1,
            isDarkMode: false,
            content: '',
            editorCreator: null,
        };
    }

    render() {
        return (
            <div className={styles.mainPane}>
                <TitleBar className={styles.noGrow} />
                {this.state.showRibbon && !this.state.isPopoutShown && this.renderRibbon()}
                <div className={styles.body}>
                    {this.state.isPopoutShown ? this.renderPopout() : this.renderMainPane()}
                </div>
            </div>
        );
    }

    resetEditorPlugin(pluginState: BuildInPluginState) {
        this.updateContentPlugin.forceUpdate();
        this.setState({
            initState: pluginState,
        });

        this.resetEditor();
    }

    updateFormatState() {
        this.formatStatePlugin.updateFormatState();
    }

    setIsRibbonShown(isShown: boolean) {
        this.setState({
            showRibbon: isShown,
        });
    }

    setIsDarkModeSupported(isSupported: boolean) {
        this.setState({
            supportDarkMode: isSupported,
        });
    }

    isDarkModeSupported() {
        return this.state.supportDarkMode;
    }

    popout() {
        this.updateContentPlugin.forceUpdate();

        const win = window.open(POPOUT_URL, POPOUT_TARGET, POPOUT_FEATURES);
        win.document.write(trustedHTMLHandler(POPOUT_HTML));
        win.addEventListener('unload', () => {
            this.updateContentPlugin.forceUpdate();

            if (this.popoutRoot) {
                ReactDom.unmountComponentAtNode(this.popoutRoot);
            }
            window.setTimeout(() => {
                this.setState({ isPopoutShown: false });
            }, 100);
        });

        let styles = document.getElementsByTagName('STYLE');
        for (let i = 0; i < styles.length; i++) {
            win.document.head.appendChild(styles[i].cloneNode(true));
        }

        this.popoutRoot = win.document.getElementById(PopoutRoot);

        this.setState({
            isPopoutShown: true,
        });
    }

    setScale(scale: number): void {
        this.setState({
            scale: scale,
        });
    }

    toggleDarkMode(): void {
        this.setState({
            isDarkMode: !this.state.isDarkMode,
        });
    }

    private onMouseDown = (e: React.MouseEvent<EventTarget>) => {
        document.addEventListener('mousemove', this.onMouseMove, true);
        document.addEventListener('mouseup', this.onMouseUp, true);
        document.body.style.userSelect = 'none';
        this.mouseX = e.pageX;
    };

    private onMouseMove = (e: MouseEvent) => {
        this.sidePane.current.changeWidth(this.mouseX - e.pageX);
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
        this.resetEditor();
    };

    private onHideSidePane = () => {
        this.setState({
            showSidePane: false,
        });
        this.resetEditor();
        window.location.hash = '';
    };

    private onUpdate = (content: string) => {
        this.setState({ content });
    };

    private renderRibbon() {
        return (
            <Ribbon
                plugin={this.ribbonPlugin}
                className={styles.noGrow}
                ref={this.ribbonPlugin.refCallback}
            />
        );
    }

    private renderPopout() {
        return (
            <>
                {this.renderSidePane(true /*fullWidth*/)}
                {ReactDom.createPortal(
                    <div className={styles.mainPane}>
                        {this.renderRibbon()}
                        <div className={styles.body}>{this.renderEditor()}</div>
                    </div>,
                    this.popoutRoot
                )}
            </>
        );
    }

    private renderMainPane() {
        return (
            <>
                {this.renderEditor()}
                {this.state.showSidePane ? (
                    <>
                        <div className={styles.resizer} onMouseDown={this.onMouseDown} />
                        {this.renderSidePane(false /*fullWidth*/)}
                        {this.renderSidePaneButton()}
                    </>
                ) : (
                    this.renderSidePaneButton()
                )}
            </>
        );
    }

    private renderSidePane(fullWidth: boolean) {
        return (
            <SidePane
                ref={this.sidePane}
                plugins={this.getSidePanePlugins()}
                className={`main-pane ${styles.sidePane} ${
                    fullWidth ? styles.sidePaneFullWidth : ''
                }`}
            />
        );
    }

    private renderEditor() {
        const allPlugins = getToggleablePlugins(this.state.initState).concat(this.getPlugins());
        const editorStyles = {
            transform: `scale(${this.state.scale})`,
            transformOrigin: 'left top',
            height: `calc(${100 / this.state.scale}%)`,
            width: `calc(${100 / this.state.scale}%)`,
        };

        return (
            <div className={styles.editorContainer}>
                <div style={editorStyles}>
                    <Rooster
                        domAttributes={{ className: styles.editor }}
                        editorOptions={{
                            plugins: allPlugins,
                            defaultFormat: this.state.initState.defaultFormat,
                            inDarkMode: this.state.isDarkMode,
                            getDarkColor: getDarkColor,
                            experimentalFeatures: this.state.initState.experimentalFeatures,
                            undoSnapshotService: this.snapshotPlugin.getSnapshotService(),
                            trustedHTMLHandler: trustedHTMLHandler,
                            zoomScale: this.state.scale,
                            initialContent: this.state.content,
                        }}
                        editorCreator={this.state.editorCreator}
                    />
                </div>
            </div>
        );
    }

    private renderSidePaneButton() {
        return (
            <button
                className={`side-pane-toggle ${this.state.showSidePane ? 'open' : 'close'} ${
                    styles.showSidePane
                }`}
                onClick={this.state.showSidePane ? this.onHideSidePane : this.onShowSidePane}>
                <div>{this.state.showSidePane ? 'Hide side pane' : 'Show side pane'}</div>
            </button>
        );
    }

    private getSidePanePlugins() {
        return [
            this.formatStatePlugin,
            this.editorOptionPlugin,
            this.eventViewPlugin,
            this.apiPlaygroundPlugin,
            this.snapshotPlugin,
        ];
    }

    private getPlugins() {
        return this.state.showSidePane || this.state.isPopoutShown
            ? [this.ribbonPlugin, ...this.getSidePanePlugins(), this.updateContentPlugin]
            : [this.ribbonPlugin, this.updateContentPlugin];
    }

    private resetEditor() {
        this.setState({
            editorCreator: (div: HTMLDivElement, options: EditorOptions) =>
                new Editor(div, options),
        });
    }
}

export function mount(parent: HTMLElement) {
    ReactDom.render(<MainPane />, parent);
}
