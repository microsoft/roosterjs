import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ApiPlaygroundPlugin from './sidePane/contentModelApiPlayground/ApiPlaygroundPlugin';
import ContentModelEditorOptionsPlugin from './sidePane/editorOptions/ContentModelEditorOptionsPlugin';
import ContentModelEventViewPlugin from './sidePane/eventViewer/ContentModelEventViewPlugin';
import ContentModelFormatPainterPlugin from './contentModel/plugins/ContentModelFormatPainterPlugin';
import ContentModelFormatStatePlugin from './sidePane/formatState/ContentModelFormatStatePlugin';
import ContentModelPanePlugin from './sidePane/contentModel/ContentModelPanePlugin';
import ContentModelSnapshotPlugin from './sidePane/snapshot/ContentModelSnapshotPlugin';
import getToggleablePlugins from './getToggleablePlugins';
import MainPaneBase, { MainPaneBaseState } from './MainPaneBase';
import SampleEntityPlugin from './sampleEntity/SampleEntityPlugin';
import SidePane from './sidePane/SidePane';
import TitleBar from './titleBar/TitleBar';
import { alignCenterButton } from '../controlsV2/roosterjsReact/ribbon/buttons/alignCenterButton';
import { alignJustifyButton } from '../controlsV2/roosterjsReact/ribbon/buttons/alignJustifyButton';
import { alignLeftButton } from '../controlsV2/roosterjsReact/ribbon/buttons/alignLeftButton';
import { alignRightButton } from '../controlsV2/roosterjsReact/ribbon/buttons/alignRightButton';
import { arrayPush } from 'roosterjs-editor-dom';
import { backgroundColorButton } from '../controlsV2/roosterjsReact/ribbon/buttons/backgroundColorButton';
import { blockQuoteButton } from '../controlsV2/roosterjsReact/ribbon/buttons/blockQuoteButton';
import { boldButton } from '../controlsV2/roosterjsReact/ribbon/buttons/boldButton';
import { bulletedListButton } from '../controlsV2/roosterjsReact/ribbon/buttons/bulletedListButton';
import { changeImageButton } from '../controlsV2/demoButtons/changeImageButton';
import { clearFormatButton } from '../controlsV2/roosterjsReact/ribbon/buttons/clearFormatButton';
import { codeButton } from '../controlsV2/roosterjsReact/ribbon/buttons/codeButton';
import { ContentModelSegmentFormat, IEditor, Snapshots } from 'roosterjs-content-model-types';
import { createEmojiPlugin, createPasteOptionPlugin } from 'roosterjs-react';
import { darkModeButton } from '../controlsV2/demoButtons/darkModeButton';
import { decreaseFontSizeButton } from '../controlsV2/roosterjsReact/ribbon/buttons/decreaseFontSizeButton';
import { decreaseIndentButton } from '../controlsV2/roosterjsReact/ribbon/buttons/decreaseIndentButton';
import { EditorAdapter, EditorAdapterOptions } from 'roosterjs-editor-adapter';
import { EditorPlugin } from 'roosterjs-editor-types';
import { exportContentButton } from '../controlsV2/demoButtons/exportContentButton';
import { fontButton } from '../controlsV2/roosterjsReact/ribbon/buttons/fontButton';
import { fontSizeButton } from '../controlsV2/roosterjsReact/ribbon/buttons/fontSizeButton';
import { formatPainterButton } from '../controlsV2/demoButtons/formatPainterButton';
import { formatTableButton } from '../controlsV2/demoButtons/formatTableButton';
import { getDarkColor } from 'roosterjs-color-utils';
import { imageBorderColorButton } from '../controlsV2/demoButtons/imageBorderColorButton';
import { imageBorderRemoveButton } from '../controlsV2/demoButtons/imageBorderRemoveButton';
import { imageBorderStyleButton } from '../controlsV2/demoButtons/imageBorderStyleButton';
import { imageBorderWidthButton } from '../controlsV2/demoButtons/imageBorderWidthButton';
import { imageBoxShadowButton } from '../controlsV2/demoButtons/imageBoxShadowButton';
import { increaseFontSizeButton } from '../controlsV2/roosterjsReact/ribbon/buttons/increaseFontSizeButton';
import { increaseIndentButton } from '../controlsV2/roosterjsReact/ribbon/buttons/increaseIndentButton';
import { insertImageButton } from '../controlsV2/roosterjsReact/ribbon/buttons/insertImageButton';
import { insertLinkButton } from '../controlsV2/roosterjsReact/ribbon/buttons/insertLinkButton';
import { insertTableButton } from '../controlsV2/roosterjsReact/ribbon/buttons/insertTableButton';
import { italicButton } from '../controlsV2/roosterjsReact/ribbon/buttons/italicButton';
import { listStartNumberButton } from '../controlsV2/demoButtons/listStartNumberButton';
import { ltrButton } from '../controlsV2/roosterjsReact/ribbon/buttons/ltrButton';
import { numberedListButton } from '../controlsV2/roosterjsReact/ribbon/buttons/numberedListButton';
import { PartialTheme } from '@fluentui/react/lib/Theme';
import { pasteButton } from '../controlsV2/demoButtons/pasteButton';
import { popoutButton } from '../controlsV2/demoButtons/popoutButton';
import { redoButton } from '../controlsV2/roosterjsReact/ribbon/buttons/redoButton';
import { removeLinkButton } from '../controlsV2/roosterjsReact/ribbon/buttons/removeLinkButton';
import { Rooster } from '../controlsV2/roosterjsReact/rooster/component/Rooster';
import { rtlButton } from '../controlsV2/roosterjsReact/ribbon/buttons/rtlButton';
import { setBulletedListStyleButton } from '../controlsV2/demoButtons/setBulletedListStyleButton';
import { setHeadingLevelButton } from '../controlsV2/roosterjsReact/ribbon/buttons/setHeadingLevelButton';
import { setNumberedListStyleButton } from '../controlsV2/demoButtons/setNumberedListStyleButton';
import { setTableCellShadeButton } from '../controlsV2/demoButtons/setTableCellShadeButton';
import { setTableHeaderButton } from '../controlsV2/demoButtons/setTableHeaderButton';
import { spacingButton } from '../controlsV2/demoButtons/spacingButton';
import { strikethroughButton } from '../controlsV2/roosterjsReact/ribbon/buttons/strikethroughButton';
import { subscriptButton } from '../controlsV2/roosterjsReact/ribbon/buttons/subscriptButton';
import { superscriptButton } from '../controlsV2/roosterjsReact/ribbon/buttons/superscriptButton';
import { tableBorderApplyButton } from '../controlsV2/demoButtons/tableBorderApplyButton';
import { tableBorderColorButton } from '../controlsV2/demoButtons/tableBorderColorButton';
import { tableBorderStyleButton } from '../controlsV2/demoButtons/tableBorderStyleButton';
import { tableBorderWidthButton } from '../controlsV2/demoButtons/tableBorderWidthButton';
import { textColorButton } from '../controlsV2/roosterjsReact/ribbon/buttons/textColorButton';
import { trustedHTMLHandler } from '../utils/trustedHTMLHandler';
import { underlineButton } from '../controlsV2/roosterjsReact/ribbon/buttons/underlineButton';
import { undoButton } from '../controlsV2/roosterjsReact/ribbon/buttons/undoButton';
import { zoomButton } from '../controlsV2/demoButtons/zoomButton';
import {
    createRibbonPlugin,
    Ribbon,
    RibbonButton,
    RibbonPlugin,
} from '../controlsV2/roosterjsReact/ribbon';
import {
    spaceAfterButton,
    spaceBeforeButton,
} from '../controlsV2/demoButtons/spaceBeforeAfterButtons';
import {
    tableAlignCellButton,
    tableAlignTableButton,
    tableDeleteButton,
    tableInsertButton,
    tableMergeButton,
    tableSplitButton,
} from '../controlsV2/demoButtons/tableEditButtons';
import {
    AutoFormatPlugin,
    EditPlugin,
    PastePlugin,
    TableEditPlugin,
} from 'roosterjs-content-model-plugins';

