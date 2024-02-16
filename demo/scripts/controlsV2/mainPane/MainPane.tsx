import * as React from 'react';
import * as ReactDOM from 'react-dom';
import SidePane from '../sidePane/SidePane';
import TitleBar from '../titleBar/TitleBar';
import { alignCenterButton } from '../roosterjsReact/ribbon/buttons/alignCenterButton';
import { alignJustifyButton } from '../roosterjsReact/ribbon/buttons/alignJustifyButton';
import { alignLeftButton } from '../roosterjsReact/ribbon/buttons/alignLeftButton';
import { alignRightButton } from '../roosterjsReact/ribbon/buttons/alignRightButton';
import { AutoFormatPlugin, EditPlugin, PastePlugin } from 'roosterjs-content-model-plugins';
import { backgroundColorButton } from '../roosterjsReact/ribbon/buttons/backgroundColorButton';
import { blockQuoteButton } from '../roosterjsReact/ribbon/buttons/blockQuoteButton';
import { boldButton } from '../roosterjsReact/ribbon/buttons/boldButton';
import { bulletedListButton } from '../roosterjsReact/ribbon/buttons/bulletedListButton';
import { changeImageButton } from '../demoButtons/changeImageButton';
import { clearFormatButton } from '../roosterjsReact/ribbon/buttons/clearFormatButton';
import { codeButton } from '../roosterjsReact/ribbon/buttons/codeButton';
import { ContentModelSegmentFormat, IStandaloneEditor } from 'roosterjs-content-model-types';
import { createEmojiPlugin, createPasteOptionPlugin } from 'roosterjs-react';
import { createRibbonPlugin, Ribbon, RibbonButton, RibbonPlugin } from '../roosterjsReact/ribbon';
import { darkMode } from '../demoButtons/darkMode';
import { decreaseFontSizeButton } from '../roosterjsReact/ribbon/buttons/decreaseFontSizeButton';
import { decreaseIndentButton } from '../roosterjsReact/ribbon/buttons/decreaseIndentButton';
import { EditorAdapter, EditorAdapterOptions } from 'roosterjs-editor-adapter';
import { EditorPlugin } from 'roosterjs-editor-types';
import { exportContentButton } from '../demoButtons/exportButton';
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
import { MainPaneBase, MainPaneBaseState } from './MainPaneBase';
import { numberedListButton } from '../roosterjsReact/ribbon/buttons/numberedListButton';
import { PartialTheme } from '@fluentui/react/lib/Theme';
import { pasteButton } from '../demoButtons/pasteButton';
import { popoutButton } from '../demoButtons/popoutButton';
import { redoButton } from '../roosterjsReact/ribbon/buttons/redoButton';
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
import { zoomButton } from '../demoButtons/zoomButton';
import {
    tableAlignCellButton,
    tableAlignTableButton,
    tableDeleteButton,
    tableInsertButton,
    tableMergeButton,
    tableSplitButton,
} from '../demoButtons/tableEditButtons';
// import SampleEntityPlugin from './sampleEntity/SampleEntityPlugin';
// import ContentModelFormatPainterPlugin from './contentModel/plugins/ContentModelFormatPainterPlugin';
// import ContentModelSnapshotPlugin from './sidePane/snapshot/ContentModelSnapshotPlugin';
// import { ContentModelRibbonPlugin } from './ribbonButtons/contentModel/ContentModelRibbonPlugin';

const styles = require('./MainPane.scss');

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

interface ContentModelMainPaneState extends MainPaneBaseState {
    editorCreator: (div: HTMLDivElement, options: EditorAdapterOptions) => IStandaloneEditor;
}

class MainPane extends MainPaneBase<ContentModelMainPaneState> {
    // private formatStatePlugin: ContentModelFormatStatePlugin;
    // private editorOptionPlugin: ContentModelEditorOptionsPlugin;
    // private eventViewPlugin: ContentModelEventViewPlugin;
    // private apiPlaygroundPlugin: ApiPlaygroundPlugin;
    // private contentModelPanePlugin: ContentModelPanePlugin;
    private editPlugin: EditPlugin;
    private autoFormatPlugin: AutoFormatPlugin;
    private ribbonPlugin: RibbonPlugin;
    private pasteOptionPlugin: EditorPlugin;
    private emojiPlugin: EditorPlugin;
    // private snapshotPlugin: ContentModelSnapshotPlugin;
    private toggleablePlugins: EditorPlugin[] | null = null;
    private formatPainterPlugin: FormatPainterPlugin;
    private pastePlugin: PastePlugin;
    // private sampleEntityPlugin: SampleEntityPlugin;
    // private snapshots: Snapshots;

