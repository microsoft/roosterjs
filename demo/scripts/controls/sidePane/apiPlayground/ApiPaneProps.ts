import { IEditor, PluginEvent } from 'roosterjs-editor-types';
import { SidePaneElementProps } from '../SidePaneElement';

export default interface ApiPaneProps extends SidePaneElementProps {
    getEditor: () => IEditor;
}

export interface ApiPlaygroundComponent {
    onPluginEvent?: (e: PluginEvent) => void;
}
