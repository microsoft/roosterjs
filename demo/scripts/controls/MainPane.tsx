import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ApiPlaygroundPlugin from './sidePane/apiPlayground/ApiPlaygroundPlugin';
import BuildInPluginState from './BuildInPluginState';
import ContentModelPlugin from './sidePane/contentModel/ContentModelPlugin';
import EditorOptionsPlugin from './sidePane/editorOptions/EditorOptionsPlugin';
import EventViewPlugin from './sidePane/eventViewer/EventViewPlugin';
import FormatStatePlugin from './sidePane/formatState/FormatStatePlugin';
import getToggleablePlugins from './getToggleablePlugins';
import MainPaneBase from './MainPaneBase';
import SidePane from './sidePane/SidePane';
import SnapshotPlugin from './sidePane/snapshot/SnapshotPlugin';
import TitleBar from './titleBar/TitleBar';
import { arrayPush } from 'roosterjs-editor-dom';
import { darkMode, DarkModeButtonStringKey } from './ribbonButtons/darkMode';
import { EditorOptions, EditorPlugin } from 'roosterjs-editor-types';
import { ExperimentalContentModelEditor } from 'roosterjs-content-model';
import { ExportButtonStringKey, exportContent } from './ribbonButtons/export';
import { formatTableButton } from './ribbonButtons/contentModel/formatTableButton';
import { getDarkColor } from 'roosterjs-color-utils';
import { insertTableButton } from './ribbonButtons/contentModel/insertTableButton';
import { PartialTheme, ThemeProvider } from '@fluentui/react/lib/Theme';
import { popout, PopoutButtonStringKey } from './ribbonButtons/popout';
import { registerWindowForCss, unregisterWindowForCss } from '../utils/cssMonitor';
import { setTableCellShadeButton } from './ribbonButtons/contentModel/setTableCellShadeButton';
import { trustedHTMLHandler } from '../utils/trustedHTMLHandler';
import { WindowProvider } from '@fluentui/react/lib/WindowProvider';
import { zoom, ZoomButtonStringKey } from './ribbonButtons/zoom';
import {
    tableAlignCellButton,
    tableAlignTableButton,
    tableDeleteButton,
    tableInsertButton,
    tableMergeButton,
    tableSplitButton,
} from './ribbonButtons/contentModel/tableEditButtons';
import {
    AllButtonStringKeys,
    createRibbonPlugin,
    createUpdateContentPlugin,
    getButtons,
    RibbonPlugin,
    Ribbon,
    RibbonButton,
    Rooster,
    UpdateContentPlugin,
    UpdateMode,
    AllButtonKeys,
    createPasteOptionPlugin,
    createEmojiPlugin,
} from 'roosterjs-react';

const styles = require('./MainPane.scss');
const PopoutRoot = 'mainPane';
const POPOUT_HTML = `<!doctype html><html><head><title>RoosterJs Demo Site</title></head><body><div id=${PopoutRoot}></div></body></html>`;
const POPOUT_FEATURES = 'menubar=no,statusbar=no,width=1200,height=800';
const POPOUT_URL = 'about:blank';
const POPOUT_TARGET = '_blank';

const LightTheme: PartialTheme = {
    palette: {
        themePrimary: '#0099aa',
        themeLighterAlt: '#f2fbfc',
        themeLighter: '#cbeef2',
        themeLight: '#a1dfe6',
        themeTertiary: '#52c0cd',
        themeSecondary: '#16a5b5',
        themeDarkAlt: '#008a9a',
        themeDark: '#007582',
        themeDarker: '#005660',
        neutralLighterAlt: '#faf9f8',
        neutralLighter: '#f3f2f1',
        neutralLight: '#edebe9',
        neutralQuaternaryAlt: '#e1dfdd',
        neutralQuaternary: '#d0d0d0',
        neutralTertiaryAlt: '#c8c6c4',
        neutralTertiary: '#a19f9d',
        neutralSecondary: '#605e5c',
        neutralPrimaryAlt: '#3b3a39',
        neutralPrimary: '#323130',
        neutralDark: '#201f1e',
        black: '#000000',
        white: '#ffffff',
    },
};