    constructor(props: {}) {
        super(props);

        // this.snapshots = {
        //     snapshots: [],
        //     totalSize: 0,
        //     currentIndex: -1,
        //     autoCompleteIndex: -1,
        //     maxSize: 1e7,
        // };

        // this.formatStatePlugin = new ContentModelFormatStatePlugin();
        // this.editorOptionPlugin = new ContentModelEditorOptionsPlugin();
        // this.eventViewPlugin = new ContentModelEventViewPlugin();
        // this.apiPlaygroundPlugin = new ApiPlaygroundPlugin();
        // this.snapshotPlugin = new ContentModelSnapshotPlugin(this.snapshots);
        // this.contentModelPanePlugin = new ContentModelPanePlugin();
        this.editPlugin = new EditPlugin();
        this.autoFormatPlugin = new AutoFormatPlugin();
        this.ribbonPlugin = createRibbonPlugin();
        this.pasteOptionPlugin = createPasteOptionPlugin();
        this.emojiPlugin = createEmojiPlugin();
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

    renderTitleBar() {
        return <TitleBar className={styles.noGrow} />;
    }

    renderRibbon(isPopout: boolean) {
        return (
            <Ribbon
                buttons={isPopout ? buttons : buttonsWithPopout}
                plugin={this.ribbonPlugin}
                dir={this.state.isRtl ? 'rtl' : 'ltr'}
            />
        );
    }

    renderSidePane(fullWidth: boolean) {
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

    getPlugins() {
        // this.toggleablePlugins =
        //     this.toggleablePlugins || getToggleablePlugins(this.state.initState);

        const plugins = [
            ...this.toggleablePlugins,
            this.pasteOptionPlugin,
            this.emojiPlugin,
            // this.sampleEntityPlugin,
        ];

        // if (this.state.showSidePane || this.state.popoutWindow) {
        //     plugins.push(...this.getSidePanePlugins());
        // }

        plugins.push(this.updateContentPlugin);

        return plugins;
    }

    resetEditor() {
        this.toggleablePlugins = null;
        this.setState({
            editorCreator: (div: HTMLDivElement, options: EditorAdapterOptions) =>
                new EditorAdapter(div, {
                    ...options,
                    cacheModel: true,
                }),
        });
    }

    renderEditor() {
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

        this.updateContentPlugin.forceUpdate();

        return (
            <div className={styles.editorContainer} id="EditorContainer">
                <div style={editorStyles}>
                    {this.state.editorCreator && (
                        <Rooster
                            id={MainPaneBase.editorDivId}
                            className={styles.editor}
                            // legacyPlugins={allPlugins}
                            plugins={[
                                this.ribbonPlugin,
                                this.formatPainterPlugin,
                                this.pastePlugin,
                                this.autoFormatPlugin,
                                this.editPlugin,
                                // this.contentModelPanePlugin.getInnerRibbonPlugin(),
                            ]}
                            defaultSegmentFormat={defaultFormat}
                            inDarkMode={this.state.isDarkMode}
                            getDarkColor={getDarkColor}
                            // snapshots={this.snapshotPlugin.getSnapshots()}
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

    getTheme(isDark: boolean): PartialTheme {
        return isDark ? DarkTheme : LightTheme;
    }

    private getSidePanePlugins(): SidePanePlugin[] {
        return [
            // this.formatStatePlugin,
            // this.editorOptionPlugin,
            // this.eventViewPlugin,
            // this.apiPlaygroundPlugin,
            // this.snapshotPlugin,
            // this.contentModelPanePlugin,
        ];
    }
}

export function mount(parent: HTMLElement) {
    ReactDOM.render(<MainPane />, parent);
}
