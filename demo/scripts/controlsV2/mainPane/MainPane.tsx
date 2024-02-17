import * as React from 'react';
import * as ReactDOM from 'react-dom';
import EventViewPlugin from '../sidePane/eventViewer/EventViewPlugin';
import FormatStatePlugin from '../sidePane/formatState/FormatStatePlugin';
import SidePane from '../sidePane/SidePane';
import SnapshotPlugin from '../sidePane/snapshot/SnapshotPlugin';
import TitleBar from '../titleBar/TitleBar';
import { alignCenterButton } from '../roosterjsReact/ribbon/buttons/alignCenterButton';
import { alignJustifyButton } from '../roosterjsReact/ribbon/buttons/alignJustifyButton';
import { alignLeftButton } from '../roosterjsReact/ribbon/buttons/alignLeftButton';
import { alignRightButton } from '../roosterjsReact/ribbon/buttons/alignRightButton';
import { ApiPlaygroundPlugin } from '../sidePane/apiPlayground/ApiPlaygroundPlugin';
import { AutoFormatPlugin, EditPlugin, PastePlugin } from 'roosterjs-content-model-plugins';
import { backgroundColorButton } from '../roosterjsReact/ribbon/buttons/backgroundColorButton';
import { blockQuoteButton } from '../roosterjsReact/ribbon/buttons/blockQuoteButton';
import { boldButton } from '../roosterjsReact/ribbon/buttons/boldButton';
import { Border, ContentModelDocument } from 'roosterjs-content-model-types';
import { bulletedListButton } from '../roosterjsReact/ribbon/buttons/bulletedListButton';
import { changeImageButton } from '../demoButtons/changeImageButton';
import { clearFormatButton } from '../roosterjsReact/ribbon/buttons/clearFormatButton';
import { codeButton } from '../roosterjsReact/ribbon/buttons/codeButton';
import { ContentModelPanePlugin } from '../sidePane/contentModel/ContentModelPanePlugin';
import { createRibbonPlugin, Ribbon, RibbonButton, RibbonPlugin } from '../roosterjsReact/ribbon';
import { darkMode } from '../demoButtons/darkMode';
import { decreaseFontSizeButton } from '../roosterjsReact/ribbon/buttons/decreaseFontSizeButton';
import { decreaseIndentButton } from '../roosterjsReact/ribbon/buttons/decreaseIndentButton';
import { EditorAdapter, EditorAdapterOptions } from 'roosterjs-editor-adapter';
import { exportContentButton } from '../demoButtons/exportContentButton';
import { fontButton } from '../roosterjsReact/ribbon/buttons/fontButton';
import { fontSizeButton } from '../roosterjsReact/ribbon/buttons/fontSizeButton';
import { formatPainterButton } from '../demoButtons/formatPainterButton';
import { FormatPainterPlugin } from '../plugins/FormatPainterPlugin';
import { formatTableButton } from '../demoButtons/formatTableButton';
import { getDarkColor } from 'roosterjs-color-utils';
import { imageBorderColorButton } from '../demoButtons/imageBorderColorButton';
import { imageBorderRemoveButton } from '../demoButtons/imageBorderRemoveButton';
import { imageBorderStyleButton } from '../demoButtons/imageBorderStyleButton';
import { imageBorderWidthButton } from '../demoButtons/imageBorderWidthButton';
import { imageBoxShadowButton } from '../demoButtons/imageBoxShadowButton';
import { increaseFontSizeButton } from '../roosterjsReact/ribbon/buttons/increaseFontSizeButton';
import { increaseIndentButton } from '../roosterjsReact/ribbon/buttons/increaseIndentButton';
import { insertImageButton } from '../roosterjsReact/ribbon/buttons/insertImageButton';
import { insertLinkButton } from '../roosterjsReact/ribbon/buttons/insertLinkButton';
import { insertTableButton } from '../roosterjsReact/ribbon/buttons/insertTableButton';
import { italicButton } from '../roosterjsReact/ribbon/buttons/italicButton';
import { listStartNumberButton } from '../demoButtons/listStartNumberButton';
import { ltrButton } from '../roosterjsReact/ribbon/buttons/ltrButton';
import { numberedListButton } from '../roosterjsReact/ribbon/buttons/numberedListButton';
import { PartialTheme, ThemeProvider } from '@fluentui/react/lib/Theme';
import { pasteButton } from '../demoButtons/pasteButton';
import { popoutButton } from '../demoButtons/popoutButton';
import { redoButton } from '../roosterjsReact/ribbon/buttons/redoButton';
import { registerWindowForCss, unregisterWindowForCss } from '../../utils/cssMonitor';
import { removeLinkButton } from '../roosterjsReact/ribbon/buttons/removeLinkButton';
import { Rooster } from '../roosterjsReact/rooster';
import { rtlButton } from '../roosterjsReact/ribbon/buttons/rtlButton';
import { setBulletedListStyleButton } from '../demoButtons/setBulletedListStyleButton';
import { setHeadingLevelButton } from '../roosterjsReact/ribbon/buttons/setHeadingLevelButton';
import { setNumberedListStyleButton } from '../demoButtons/setNumberedListStyleButton';
import { setTableCellShadeButton } from '../demoButtons/setTableCellShadeButton';
import { setTableHeaderButton } from '../demoButtons/setTableHeaderButton';
import { SidePanePlugin } from '../sidePane/SidePanePlugin';
import { spaceAfterButton, spaceBeforeButton } from '../demoButtons/spaceBeforeAfterButtons';
import { spacingButton } from '../demoButtons/spacingButton';
import { strikethroughButton } from '../roosterjsReact/ribbon/buttons/strikethroughButton';
import { subscriptButton } from '../roosterjsReact/ribbon/buttons/subscriptButton';
import { superscriptButton } from '../roosterjsReact/ribbon/buttons/superscriptButton';
import { tableBorderApplyButton } from '../demoButtons/tableBorderApplyButton';
import { tableBorderColorButton } from '../demoButtons/tableBorderColorButton';
import { tableBorderStyleButton } from '../demoButtons/tableBorderStyleButton';
import { tableBorderWidthButton } from '../demoButtons/tableBorderWidthButton';
import { textColorButton } from '../roosterjsReact/ribbon/buttons/textColorButton';
import { trustedHTMLHandler } from '../../utils/trustedHTMLHandler';
import { underlineButton } from '../roosterjsReact/ribbon/buttons/underlineButton';
import { undoButton } from '../roosterjsReact/ribbon/buttons/undoButton';
import { WindowProvider } from '@fluentui/react/lib/WindowProvider';
import { zoomButton } from '../demoButtons/zoomButton';
import {
    ContentModelSegmentFormat,
    EditorPlugin,
    IStandaloneEditor,
    Snapshots,
} from 'roosterjs-content-model-types';
// import { createEmojiPlugin, createPasteOptionPlugin } from 'roosterjs-react';
import {
    tableAlignCellButton,
    tableAlignTableButton,
    tableDeleteButton,
    tableInsertButton,
    tableMergeButton,
    tableSplitButton,
} from '../demoButtons/tableEditButtons';
// import SampleEntityPlugin from './sampleEntity/SampleEntityPlugin';import SidePane from '../sidePane/SidePane';
// import { createUpdateContentPlugin, UpdateContentPlugin, UpdateMode } from 'roosterjs-react';

