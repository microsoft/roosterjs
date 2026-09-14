import JsonBeautifierPane from './JsonBeautifierPane';
import { IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { SidePaneElementProps } from '../SidePaneElement';
import { SidePanePluginImpl } from '../SidePanePluginImpl';

export interface JsonBeautifierPaneProps extends SidePaneElementProps {
    getEditor: () => IEditor;
}

export class JsonBeautifierPanePlugin extends SidePanePluginImpl<
    JsonBeautifierPane,
    JsonBeautifierPaneProps
> {
    constructor() {
        super(JsonBeautifierPane, 'jsonBeautifier', 'JSON Beautifier');
    }

    onPluginEvent(e: PluginEvent) {}

    getComponentProps(base: JsonBeautifierPaneProps) {
        return {
            ...base,
            getEditor: () => this.editor,
        };
    }
}
