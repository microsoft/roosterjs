import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ApiPlaygroundPlugin } from '../sidePane/apiPlayground/ApiPlaygroundPlugin';
import { Border, ContentModelDocument, EditorOptions } from 'roosterjs-content-model-types';
import { buttons, buttonsWithPopout } from './ribbonButtons';
import { Colors, EditorPlugin, IEditor, Snapshots } from 'roosterjs-content-model-types';
import { ContentModelPanePlugin } from '../sidePane/contentModel/ContentModelPanePlugin';
import { createEmojiPlugin } from '../roosterjsReact/emoji';
import { createImageEditMenuProvider } from '../roosterjsReact/contextMenu/menus/createImageEditMenuProvider';
import { createListEditMenuProvider } from '../roosterjsReact/contextMenu/menus/createListEditMenuProvider';
import { createPasteOptionPlugin } from '../roosterjsReact/pasteOptions';
import { createRibbonPlugin, Ribbon, RibbonPlugin } from '../roosterjsReact/ribbon';
import { Editor } from 'roosterjs-content-model-core';
import { EditorOptionsPlugin } from '../sidePane/editorOptions/EditorOptionsPlugin';
import { EventViewPlugin } from '../sidePane/eventViewer/EventViewPlugin';
import { FormatPainterPlugin } from '../plugins/FormatPainterPlugin';
import { FormatStatePlugin } from '../sidePane/formatState/FormatStatePlugin';
import { getDarkColor } from 'roosterjs-color-utils';
import { getTheme } from '../theme/themes';
import { OptionState } from '../sidePane/editorOptions/OptionState';
import { registerWindowForCss, unregisterWindowForCss } from '../../utils/cssMonitor';
import { Rooster } from '../roosterjsReact/rooster';
import { SidePane } from '../sidePane/SidePane';
import { SidePanePlugin } from '../sidePane/SidePanePlugin';
import { SnapshotPlugin } from '../sidePane/snapshot/SnapshotPlugin';
import { ThemeProvider } from '@fluentui/react/lib/Theme';
import { TitleBar } from '../titleBar/TitleBar';
import { trustedHTMLHandler } from '../../utils/trustedHTMLHandler';
import { UpdateContentPlugin } from '../plugins/UpdateContentPlugin';
import { WindowProvider } from '@fluentui/react/lib/WindowProvider';
import {
    createContextMenuPlugin,
    createTableEditMenuProvider,
} from '../roosterjsReact/contextMenu';
import {
    AutoFormatPlugin,
    EditPlugin,
    PastePlugin,
    ShortcutPlugin,
} from 'roosterjs-content-model-plugins';

const styles = require('./MainPane.scss');

export interface MainPaneState {
    showSidePane: boolean;
    popoutWindow: Window;
    initState: OptionState;
    scale: number;
    isDarkMode: boolean;
    isRtl: boolean;
    tableBorderFormat?: Border;
    editorCreator: (div: HTMLDivElement, options: EditorOptions) => IEditor;
}

const PopoutRoot = 'mainPane';
const POPOUT_HTML = `<!doctype html><html><head><title>RoosterJs Demo Site</title></head><body><div id=${PopoutRoot}></div></body></html>`;
const POPOUT_FEATURES = 'menubar=no,statusbar=no,width=1200,height=800';
const POPOUT_URL = 'about:blank';
const POPOUT_TARGET = '_blank';

// Pending tasks:
// sample entity
// More options
// toggleable plugins
// Support legacy plugins
// Generate code
// Ribbon tabs

export class MainPane extends React.Component<{}, MainPaneState> {
    private mouseX: number;
    private static instance: MainPane;
    private popoutRoot: HTMLElement;
    private formatStatePlugin: FormatStatePlugin;
    private editorOptionPlugin: EditorOptionsPlugin;
    private eventViewPlugin: EventViewPlugin;
    private apiPlaygroundPlugin: ApiPlaygroundPlugin;
    private contentModelPanePlugin: ContentModelPanePlugin;
    private editPlugin: EditPlugin;
    private autoFormatPlugin: AutoFormatPlugin;
    private shortcutPlugin: ShortcutPlugin;
    private ribbonPlugin: RibbonPlugin;
    private snapshotPlugin: SnapshotPlugin;
    private formatPainterPlugin: FormatPainterPlugin;
    private pastePlugin: PastePlugin;
    private listMenuPlugin: EditorPlugin;
    private tableMenuPlugin: EditorPlugin;
    private imageMenuPlugin: EditorPlugin;
    private contextMenuPlugin: EditorPlugin;
    private pasteOptionPlugin: EditorPlugin;
    private emojiPlugin: EditorPlugin;
    private snapshots: Snapshots;

