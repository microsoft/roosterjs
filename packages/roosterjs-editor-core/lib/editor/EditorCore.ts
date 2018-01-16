import EditorPlugin from './EditorPlugin';
import { CustomDataSet } from './CustomData';
import { DefaultFormat } from 'roosterjs-editor-types';
import { InlineElementFactory } from 'roosterjs-editor-dom';

interface EditorCore {
    document: Document;
    contentDiv: HTMLDivElement;
    plugins: EditorPlugin[];
    inlineElementFactory: InlineElementFactory;
    defaultFormat: DefaultFormat;
    customData: CustomDataSet;
    cachedSelectionRange: Range;
    isInIME: boolean;
    disableRestoreSelectionOnFocus: boolean;
}

export default EditorCore;
