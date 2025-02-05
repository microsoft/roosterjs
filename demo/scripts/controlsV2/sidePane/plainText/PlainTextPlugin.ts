import PlainTextPane from './PlainTextPane';
import { IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { SidePaneElementProps } from '../SidePaneElement';
import { SidePanePluginImpl } from '../SidePanePluginImpl';

export interface PlainTextPaneProps extends SidePaneElementProps {
    getEditor: () => IEditor;
}

export class PlainTextPlugin extends SidePanePluginImpl<PlainTextPane, PlainTextPaneProps> {
    constructor() {
        super(PlainTextPane, 'plainText', 'Plain Text');
    }

    onPluginEvent(e: PluginEvent) {}

    getComponentProps(base: PlainTextPaneProps) {
        return {
            ...base,
            getEditor: () => {
                return this.editor;
            },
        };
    }
}