    protected sidePane = React.createRef<SidePane>();
    protected updateContentPlugin: UpdateContentPlugin;
    protected model: ContentModelDocument | null = null;
    private knownColors: Record<string, Colors> = {};
    protected themeMatch = window.matchMedia?.('(prefers-color-scheme: dark)');

    static getInstance() {
        return this.instance;
    }

    static readonly editorDivId = 'RoosterJsContentDiv';

    constructor(props: {}) {
        super(props);

        MainPane.instance = this;
        this.updateContentPlugin = new UpdateContentPlugin(this.onUpdate);

        this.snapshots = {
            snapshots: [],
            totalSize: 0,
            currentIndex: -1,
            autoCompleteIndex: -1,
            maxSize: 1e7,
        };

        this.formatStatePlugin = new FormatStatePlugin();
        this.editorOptionPlugin = new EditorOptionsPlugin();
        this.eventViewPlugin = new EventViewPlugin();
        this.apiPlaygroundPlugin = new ApiPlaygroundPlugin();
        this.snapshotPlugin = new SnapshotPlugin(this.snapshots);
        this.contentModelPanePlugin = new ContentModelPanePlugin();
        this.editPlugin = new EditPlugin();
        this.autoFormatPlugin = new AutoFormatPlugin();
        this.shortcutPlugin = new ShortcutPlugin();
        this.ribbonPlugin = createRibbonPlugin();
        this.formatPainterPlugin = new FormatPainterPlugin();
        this.pastePlugin = new PastePlugin();
        this.contextMenuPlugin = createContextMenuPlugin();
        this.listMenuPlugin = createListEditMenuProvider();
        this.tableMenuPlugin = createTableEditMenuProvider();
        this.imageMenuPlugin = createImageEditMenuProvider();
        this.pasteOptionPlugin = createPasteOptionPlugin();
        this.emojiPlugin = createEmojiPlugin();
        // this.sampleEntityPlugin = new SampleEntityPlugin();
        this.state = {
            showSidePane: window.location.hash != '',
            popoutWindow: null,
            initState: this.editorOptionPlugin.getBuildInPluginState(),
            scale: 1,
            isDarkMode: this.themeMatch?.matches || false,
            editorCreator: null,
            isRtl: false,
            tableBorderFormat: {
                width: '1px',
                style: 'solid',
                color: '#ABABAB',
            },
        };
    }

    render() {
        return (
            <ThemeProvider
                applyTo="body"
                theme={getTheme(this.state.isDarkMode)}
                className={styles.mainPane}>
                {this.renderTitleBar()}
                {!this.state.popoutWindow && this.renderRibbon(false /*isPopout*/)}
                <div className={styles.body + ' ' + (this.state.isDarkMode ? 'dark' : '')}>
                    {this.state.popoutWindow ? this.renderPopout() : this.renderMainPane()}
                </div>
            </ThemeProvider>
        );
    }

    componentDidMount() {
        this.themeMatch?.addEventListener('change', this.onThemeChange);
        this.resetEditor();
    }

    componentWillUnmount() {
        this.themeMatch?.removeEventListener('change', this.onThemeChange);
    }

    popout() {
        this.updateContentPlugin.update();

        const win = window.open(POPOUT_URL, POPOUT_TARGET, POPOUT_FEATURES);
        win.document.write(trustedHTMLHandler(POPOUT_HTML));
        win.addEventListener('beforeunload', () => {
            this.updateContentPlugin.update();

            unregisterWindowForCss(win);
            this.setState({ popoutWindow: null });
        });

        registerWindowForCss(win);

        this.popoutRoot = win.document.getElementById(PopoutRoot);
        this.setState({
            popoutWindow: win,
        });
    }

    resetEditorPlugin(pluginState: OptionState) {
        this.updateContentPlugin.update();
        this.setState({
            initState: pluginState,
        });
        this.resetEditor();
    }

    setScale(scale: number): void {
        this.setState({
            scale: scale,
        });
    }

    getTableBorder(): Border {
        return this.state.tableBorderFormat;
    }

    setTableBorderColor(color: string): void {
        this.setState({
            tableBorderFormat: { ...this.getTableBorder(), color },
        });
    }

