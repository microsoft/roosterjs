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
import ContentModelSnapshotPlugin from './sidePane/snapshot/ContentModelSnapshotPlugin';
import MainPaneBase, { MainPaneBaseState } from './MainPaneBase';
import RibbonPlugin from './ribbonButtons/contentModel/RibbonPlugin';
import SidePane from './sidePane/SidePane';
import TitleBar from './titleBar/TitleBar';
import { ContentModelRibbonPlugin } from './ribbonButtons/contentModel/ContentModelRibbonPlugin';
import { getDarkColor } from 'roosterjs-color-utils';
import { PartialTheme } from '@fluentui/react/lib/Theme';
import { Snapshots } from 'roosterjs-editor-types';
import { StandaloneEditor } from 'roosterjs-content-model-core';
import { trustedHTMLHandler } from '../utils/trustedHTMLHandler';
import {
    ContentModelAutoFormatPlugin,
    ContentModelEditPlugin,
} from 'roosterjs-content-model-plugins';
import {
    ContentModelSegmentFormat,
    IStandaloneEditor,
    Snapshot,
    StandaloneEditorOptions,
} from 'roosterjs-content-model-types';

const styles = require('./StandaloneEditorMainPane.scss');

const LightTheme: PartialTheme = {
    palette: {
        themePrimary: '#4466aa',
        themeLighterAlt: '#f6f8fc',
        themeLighter: '#dae2f2',
        themeLight: '#bccae6',
        themeTertiary: '#839bcd',
        themeSecondary: '#5575b5',
        themeDarkAlt: '#3e5c9a',
        themeDark: '#344e82',
        themeDarker: '#263960',
        neutralLighterAlt: '#faf9f8',
        neutralLighter: '#f3f2f1',
        neutralLight: '#edebe9',
        neutralQuaternaryAlt: '#e1dfdd',
        neutralQuaternary: '#d0d0d0',
        neutralTertiaryAlt: '#c8c6c4',
        neutralTertiary: '#c2c2c2',
        neutralSecondary: '#858585',
        neutralPrimaryAlt: '#4b4b4b',
        neutralPrimary: '#333333',
        neutralDark: '#272727',
        black: '#1d1d1d',
        white: '#ffffff',
    },
};

const DarkTheme: PartialTheme = {
    palette: {
        themePrimary: '#335599',
        themeLighterAlt: '#f4f6fb',
        themeLighter: '#d5deef',
        themeLight: '#b3c2e0',
        themeTertiary: '#748ec2',
        themeSecondary: '#4464a5',
        themeDarkAlt: '#2d4c8a',
        themeDark: '#264074',
        themeDarker: '#1c2f56',
        neutralLighterAlt: '#faf9f8',
        neutralLighter: '#f3f2f1',
        neutralLight: '#edebe9',
        neutralQuaternaryAlt: '#e1dfdd',
        neutralQuaternary: '#d0d0d0',
        neutralTertiaryAlt: '#c8c6c4',
        neutralTertiary: '#c2c2c2',
        neutralSecondary: '#858585',
        neutralPrimaryAlt: '#4b4b4b',
        neutralPrimary: '#333333',
        neutralDark: '#272727',
        black: '#1d1d1d',
        white: '#ffffff',
    },
};

interface ContentModelMainPaneState extends MainPaneBaseState {
    editorCreator: (div: HTMLDivElement, options: StandaloneEditorOptions) => IStandaloneEditor;
}

class ContentModelEditorMainPane extends MainPaneBase<ContentModelMainPaneState> {
    private formatStatePlugin: ContentModelFormatStatePlugin;
    private editorOptionPlugin: ContentModelEditorOptionsPlugin;
    private eventViewPlugin: ContentModelEventViewPlugin;
    private apiPlaygroundPlugin: ApiPlaygroundPlugin;
    private contentModelPanePlugin: ContentModelPanePlugin;
    private contentModelEditPlugin: ContentModelEditPlugin;
    private contentModelRibbonPlugin: RibbonPlugin;
    private contentAutoFormatPlugin: ContentModelAutoFormatPlugin;
    private snapshotPlugin: ContentModelSnapshotPlugin;
    private formatPainterPlugin: ContentModelFormatPainterPlugin;
    private snapshots: Snapshots<Snapshot>;

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
        this.contentModelEditPlugin = new ContentModelEditPlugin();
        this.contentAutoFormatPlugin = new ContentModelAutoFormatPlugin();
        this.contentModelRibbonPlugin = new ContentModelRibbonPlugin();
        this.formatPainterPlugin = new ContentModelFormatPainterPlugin();
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
        return <TitleBar className={styles.noGrow} mode="standalone" />;
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
                mode="standalone"
                className={`main-pane ${styles.sidePane} ${
                    fullWidth ? styles.sidePaneFullWidth : ''
                }`}
            />
        );
    }

    resetEditor() {
        this.setState({
            editorCreator: (div: HTMLDivElement, options: StandaloneEditorOptions) =>
                new StandaloneEditor(div, {
                    ...options,
                    cacheModel: this.state.initState.cacheModel,
                }),
        });
    }

    renderEditor() {
        const styles = this.getStyles();
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
                            id={MainPaneBase.editorDivId}
                            className={styles.editor}
                            plugins={[
                                this.contentModelRibbonPlugin,
                                this.formatPainterPlugin,
                                this.contentModelEditPlugin,
                                this.contentAutoFormatPlugin,
                            ]}
                            defaultSegmentFormat={defaultFormat}
                            inDarkMode={this.state.isDarkMode}
                            getDarkColor={getDarkColor}
                            experimentalFeatures={this.state.initState.experimentalFeatures}
                            snapshots={this.snapshotPlugin.getSnapshots()}
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
