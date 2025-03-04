import MarkdownPane from './MarkdownPane';
import { IEditor, PluginEvent } from 'roosterjs-content-model-types';
import { SidePaneElementProps } from '../SidePaneElement';
import { SidePanePluginImpl } from '../SidePanePluginImpl';

export interface MarkdownPaneProps extends SidePaneElementProps {
    getEditor: () => IEditor;
}

export class MarkdownPanePlugin extends SidePanePluginImpl<MarkdownPane, MarkdownPaneProps> {
    constructor() {
        super(MarkdownPane, 'plainText', 'Markdown Editor');
    }

    onPluginEvent(e: PluginEvent) {}

    getComponentProps(base: MarkdownPaneProps) {
        return {
            ...base,
            getEditor: () => {
                return this.editor;
            },
        };
    }
}