    setTableBorderWidth(width: string): void {
        this.setState({
            tableBorderFormat: { ...this.getTableBorder(), width },
        });
    }

    setTableBorderStyle(style: string): void {
        this.setState({
            tableBorderFormat: { ...this.getTableBorder(), style },
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

    private renderTitleBar() {
        return <TitleBar className={styles.noGrow} />;
    }

    private renderRibbon(isPopout: boolean) {
        return (
            <Ribbon
                buttons={isPopout ? buttons : buttonsWithPopout}
                plugin={this.ribbonPlugin}
                dir={this.state.isRtl ? 'rtl' : 'ltr'}
            />
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

    // private getPlugins() {
    //     // this.toggleablePlugins =
    //     //     this.toggleablePlugins || getToggleablePlugins(this.state.initState);

    //     const plugins: LegacyEditorPlugin[] = [
    //         // ...this.toggleablePlugins,
    //         // this.pasteOptionPlugin,
    //         // this.emojiPlugin,
    //         // this.sampleEntityPlugin,
    //     ];

    //     return plugins;
    // }

    private resetEditor() {
        // this.toggleablePlugins = null;
        this.setState({
            editorCreator: (div: HTMLDivElement, options: EditorOptions) =>
                new Editor(div, {
                    ...options,
                    cacheModel: true,
                }),
        });
    }

    private renderEditor() {
        // const allPlugins = this.getPlugins();
        const editorStyles = {
            transform: `scale(${this.state.scale})`,
            transformOrigin: this.state.isRtl ? 'right top' : 'left top',
            height: `calc(${100 / this.state.scale}%)`,
            width: `calc(${100 / this.state.scale}%)`,
        };
        const plugins: EditorPlugin[] = [
            this.ribbonPlugin,
            this.formatPainterPlugin,
            this.pastePlugin,
            this.autoFormatPlugin,
            this.shortcutPlugin,
            this.editPlugin,
            this.contentModelPanePlugin.getInnerRibbonPlugin(),
            this.updateContentPlugin,
            this.contextMenuPlugin,
            this.listMenuPlugin,
            this.tableMenuPlugin,
            this.imageMenuPlugin,
            this.pasteOptionPlugin,
            this.emojiPlugin,
        ];

        if (this.state.showSidePane || this.state.popoutWindow) {
            plugins.push(...this.getSidePanePlugins());
        }

        this.updateContentPlugin.update();

        return (
            <div className={styles.editorContainer} id="EditorContainer">
                <div style={editorStyles}>
                    {this.state.editorCreator && (
                        <Rooster
                            id={MainPane.editorDivId}
                            className={styles.editor}
                            // legacyPlugins={allPlugins}
                            plugins={plugins}
                            defaultSegmentFormat={this.state.initState.defaultFormat}
                            inDarkMode={this.state.isDarkMode}
                            getDarkColor={getDarkColor}
                            snapshots={this.snapshotPlugin.getSnapshots()}
                            trustedHTMLHandler={trustedHTMLHandler}
                            initialModel={this.model}
                            editorCreator={this.state.editorCreator}
                            dir={this.state.isRtl ? 'rtl' : 'ltr'}
                            knownColors={this.knownColors}
                        />
                    )}
                </div>
            </div>
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

    private renderPopout() {
        return (
            <>
                {this.renderSidePane(true /*fullWidth*/)}
                {ReactDOM.createPortal(
                    <WindowProvider window={this.state.popoutWindow}>
                        <ThemeProvider applyTo="body" theme={getTheme(this.state.isDarkMode)}>
                            <div className={styles.mainPane}>
                                {this.renderRibbon(true /*isPopout*/)}
                                <div className={styles.body}>{this.renderEditor()}</div>
                            </div>
                        </ThemeProvider>
                    </WindowProvider>,
                    this.popoutRoot
                )}
            </>
        );
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

    private onUpdate = (model: ContentModelDocument) => {
        this.model = model;
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

    private onThemeChange = () => {
        this.setState({
            isDarkMode: this.themeMatch?.matches || false,
        });
    };

    private getSidePanePlugins(): SidePanePlugin[] {
        return [
            this.formatStatePlugin,
            this.editorOptionPlugin,
            this.eventViewPlugin,
            this.apiPlaygroundPlugin,
            this.snapshotPlugin,
            this.contentModelPanePlugin,
        ];
    }
}

export function mount(parent: HTMLElement) {
    ReactDOM.render(<MainPane />, parent);
}
