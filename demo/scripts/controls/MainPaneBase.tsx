import * as React from 'react';
import BuildInPluginState from './BuildInPluginState';
import { EditorOptions, IEditor } from 'roosterjs-editor-types';

export interface MainPaneBaseState {
    showSidePane: boolean;
    showRibbon: boolean;
    popoutWindow: Window;
    initState: BuildInPluginState;
    supportDarkMode: boolean;
    scale: number;
    isDarkMode: boolean;
    editorCreator: (div: HTMLDivElement, options: EditorOptions) => IEditor;
    isRtl: boolean;
}

export default abstract class MainPaneBase extends React.Component<{}, MainPaneBaseState> {
    private static instance: MainPaneBase;

    static getInstance() {
        return this.instance;
    }

    constructor(props: {}) {
        super(props);

        MainPaneBase.instance = this;
    }

    abstract resetEditorPlugin(pluginState: BuildInPluginState): void;

    abstract updateFormatState(): void;

    abstract setIsRibbonShown(isShown: boolean): void;

    abstract setIsDarkModeSupported(isSupported: boolean): void;

    abstract isDarkModeSupported(): boolean;

    abstract popout(): void;

    abstract setScale(scale: number): void;

    abstract toggleDarkMode(): void;

    abstract setPageDirection(isRtl: boolean): void;
}
