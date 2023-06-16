import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ApiPlaygroundPlugin from './sidePane/apiPlayground/ApiPlaygroundPlugin';
import EditorOptionsPlugin from './sidePane/editorOptions/EditorOptionsPlugin';
import EventViewPlugin from './sidePane/eventViewer/EventViewPlugin';
import FormatPainterPlugin from './contentModel/plugins/FormatPainterPlugin';
import FormatStatePlugin from './sidePane/formatState/FormatStatePlugin';
import getToggleablePlugins from './getToggleablePlugins';
import MainPaneBase from './MainPaneBase';
import SampleEntityPlugin from './sampleEntity/SampleEntityPlugin';
import SidePane from './sidePane/SidePane';
import SnapshotPlugin from './sidePane/snapshot/SnapshotPlugin';
import TitleBar from './titleBar/TitleBar';
import { arrayPush } from 'roosterjs-editor-dom';
import { darkMode, DarkModeButtonStringKey } from './ribbonButtons/darkMode';
import { Editor } from 'roosterjs-editor-core';
import { EditorOptions, EditorPlugin } from 'roosterjs-editor-types';
import { ExportButtonStringKey, exportContent } from './ribbonButtons/export';
import { PartialTheme } from '@fluentui/react/lib/Theme';
import { popout, PopoutButtonStringKey } from './ribbonButtons/popout';
import { zoom, ZoomButtonStringKey } from './ribbonButtons/zoom';
import {
    createRibbonPlugin,
    RibbonPlugin,
    createPasteOptionPlugin,
    createEmojiPlugin,
    Ribbon,
    RibbonButton,
    AllButtonStringKeys,
    getButtons,
    AllButtonKeys,
} from 'roosterjs-react';

const styles = require('./MainPane.scss');
type RibbonStringKeys =
    | AllButtonStringKeys
    | DarkModeButtonStringKey
    | ZoomButtonStringKey
    | ExportButtonStringKey
    | PopoutButtonStringKey;

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

class MainPane extends MainPaneBase {
    private formatStatePlugin: FormatStatePlugin;
    private editorOptionPlugin: EditorOptionsPlugin;
    private eventViewPlugin: EventViewPlugin;
    private apiPlaygroundPlugin: ApiPlaygroundPlugin;
    private ribbonPlugin: RibbonPlugin;
    private pasteOptionPlugin: EditorPlugin;
    private emojiPlugin: EditorPlugin;
    private toggleablePlugins: EditorPlugin[] | null = null;
    private formatPainterPlugin: FormatPainterPlugin;
    private sampleEntityPlugin: SampleEntityPlugin;
    private mainWindowButtons: RibbonButton<RibbonStringKeys>[];
    private popoutWindowButtons: RibbonButton<RibbonStringKeys>[];

    constructor(props: {}) {
        super(props);

        this.formatStatePlugin = new FormatStatePlugin();
        this.editorOptionPlugin = new EditorOptionsPlugin();
        this.eventViewPlugin = new EventViewPlugin();
        this.apiPlaygroundPlugin = new ApiPlaygroundPlugin();
        this.snapshotPlugin = new SnapshotPlugin();
        this.ribbonPlugin = createRibbonPlugin();
        this.pasteOptionPlugin = createPasteOptionPlugin();
        this.emojiPlugin = createEmojiPlugin();
        this.formatPainterPlugin = new FormatPainterPlugin();
        this.sampleEntityPlugin = new SampleEntityPlugin();

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
        };
    }

    getStyles(): Record<string, string> {
        return styles;
    }

    renderTitleBar() {
        return <TitleBar className={styles.noGrow} isContentModelPane={false} />;
    }

    renderRibbon(isPopout: boolean) {
        return (
            <Ribbon
                buttons={isPopout ? this.popoutWindowButtons : this.mainWindowButtons}
                plugin={this.ribbonPlugin}
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
                isContentModelDemo={false}
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
            this.ribbonPlugin,
            this.pasteOptionPlugin,
            this.emojiPlugin,
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
            editorCreator: (div: HTMLDivElement, options: EditorOptions) =>
                new Editor(div, options),
        });
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
        ];
    }
}

export function mount(parent: HTMLElement) {
    ReactDOM.render(<MainPane />, parent);
}