const DarkTheme: PartialTheme = {
    palette: {
        themePrimary: '#0091A1',
        themeLighterAlt: '#f1fafb',
        themeLighter: '#caecf0',
        themeLight: '#9fdce3',
        themeTertiary: '#4fbac6',
        themeSecondary: '#159dac',
        themeDarkAlt: '#008291',
        themeDark: '#006e7a',
        themeDarker: '#00515a',
        neutralLighterAlt: '#3c3c3c',
        neutralLighter: '#444444',
        neutralLight: '#515151',
        neutralQuaternaryAlt: '#595959',
        neutralQuaternary: '#5f5f5f',
        neutralTertiaryAlt: '#7a7a7a',
        neutralTertiary: '#c8c8c8',
        neutralSecondary: '#d0d0d0',
        neutralPrimaryAlt: '#dadada',
        neutralPrimary: '#ffffff',
        neutralDark: '#f4f4f4',
        black: '#f8f8f8',
        white: '#333333',
    },
};

type RibbonStringKeys =
    | AllButtonStringKeys
    | DarkModeButtonStringKey
    | ZoomButtonStringKey
    | ExportButtonStringKey
    | PopoutButtonStringKey;

class MainPane extends MainPaneBase {
    private mouseX: number;
    private popoutRoot: HTMLElement;
    private themeMatch = window.matchMedia?.('(prefers-color-scheme: dark)');

    private formatStatePlugin: FormatStatePlugin;
    private editorOptionPlugin: EditorOptionsPlugin;
    private eventViewPlugin: EventViewPlugin;
    private apiPlaygroundPlugin: ApiPlaygroundPlugin;
    private snapshotPlugin: SnapshotPlugin;
    private contentModelPlugin: ContentModelPlugin;
    private ribbonPlugin: RibbonPlugin;
    private contentModelRibbonPlugin: RibbonPlugin;
    private pasteOptionPlugin: EditorPlugin;
    private emojiPlugin: EditorPlugin;
    private updateContentPlugin: UpdateContentPlugin;
    private toggleablePlugins: EditorPlugin[] | null = null;
    private mainWindowButtons: RibbonButton<RibbonStringKeys>[];
    private popoutWindowButtons: RibbonButton<RibbonStringKeys>[];
    private contentModelRibbonButtons: RibbonButton<any>[] = [
        insertTableButton,
        formatTableButton,
        setTableCellShadeButton,
        tableInsertButton,
        tableDeleteButton,
        tableMergeButton,
        tableSplitButton,
        tableAlignCellButton,
        tableAlignTableButton,
    ];

    private content: string = '';

    private sidePane = React.createRef<SidePane>();

    constructor(props: {}) {
        super(props);

        this.formatStatePlugin = new FormatStatePlugin();
        this.editorOptionPlugin = new EditorOptionsPlugin();
        this.eventViewPlugin = new EventViewPlugin();
        this.apiPlaygroundPlugin = new ApiPlaygroundPlugin();
        this.snapshotPlugin = new SnapshotPlugin();
        this.contentModelPlugin = new ContentModelPlugin();
        this.ribbonPlugin = createRibbonPlugin();
        this.contentModelRibbonPlugin = createRibbonPlugin();
        this.pasteOptionPlugin = createPasteOptionPlugin();
        this.emojiPlugin = createEmojiPlugin();
        this.updateContentPlugin = createUpdateContentPlugin(UpdateMode.OnDispose, this.onUpdate);
        this.mainWindowButtons = getButtons([
            ...AllButtonKeys,
            darkMode,
            zoom,
            exportContent,
            popout,
        ]);
        this.popoutWindowButtons = getButtons([...AllButtonKeys, darkMode, zoom, exportContent]);
        this.state = {
            showSidePane: window.location.hash != '',
            popoutWindow: null,
            initState: this.editorOptionPlugin.getBuildInPluginState(),
            scale: 1,
            isDarkMode: this.themeMatch?.matches || false,
            editorCreator: null,
            isRtl: false,
            showContentModelRibbon: false,
        };
    }

