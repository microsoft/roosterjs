import EditorPlugin from '../editor/EditorPlugin';
import { DefaultFormat } from 'roosterjs-editor-types';
import { InlineElementFactory } from 'roosterjs-editor-dom';

interface EditorCore {
    document: Document;
    contentDiv: HTMLDivElement;
    plugins: EditorPlugin[];
    inlineElementFactory: InlineElementFactory;
    defaultFormat: DefaultFormat;
    customData: {[Key: string]: {
        value: any;
        disposer: (value: any) => void;
    }};
    cachedSelectionRange: Range;
    isInIME: boolean;
    disableRestoreSelectionOnFocus: boolean;
}

export default EditorCore;
