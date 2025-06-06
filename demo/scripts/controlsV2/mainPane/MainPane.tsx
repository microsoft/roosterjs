import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SampleEntityPlugin from '../plugins/SampleEntityPlugin';
import { ApiPlaygroundPlugin } from '../sidePane/apiPlayground/ApiPlaygroundPlugin';
import { ContentModelPanePlugin } from '../sidePane/contentModel/ContentModelPanePlugin';
import { darkModeButton } from '../demoButtons/darkModeButton';
import { defaultDomToModelOption } from '../options/defaultDomToModelOption';
import { Editor } from 'roosterjs-content-model-core';
import { EditorOptionsPlugin } from '../sidePane/editorOptions/EditorOptionsPlugin';
import { EventViewPlugin } from '../sidePane/eventViewer/EventViewPlugin';
import { exportContentButton } from '../demoButtons/exportContentButton';
import { FormatPainterPlugin } from '../plugins/FormatPainterPlugin';
import { FormatStatePlugin } from '../sidePane/formatState/FormatStatePlugin';
import { getButtons } from '../tabs/ribbonButtons';
import { getDarkColor } from 'roosterjs-color-utils';
import { getPresetModelById } from '../sidePane/presets/allPresets/allPresets';
import { getTabs, tabNames } from '../tabs/getTabs';
import { getTheme } from '../theme/themes';
import { MarkdownPanePlugin } from '../sidePane/MarkdownPane/MarkdownPanePlugin';
import { OptionState, UrlPlaceholder } from '../sidePane/editorOptions/OptionState';
import { popoutButton } from '../demoButtons/popoutButton';
import { PresetPlugin } from '../sidePane/presets/PresetPlugin';
import { registerWindowForCss, unregisterWindowForCss } from '../../utils/cssMonitor';
import { SamplePickerPlugin } from '../plugins/SamplePickerPlugin';
import { SidePane } from '../sidePane/SidePane';
import { SidePanePlugin } from '../sidePane/SidePanePlugin';
import { SnapshotPlugin } from '../sidePane/snapshot/SnapshotPlugin';
import { ThemeProvider } from '@fluentui/react/lib/Theme';
import { TitleBar } from '../titleBar/TitleBar';
import { trustedHTMLHandler } from '../../utils/trustedHTMLHandler';
import { undeletableLinkChecker } from '../options/demoUndeletableAnchorParser';
import { UpdateContentPlugin } from '../plugins/UpdateContentPlugin';
import { WindowProvider } from '@fluentui/react/lib/WindowProvider';
import { zoomButton } from '../demoButtons/zoomButton';
import type { RibbonButton, RibbonPlugin } from 'roosterjs-react';
import {
    createContextMenuPlugin,
    createEmojiPlugin,
    createImageEditMenuProvider,
    createListEditMenuProvider,
    createPasteOptionPlugin,
    createRibbonPlugin,
    createTableEditMenuProvider,
    redoButton,
    Rooster,
    undoButton,
    Ribbon,
} from 'roosterjs-react';
import {
    Border,
    Colors,
    ContentModelDocument,
    EditorOptions,
    EditorPlugin,
    IEditor,
    KnownAnnounceStrings,
    Snapshots,
} from 'roosterjs-content-model-types';
import {
    AutoFormatPlugin,
    CustomReplacePlugin,
    EditPlugin,
    HiddenPropertyPlugin,
    HyperlinkPlugin,
    ImageEditPlugin,
    MarkdownPlugin,
    PastePlugin,
    ShortcutPlugin,
    TableEditPlugin,
    WatermarkPlugin,
} from 'roosterjs-content-model-plugins';
import DOMPurify = require('dompurify');

const styles = require('./MainPane.scss');

export interface MainPaneState {
    showSidePane: boolean;
    popoutWindow: Window;
    initState: OptionState;
    scale: number;
    isDarkMode: boolean;
    isRtl: boolean;
    activeTab: tabNames;
    tableBorderFormat?: Border;
    editorCreator: (div: HTMLDivElement, options: EditorOptions) => IEditor;
}

const PopoutRoot = 'mainPane';
const POPOUT_HTML = `<!doctype html><html><head><title>RoosterJs Demo Site</title></head><body><div id=${PopoutRoot}></div></body></html>`;
const POPOUT_FEATURES = 'menubar=no,statusbar=no,width=1200,height=800';
const POPOUT_URL = 'about:blank';
const POPOUT_TARGET = '_blank';