const styles = require('./MainPane.scss');

export interface MainPaneBaseState {
    showSidePane: boolean;
    popoutWindow: Window;
    scale: number;
    isDarkMode: boolean;
    isRtl: boolean;
    tableBorderFormat?: Border;
    editorCreator: (div: HTMLDivElement, options: EditorAdapterOptions) => IStandaloneEditor;
}

const LightTheme: PartialTheme = {
    palette: {
        themePrimary: '#cc6688',
        themeLighterAlt: '#080405',
        themeLighter: '#211016',
        themeLight: '#3d1f29',
        themeTertiary: '#7a3d52',
        themeSecondary: '#b45a78',
        themeDarkAlt: '#d17392',
        themeDark: '#d886a1',
        themeDarker: '#e2a3b8',
        neutralLighterAlt: '#f8f8f8',
        neutralLighter: '#f4f4f4',
        neutralLight: '#eaeaea',
        neutralQuaternaryAlt: '#dadada',
        neutralQuaternary: '#d0d0d0',
        neutralTertiaryAlt: '#c8c8c8',
        neutralTertiary: '#595959',
        neutralSecondary: '#373737',
        neutralPrimaryAlt: '#2f2f2f',
        neutralPrimary: '#000000',
        neutralDark: '#151515',
        black: '#0b0b0b',
        white: '#ffffff',
    },
};

