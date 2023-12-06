import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ApiPlaygroundPlugin from './sidePane/contentModelApiPlayground/ApiPlaygroundPlugin';
import ContentModelEditorOptionsPlugin from './sidePane/editorOptions/ContentModelEditorOptionsPlugin';
import ContentModelEventViewPlugin from './sidePane/eventViewer/ContentModelEventViewPlugin';
import ContentModelFormatPainterPlugin from './contentModel/plugins/ContentModelFormatPainterPlugin';
import ContentModelFormatStatePlugin from './sidePane/formatState/ContentModelFormatStatePlugin';
import ContentModelPanePlugin from './sidePane/contentModel/ContentModelPanePlugin';
import ContentModelRibbon from './ribbonButtons/contentModel/ContentModelRibbon';
import ContentModelRooster from './contentModel/editor/ContentModelRooster';
import getToggleablePlugins from './getToggleablePlugins';
import MainPaneBase, { MainPaneBaseState } from './MainPaneBase';
import SampleEntityPlugin from './sampleEntity/SampleEntityPlugin';
import SidePane from './sidePane/SidePane';
import SnapshotPlugin from './sidePane/snapshot/SnapshotPlugin';
import TitleBar from './titleBar/TitleBar';
import { arrayPush } from 'roosterjs-editor-dom';
import { ContentModelEditPlugin, EntityDelimiterPlugin } from 'roosterjs-content-model-plugins';
import { ContentModelRibbonPlugin } from './ribbonButtons/contentModel/ContentModelRibbonPlugin';
import { ContentModelSegmentFormat } from 'roosterjs-content-model-types';
import { createEmojiPlugin, createPasteOptionPlugin, RibbonPlugin } from 'roosterjs-react';
import { EditorPlugin } from 'roosterjs-editor-types';
import { getDarkColor } from 'roosterjs-color-utils';
import { PartialTheme } from '@fluentui/react/lib/Theme';
import { trustedHTMLHandler } from '../utils/trustedHTMLHandler';
import {
    ContentModelEditor,
    ContentModelEditorOptions,
    IContentModelEditor,
} from 'roosterjs-content-model-editor';

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
    editorCreator: (div: HTMLDivElement, options: ContentModelEditorOptions) => IContentModelEditor;
}

class ContentModelEditorMainPane extends MainPaneBase<ContentModelMainPaneState> {
    private formatStatePlugin: ContentModelFormatStatePlugin;
    private editorOptionPlugin: ContentModelEditorOptionsPlugin;
    private eventViewPlugin: ContentModelEventViewPlugin;
    private apiPlaygroundPlugin: ApiPlaygroundPlugin;
    private contentModelPanePlugin: ContentModelPanePlugin;
    private contentModelEditPlugin: ContentModelEditPlugin;
    private contentModelRibbonPlugin: RibbonPlugin;
    private pasteOptionPlugin: EditorPlugin;
    private emojiPlugin: EditorPlugin;
    private entityDelimiterPlugin: EntityDelimiterPlugin;
    private toggleablePlugins: EditorPlugin[] | null = null;
    private formatPainterPlugin: ContentModelFormatPainterPlugin;
    private sampleEntityPlugin: SampleEntityPlugin;

    constructor(props: {}) {
        super(props);

        this.formatStatePlugin = new ContentModelFormatStatePlugin();
        this.editorOptionPlugin = new ContentModelEditorOptionsPlugin();
        this.eventViewPlugin = new ContentModelEventViewPlugin();
        this.apiPlaygroundPlugin = new ApiPlaygroundPlugin();
        this.snapshotPlugin = new SnapshotPlugin();
        this.contentModelPanePlugin = new ContentModelPanePlugin();
        this.contentModelEditPlugin = new ContentModelEditPlugin();
        this.contentModelRibbonPlugin = new ContentModelRibbonPlugin();
        this.pasteOptionPlugin = createPasteOptionPlugin();
        this.emojiPlugin = createEmojiPlugin();
        this.entityDelimiterPlugin = new EntityDelimiterPlugin();
        this.formatPainterPlugin = new ContentModelFormatPainterPlugin();
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
        return (
            <ContentModelRibbon
                ribbonPlugin={this.contentModelRibbonPlugin}
                isRtl={this.state.isRtl}
                isInPopout={isPopout}
            />
        );
    }

    renderSidePane(fullWidth: boolean) {
        const styles = this.getStyles();

        return (
            <SidePane
                ref={this.sidePane}
                plugins={this.getSidePanePlugins()}
                isContentModelDemo={true}
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
            this.contentModelRibbonPlugin,
            this.contentModelPanePlugin.getInnerRibbonPlugin(),
            this.contentModelEditPlugin,
            this.pasteOptionPlugin,
            this.emojiPlugin,
            this.entityDelimiterPlugin,
            this.formatPainterPlugin,
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
            editorCreator: (div: HTMLDivElement, options: ContentModelEditorOptions) =>
                new ContentModelEditor(div, {
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
                        <ContentModelRooster
                            className={styles.editor}
                            plugins={allPlugins}
                            defaultSegmentFormat={defaultFormat}
                            inDarkMode={this.state.isDarkMode}
                            getDarkColor={getDarkColor}
                            experimentalFeatures={this.state.initState.experimentalFeatures}
                            // undoMetadataSnapshotService={this.snapshotPlugin.getSnapshotService()}
                            trustedHTMLHandler={trustedHTMLHandler}
                            zoomScale={this.state.scale}
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
