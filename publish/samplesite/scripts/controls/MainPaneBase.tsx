import * as React from 'react';
import BuildInPluginState from './BuildInPluginState';
import SidePane from './sidePane/SidePane';
import SidePanePlugin from './SidePanePlugin';

export default abstract class MainPaneBase extends React.Component<{}, {}> {
    protected sidePane: SidePane;
    private static instance: MainPaneBase;

    static getInstance() {
        return this.instance;
    }

    constructor(props: {}) {
        super(props);

        MainPaneBase.instance = this;
    }

    abstract resetEditorPlugin(pluginState: BuildInPluginState);

    abstract updateForamtState();
}
