import { Editor } from 'roosterjs-editor-core';
import { PluginEvent } from 'roosterjs-editor-types';
import { SidePaneElementProps } from '../SidePaneElement';

export default interface ApiPaneProps extends SidePaneElementProps {
    getEditor: () => Editor;
}

export interface ApiPlaygroundComponent {
    onPluginEvent?: (e: PluginEvent) => void;
}
