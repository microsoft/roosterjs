import type { SidePaneElementProps } from '../SidePaneElement';
import type { IEditor, PluginEvent } from 'roosterjs-content-model-types';

export interface ApiPaneProps extends SidePaneElementProps {
    getEditor: () => IEditor;
}

export interface ApiPlaygroundComponent {
    onPluginEvent?: (e: PluginEvent) => void;
}