const DarkTheme: PartialTheme = {
    palette: {
        themePrimary: '#cb6587',
        themeLighterAlt: '#fdf8fa',
        themeLighter: '#f7e3ea',
        themeLight: '#f0ccd8',
        themeTertiary: '#e09db4',
        themeSecondary: '#d27694',
        themeDarkAlt: '#b85c7a',
        themeDark: '#9b4e67',
        themeDarker: '#72394c',
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

const buttons: RibbonButton<any>[] = [
    formatPainterButton,
    boldButton,
    italicButton,
    underlineButton,
    fontButton,
    fontSizeButton,
    increaseFontSizeButton,
    decreaseFontSizeButton,
    textColorButton,
    backgroundColorButton,
    bulletedListButton,
    numberedListButton,
    decreaseIndentButton,
    increaseIndentButton,
    blockQuoteButton,
    alignLeftButton,
    alignCenterButton,
    alignRightButton,
    alignJustifyButton,
    insertLinkButton,
    removeLinkButton,
    insertTableButton,
    insertImageButton,
    superscriptButton,
    subscriptButton,
    strikethroughButton,
    setHeadingLevelButton,
    codeButton,
    ltrButton,
    rtlButton,
    undoButton,
    redoButton,
    clearFormatButton,
    setBulletedListStyleButton,
    setNumberedListStyleButton,
    listStartNumberButton,
    formatTableButton,
    setTableCellShadeButton,
    setTableHeaderButton,
    tableInsertButton,
    tableDeleteButton,
    tableMergeButton,
    tableSplitButton,
    tableAlignCellButton,
    tableAlignTableButton,
    tableBorderApplyButton,
    tableBorderColorButton,
    tableBorderWidthButton,
    tableBorderStyleButton,
    imageBorderColorButton,
    imageBorderWidthButton,
    imageBorderStyleButton,
    imageBorderRemoveButton,
    changeImageButton,
    imageBoxShadowButton,
    spacingButton,
    spaceBeforeButton,
    spaceAfterButton,
    pasteButton,
    darkMode,
    zoomButton,
    exportContentButton,
];

const buttonsWithPopout = buttons.concat(popoutButton);

const PopoutRoot = 'mainPane';
const POPOUT_HTML = `<!doctype html><html><head><title>RoosterJs Demo Site</title></head><body><div id=${PopoutRoot}></div></body></html>`;
const POPOUT_FEATURES = 'menubar=no,statusbar=no,width=1200,height=800';
const POPOUT_URL = 'about:blank';
const POPOUT_TARGET = '_blank';

export class MainPane extends React.Component<{}, MainPaneBaseState> {
    private mouseX: number;
    private static instance: MainPane;
    private popoutRoot: HTMLElement;
    private formatStatePlugin: FormatStatePlugin;
    // private editorOptionPlugin: ContentModelEditorOptionsPlugin;
    private eventViewPlugin: EventViewPlugin;
    private apiPlaygroundPlugin: ApiPlaygroundPlugin;
    private contentModelPanePlugin: ContentModelPanePlugin;
    private editPlugin: EditPlugin;
    private autoFormatPlugin: AutoFormatPlugin;
    private ribbonPlugin: RibbonPlugin;
    // private pasteOptionPlugin: EditorPlugin;
    // private emojiPlugin: EditorPlugin;
    private snapshotPlugin: SnapshotPlugin;
    // private toggleablePlugins: EditorPlugin[] | null = null;
    private formatPainterPlugin: FormatPainterPlugin;
    private pastePlugin: PastePlugin;
    // private sampleEntityPlugin: SampleEntityPlugin;
    private snapshots: Snapshots;

    protected sidePane = React.createRef<SidePane>();
    // protected updateContentPlugin: UpdateContentPlugin;
    protected model: ContentModelDocument | null = null;
    protected themeMatch = window.matchMedia?.('(prefers-color-scheme: dark)');

    static getInstance() {
        return this.instance;
    }

    static readonly editorDivId = 'RoosterJsContentDiv';

    constructor(props: {}) {
        super(props);

        MainPane.instance = this;
        // this.updateContentPlugin = createUpdateContentPlugin(UpdateMode.OnDispose, this.onUpdate);

        this.snapshots = {
            snapshots: [],
            totalSize: 0,
            currentIndex: -1,
            autoCompleteIndex: -1,
            maxSize: 1e7,
        };

        this.formatStatePlugin = new FormatStatePlugin();
        // this.editorOptionPlugin = new ContentModelEditorOptionsPlugin();
        this.eventViewPlugin = new EventViewPlugin();
        this.apiPlaygroundPlugin = new ApiPlaygroundPlugin();
        this.snapshotPlugin = new SnapshotPlugin(this.snapshots);
        this.contentModelPanePlugin = new ContentModelPanePlugin();
        this.editPlugin = new EditPlugin();
        this.autoFormatPlugin = new AutoFormatPlugin();
        this.ribbonPlugin = createRibbonPlugin();
        // this.pasteOptionPlugin = createPasteOptionPlugin();
        // this.emojiPlugin = createEmojiPlugin();
        this.formatPainterPlugin = new FormatPainterPlugin();
        this.pastePlugin = new PastePlugin();
        // this.sampleEntityPlugin = new SampleEntityPlugin();
        this.state = {
            showSidePane: window.location.hash != '',
            popoutWindow: null,
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
                theme={this.getTheme(this.state.isDarkMode)}
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
        // this.updateContentPlugin.forceUpdate();

        const win = window.open(POPOUT_URL, POPOUT_TARGET, POPOUT_FEATURES);
        win.document.write(trustedHTMLHandler(POPOUT_HTML));
        win.addEventListener('beforeunload', () => {
            // this.updateContentPlugin.forceUpdate();

            unregisterWindowForCss(win);
            this.setState({ popoutWindow: null });
        });

        registerWindowForCss(win);

        this.popoutRoot = win.document.getElementById(PopoutRoot);
        this.setState({
            popoutWindow: win,
        });
    }

    resetEditorPlugin(pluginState: {}) {
        // this.updateContentPlugin.forceUpdate();
        this.setState({});

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

    //     // plugins.push(this.updateContentPlugin);

    //     return plugins;
    // }

    private resetEditor() {
        // this.toggleablePlugins = null;
        this.setState({
            editorCreator: (div: HTMLDivElement, options: EditorAdapterOptions) =>
                new EditorAdapter(div, {
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
        // const format = this.state.initState.defaultFormat;
        const defaultFormat: ContentModelSegmentFormat = {
            // fontWeight: format.bold ? 'bold' : undefined,
            // italic: format.italic || undefined,
            // underline: format.underline || undefined,
            // fontFamily: format.fontFamily || undefined,
            // fontSize: format.fontSize || undefined,
            // textColor: format.textColors?.lightModeColor || format.textColor || undefined,
            // backgroundColor:
            //     format.backgroundColors?.lightModeColor || format.backgroundColor || undefined,
        };

        const plugins: EditorPlugin[] = [
            this.ribbonPlugin,
            this.formatPainterPlugin,
            this.pastePlugin,
            this.autoFormatPlugin,
            this.editPlugin,
            this.contentModelPanePlugin.getInnerRibbonPlugin(),
        ];

        if (this.state.showSidePane || this.state.popoutWindow) {
            plugins.push(...this.getSidePanePlugins());
        }

        // this.updateContentPlugin.forceUpdate();

        return (
            <div className={styles.editorContainer} id="EditorContainer">
                <div style={editorStyles}>
                    {this.state.editorCreator && (
                        <Rooster
                            id={MainPane.editorDivId}
                            className={styles.editor}
                            // legacyPlugins={allPlugins}
                            plugins={plugins}
                            defaultSegmentFormat={defaultFormat}
                            inDarkMode={this.state.isDarkMode}
                            getDarkColor={getDarkColor}
                            snapshots={this.snapshotPlugin.getSnapshots()}
                            trustedHTMLHandler={trustedHTMLHandler}
                            // initialContent={this.content}
                            editorCreator={this.state.editorCreator}
                            dir={this.state.isRtl ? 'rtl' : 'ltr'}
                        />
                    )}
                </div>
            </div>
        );
    }

    private getTheme(isDark: boolean): PartialTheme {
        return isDark ? DarkTheme : LightTheme;
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
                        <ThemeProvider applyTo="body" theme={this.getTheme(this.state.isDarkMode)}>
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

    // private onUpdate = (content: string) => {
    //     this.content = content;
    // };

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
            // this.editorOptionPlugin,
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