    render() {
        return (
            <ThemeProvider
                applyTo="body"
                theme={this.state.isDarkMode ? DarkTheme : LightTheme}
                className={styles.mainPane}>
                <TitleBar className={styles.noGrow} />
                {!this.state.popoutWindow && this.renderRibbon(false /*isPopout*/)}
                {this.state.showContentModelRibbon && this.renderContentModelRibbon()}
                <div className={styles.body + ' ' + (this.state.isDarkMode ? 'dark' : '')}>
                    {this.state.popoutWindow ? this.renderPopout() : this.renderMainPane()}
                </div>
            </ThemeProvider>
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

    popout() {
        this.updateContentPlugin.forceUpdate();

        const win = window.open(POPOUT_URL, POPOUT_TARGET, POPOUT_FEATURES);
        win.document.write(trustedHTMLHandler(POPOUT_HTML));
        win.addEventListener('beforeunload', () => {
            this.updateContentPlugin.forceUpdate();

            unregisterWindowForCss(win);
            this.setState({ popoutWindow: null });
        });

        registerWindowForCss(win);

        this.popoutRoot = win.document.getElementById(PopoutRoot);
        this.setState({
            popoutWindow: win,
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

    setPageDirection(isRtl: boolean): void {
        this.setState({ isRtl: isRtl });
        [window, this.state.popoutWindow].forEach(win => {
            if (win) {
                win.document.body.dir = isRtl ? 'rtl' : 'ltr';
            }
        });
    }

    toggleContentModelRibbon(): void {
        this.setState({
            showContentModelRibbon: !this.state.showContentModelRibbon,
        });
    }

    componentDidMount() {
        this.themeMatch?.addEventListener('change', this.onThemeChange);
        this.resetEditor();
    }

    componentWillUnmount() {
        this.themeMatch?.removeEventListener('change', this.onThemeChange);
    }

    private onThemeChange = () => {
        this.setState({
            isDarkMode: this.themeMatch?.matches || false,
        });
    };

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
        this.content = content;
    };

    private renderRibbon(isPopout: boolean) {
        return (
            <Ribbon
                buttons={isPopout ? this.popoutWindowButtons : this.mainWindowButtons}
                plugin={this.ribbonPlugin}
                dir={this.state.isRtl ? 'rtl' : 'ltr'}
            />
        );
    }

    private renderContentModelRibbon() {
        return (
            <Ribbon
                buttons={this.contentModelRibbonButtons}
                plugin={this.contentModelRibbonPlugin}
                dir={this.state.isRtl ? 'rtl' : 'ltr'}
            />
        );
    }

    private renderPopout() {
        return (
            <>
                {this.renderSidePane(true /*fullWidth*/)}
                {ReactDOM.createPortal(
                    <WindowProvider window={this.state.popoutWindow}>
                        <ThemeProvider
                            applyTo="body"
                            theme={this.state.isDarkMode ? DarkTheme : LightTheme}>
                            <div className={styles.mainPane}>
                                {this.renderRibbon(true /*isPopout*/)}
                                {this.state.showContentModelRibbon &&
                                    this.renderContentModelRibbon()}
                                <div className={styles.body}>{this.renderEditor()}</div>
                            </div>
                        </ThemeProvider>
                    </WindowProvider>,
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
        const allPlugins = this.getPlugins();
        const editorStyles = {
            transform: `scale(${this.state.scale})`,
            transformOrigin: this.state.isRtl ? 'right top' : 'left top',
            height: `calc(${100 / this.state.scale}%)`,
            width: `calc(${100 / this.state.scale}%)`,
        };

        this.updateContentPlugin.forceUpdate();

        return (
            <div className={styles.editorContainer}>
                <div style={editorStyles}>
                    <Rooster
                        className={styles.editor}
                        plugins={allPlugins}
                        defaultFormat={this.state.initState.defaultFormat}
                        inDarkMode={this.state.isDarkMode}
                        getDarkColor={getDarkColor}
                        experimentalFeatures={this.state.initState.experimentalFeatures}
                        undoMetadataSnapshotService={this.snapshotPlugin.getSnapshotService()}
                        trustedHTMLHandler={trustedHTMLHandler}
                        zoomScale={this.state.scale}
                        initialContent={this.content}
                        editorCreator={this.state.editorCreator}
                        dir={this.state.isRtl ? 'rtl' : 'ltr'}
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
            this.contentModelPlugin,
        ];
    }

    private getPlugins() {
        this.toggleablePlugins =
            this.toggleablePlugins || getToggleablePlugins(this.state.initState);

        const plugins = [
            ...this.toggleablePlugins,
            this.ribbonPlugin,
            this.contentModelRibbonPlugin,
            this.pasteOptionPlugin,
            this.emojiPlugin,
        ];

        if (this.state.showSidePane || this.state.popoutWindow) {
            arrayPush(plugins, this.getSidePanePlugins());
        }

        plugins.push(this.updateContentPlugin);

        return plugins;
    }

    private resetEditor() {
        this.toggleablePlugins = null;
        this.setState({
            editorCreator: (div: HTMLDivElement, options: EditorOptions) =>
                new ExperimentalContentModelEditor(div, options),
        });
    }
}

export function mount(parent: HTMLElement) {
    ReactDOM.render(<MainPane />, parent);
}
