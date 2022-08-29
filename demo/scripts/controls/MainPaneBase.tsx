import * as React from 'react';
import BuildInPluginState from './BuildInPluginState';
import { EditorOptions, IEditor } from 'roosterjs-editor-types';

export interface MainPaneBaseState {
    showSidePane: boolean;
    popoutWindow: Window;
    initState: BuildInPluginState;
    scale: number;
    isDarkMode: boolean;
    editorCreator: (div: HTMLDivElement, options: EditorOptions) => IEditor;
    isRtl: boolean;
    showContentModelRibbon: boolean;
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

    abstract popout(): void;

    abstract setScale(scale: number): void;

    abstract toggleDarkMode(): void;

    abstract setPageDirection(isRtl: boolean): void;

    abstract toggleContentModelRibbon(): void;
}
