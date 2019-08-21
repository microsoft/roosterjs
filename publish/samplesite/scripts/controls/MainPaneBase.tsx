import * as React from 'react';
import BuildInPluginState from './BuildInPluginState';
import SidePane from './sidePane/SidePane';

export interface MainPaneBaseState {
    showSidePane: boolean;
    showRibbon: boolean;
}

export default abstract class MainPaneBase extends React.Component<{}, MainPaneBaseState> {
    protected sidePane: SidePane;
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
}