export class MainPane extends React.Component<{}, MainPaneState> {
    private mouseX: number;
    private static instance: MainPane;
    private popoutRoot: HTMLElement;
    private formatStatePlugin: FormatStatePlugin;
    private editorOptionPlugin: EditorOptionsPlugin;
    private eventViewPlugin: EventViewPlugin;
    private apiPlaygroundPlugin: ApiPlaygroundPlugin;
    private contentModelPanePlugin: ContentModelPanePlugin;
    private presetPlugin: PresetPlugin;
    private ribbonPlugin: RibbonPlugin;
    private snapshotPlugin: SnapshotPlugin;
    private formatPainterPlugin: FormatPainterPlugin;
    private samplePickerPlugin: SamplePickerPlugin;
    private snapshots: Snapshots;
    private imageEditPlugin: ImageEditPlugin;
    private markdownPanePlugin: MarkdownPanePlugin;

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
        this.presetPlugin = new PresetPlugin();
        this.ribbonPlugin = createRibbonPlugin();
        this.formatPainterPlugin = new FormatPainterPlugin();
        this.samplePickerPlugin = new SamplePickerPlugin();
        this.imageEditPlugin = new ImageEditPlugin();
        this.markdownPanePlugin = new MarkdownPanePlugin();

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
            activeTab: 'all',
        };
    }

    render() {
        const theme = getTheme(this.state.isDarkMode);
        return (
            <ThemeProvider applyTo="body" theme={theme} className={styles.mainPane}>
                {this.renderTitleBar()}
                {!this.state.popoutWindow && this.renderTabs()}
                {!this.state.popoutWindow && this.renderRibbon()}
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
        win.document.write(
            (DOMPurify.sanitize(POPOUT_HTML, {
                ADD_TAGS: ['head', 'meta', 'iframe'],
                ADD_ATTR: ['name', 'content'],
                WHOLE_DOCUMENT: true,
                ALLOW_UNKNOWN_PROTOCOLS: true,
                RETURN_TRUSTED_TYPE: true,
            }) as any) as string
        );
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

    changeRibbon(id: tabNames): void {
        this.setState({
            activeTab: id,
        });
    }

    setPreset(preset: ContentModelDocument) {
        this.model = preset;
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

    private renderTabs() {
        const tabs = getTabs();
        const topRightButtons: RibbonButton<any>[] = [
            undoButton,
            redoButton,
            zoomButton,
            darkModeButton,
            exportContentButton,
        ];
        this.state.popoutWindow ? null : topRightButtons.push(popoutButton);

        return (
            <div
                style={{ display: 'inline-flex', justifyContent: 'space-between', height: '30px' }}>
                <Ribbon
                    buttons={tabs}
                    plugin={this.ribbonPlugin}
                    dir={this.state.isRtl ? 'rtl' : 'ltr'}></Ribbon>
                <Ribbon buttons={topRightButtons} plugin={this.ribbonPlugin}></Ribbon>
            </div>
        );
    }
    private renderRibbon() {
        return (
            <Ribbon
                buttons={getButtons(
                    this.state.activeTab,
                    this.formatPainterPlugin,
                    this.imageEditPlugin
                )}
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

    private resetEditor() {
        this.setState({
            editorCreator: (div: HTMLDivElement, options: EditorOptions) => {
                return new Editor(div, options);
            },
        });
    }

    private renderEditor() {
        // Set preset if found
        const search = new URLSearchParams(document.location.search);
        const hasPreset = search.get('preset');
        if (hasPreset) {
            this.setPreset(getPresetModelById(hasPreset));
        }

        const editorStyles = {
            transform: `scale(${this.state.scale})`,
            transformOrigin: this.state.isRtl ? 'right top' : 'left top',
            height: `calc(${100 / this.state.scale}%)`,
            width: `calc(${100 / this.state.scale}%)`,
        };
        const plugins: EditorPlugin[] = [
            this.ribbonPlugin,
            this.formatPainterPlugin,
            this.samplePickerPlugin,
            ...this.getToggleablePlugins(),
            this.contentModelPanePlugin.getInnerRibbonPlugin(),
            this.updateContentPlugin,
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
                            disableCache={this.state.initState.disableCache}
                            announcerStringGetter={getAnnouncingString}
                            experimentalFeatures={Array.from(
                                this.state.initState.experimentalFeatures
                            )}
                            defaultDomToModelOptions={defaultDomToModelOption}
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
                                {this.renderTabs()}
                                {this.renderRibbon()}
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
            this.presetPlugin,
            this.markdownPanePlugin,
        ];
    }

    private getToggleablePlugins(): EditorPlugin[] {
        const {
            pluginList,
            allowExcelNoBorderTable,
            listMenu,
            tableMenu,
            imageMenu,
            watermarkText,
            markdownOptions,
            autoFormatOptions,
            linkTitle,
            customReplacements,
            editPluginOptions,
        } = this.state.initState;
        return [
            pluginList.autoFormat && new AutoFormatPlugin(autoFormatOptions),
            pluginList.edit && new EditPlugin(editPluginOptions),
            pluginList.paste && new PastePlugin(allowExcelNoBorderTable),
            pluginList.shortcut && new ShortcutPlugin(),
            pluginList.tableEdit && new TableEditPlugin(),
            pluginList.watermark && new WatermarkPlugin(watermarkText),
            pluginList.markdown && new MarkdownPlugin(markdownOptions),
            pluginList.imageEditPlugin && this.imageEditPlugin,
            pluginList.emoji && createEmojiPlugin(),
            pluginList.pasteOption && createPasteOptionPlugin(),
            pluginList.sampleEntity && new SampleEntityPlugin(),
            pluginList.contextMenu && createContextMenuPlugin(),
            pluginList.contextMenu && listMenu && createListEditMenuProvider(),
            pluginList.contextMenu && tableMenu && createTableEditMenuProvider(),
            pluginList.contextMenu &&
                imageMenu &&
                createImageEditMenuProvider(this.imageEditPlugin),
            pluginList.hyperlink &&
                new HyperlinkPlugin(
                    linkTitle?.indexOf(UrlPlaceholder) >= 0
                        ? url => linkTitle.replace(UrlPlaceholder, url)
                        : linkTitle
                ),
            pluginList.customReplace && new CustomReplacePlugin(customReplacements),
            pluginList.hiddenProperty &&
                new HiddenPropertyPlugin({
                    undeletableLinkChecker: undeletableLinkChecker,
                }),
        ].filter(x => !!x);
    }
}

const AnnounceStringMap: Record<KnownAnnounceStrings, string> = {
    announceListItemBullet: 'Auto corrected Bullet',
    announceListItemNumbering: 'Auto corrected {0}',
    announceOnFocusLastCell: 'Warning, pressing tab here adds an extra row.',
};

function getAnnouncingString(key: KnownAnnounceStrings) {
    return AnnounceStringMap[key];
}

export function mount(parent: HTMLElement) {
    ReactDOM.render(<MainPane />, parent);
}