const styles = require('./ContentModelEditorMainPane.scss');

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

interface ContentModelMainPaneState extends MainPaneBaseState {
    editorCreator: (div: HTMLDivElement, options: EditorAdapterOptions) => IEditor;
}

class ContentModelEditorMainPane extends MainPaneBase<ContentModelMainPaneState> {
    private formatStatePlugin: ContentModelFormatStatePlugin;
    private editorOptionPlugin: ContentModelEditorOptionsPlugin;
    private eventViewPlugin: ContentModelEventViewPlugin;
    private apiPlaygroundPlugin: ApiPlaygroundPlugin;
    private contentModelPanePlugin: ContentModelPanePlugin;
    private contentModelEditPlugin: EditPlugin;
    private contentModelAutoFormatPlugin: AutoFormatPlugin;
    private contentModelRibbonPlugin: RibbonPlugin;
    private pasteOptionPlugin: EditorPlugin;
    private emojiPlugin: EditorPlugin;
    private snapshotPlugin: ContentModelSnapshotPlugin;
    private toggleablePlugins: EditorPlugin[] | null = null;
    private formatPainterPlugin: ContentModelFormatPainterPlugin;
    private pastePlugin: PastePlugin;
    private sampleEntityPlugin: SampleEntityPlugin;
    private tableEditPlugin: TableEditPlugin;
    private snapshots: Snapshots;
    private buttons: RibbonButton<any>[] = [
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
        darkModeButton,
        zoomButton,
        exportContentButton,
    ];

