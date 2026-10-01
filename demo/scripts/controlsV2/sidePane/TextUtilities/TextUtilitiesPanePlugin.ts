import TextUtilitiesPane from './TextUtilitiesPane';
import { IEditor } from 'roosterjs-content-model-types';
import { SidePaneElementProps } from '../SidePaneElement';
import { SidePanePluginImpl } from '../SidePanePluginImpl';

export interface TextUtilitiesPaneProps extends SidePaneElementProps {
    getEditor: () => IEditor;
}

export class TextUtilitiesPanePlugin extends SidePanePluginImpl<
    TextUtilitiesPane,
    TextUtilitiesPaneProps
> {
    constructor() {
        super(TextUtilitiesPane, 'textUtilities', 'Text Utilities');
    }

    getComponentProps(base: TextUtilitiesPaneProps) {
        return {
            ...base,
            getEditor: () => this.editor,
        };
    }
}
