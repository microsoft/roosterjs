import type { SidePaneElementProps } from '../SidePaneElement';
import type { IStandaloneEditor, PluginEvent } from 'roosterjs-content-model-types';

export interface ApiPaneProps extends SidePaneElementProps {
    getEditor: () => IStandaloneEditor;
}

export interface ApiPlaygroundComponent {
    onPluginEvent?: (e: PluginEvent) => void;
}