    constructor(props: {}) {
        super(props);

        this.snapshots = {
            snapshots: [],
            totalSize: 0,
            currentIndex: -1,
            autoCompleteIndex: -1,
            maxSize: 1e7,
        };

        this.formatStatePlugin = new ContentModelFormatStatePlugin();
        this.editorOptionPlugin = new ContentModelEditorOptionsPlugin();
        this.eventViewPlugin = new ContentModelEventViewPlugin();
        this.apiPlaygroundPlugin = new ApiPlaygroundPlugin();
        this.snapshotPlugin = new ContentModelSnapshotPlugin(this.snapshots);
        this.contentModelPanePlugin = new ContentModelPanePlugin();
        this.contentModelEditPlugin = new EditPlugin();
        this.contentModelAutoFormatPlugin = new AutoFormatPlugin();
        this.contentModelRibbonPlugin = createRibbonPlugin();
        this.pasteOptionPlugin = createPasteOptionPlugin();
        this.emojiPlugin = createEmojiPlugin();
        this.formatPainterPlugin = new ContentModelFormatPainterPlugin();
        this.tableEditPlugin = new TableEditPlugin();
        this.pastePlugin = new PastePlugin();
        this.sampleEntityPlugin = new SampleEntityPlugin();
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

    getStyles(): Record<string, string> {
        return styles;
    }

    renderTitleBar() {
        return <TitleBar className={styles.noGrow} mode="contentModel" />;
    }

    renderRibbon(isPopout: boolean) {
        const buttons = isPopout ? this.buttons : this.buttons.concat([popoutButton]);

        return (
            <Ribbon
                buttons={buttons}
                plugin={this.contentModelRibbonPlugin}
                dir={this.state.isRtl ? 'rtl' : 'ltr'}
            />
        );
    }

    renderSidePane(fullWidth: boolean) {
        const styles = this.getStyles();

        return (
            <SidePane
                ref={this.sidePane}
                plugins={this.getSidePanePlugins()}
                mode="contentModel"
                className={`main-pane ${styles.sidePane} ${
                    fullWidth ? styles.sidePaneFullWidth : ''
                }`}
            />
        );
    }

    getPlugins() {
        this.toggleablePlugins =
            this.toggleablePlugins || getToggleablePlugins(this.state.initState);

        const plugins = [
            ...this.toggleablePlugins,
            this.pasteOptionPlugin,
            this.emojiPlugin,
            this.sampleEntityPlugin,
        ];

        if (this.state.showSidePane || this.state.popoutWindow) {
            arrayPush(plugins, this.getSidePanePlugins());
        }

        plugins.push(this.updateContentPlugin);

        return plugins;
    }

    resetEditor() {
        this.toggleablePlugins = null;
        this.setState({
            editorCreator: (div: HTMLDivElement, options: EditorAdapterOptions) =>
                new EditorAdapter(div, {
                    ...options,
                    cacheModel: this.state.initState.cacheModel,
                }),
        });
    }

    renderEditor() {
        const styles = this.getStyles();
        const allPlugins = this.getPlugins();
        const editorStyles = {
            transform: `scale(${this.state.scale})`,
            transformOrigin: this.state.isRtl ? 'right top' : 'left top',
            height: `calc(${100 / this.state.scale}%)`,
            width: `calc(${100 / this.state.scale}%)`,
        };
        const format = this.state.initState.defaultFormat;
        const defaultFormat: ContentModelSegmentFormat = {
            fontWeight: format.bold ? 'bold' : undefined,
            italic: format.italic || undefined,
            underline: format.underline || undefined,
            fontFamily: format.fontFamily || undefined,
            fontSize: format.fontSize || undefined,
            textColor: format.textColors?.lightModeColor || format.textColor || undefined,
            backgroundColor:
                format.backgroundColors?.lightModeColor || format.backgroundColor || undefined,
        };

        this.updateContentPlugin.forceUpdate();

        return (
            <div className={styles.editorContainer} id="EditorContainer">
                <div style={editorStyles}>
                    {this.state.editorCreator && (
                        <Rooster
                            id={MainPaneBase.editorDivId}
                            className={styles.editor}
                            legacyPlugins={allPlugins}
                            plugins={[
                                this.contentModelRibbonPlugin,
                                this.formatPainterPlugin,
                                this.pastePlugin,
                                this.tableEditPlugin,
                                this.contentModelAutoFormatPlugin,
                                this.contentModelEditPlugin,
                                this.contentModelPanePlugin.getInnerRibbonPlugin(),
                            ]}
                            defaultSegmentFormat={defaultFormat}
                            inDarkMode={this.state.isDarkMode}
                            getDarkColor={getDarkColor}
                            experimentalFeatures={this.state.initState.experimentalFeatures}
                            snapshots={this.snapshotPlugin.getSnapshots()}
                            trustedHTMLHandler={trustedHTMLHandler}
                            initialContent={this.content}
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

    private getSidePanePlugins() {
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
    ReactDOM.render(<ContentModelEditorMainPane />, parent);
}
