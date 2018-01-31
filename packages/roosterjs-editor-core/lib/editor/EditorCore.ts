import EditorPlugin from '../editor/EditorPlugin';
import { DefaultFormat, SelectionRange } from 'roosterjs-editor-types';
import { InlineElementFactory } from 'roosterjs-editor-dom';

interface EditorCore {
    document: Document;
    contentDiv: HTMLDivElement;
    plugins: EditorPlugin[];
    inlineElementFactory: InlineElementFactory;
    defaultFormat: DefaultFormat;
    customData: {
        [Key: string]: {
            value: any;
            disposer: (value: any) => void;
        };
    };
    /**
     * @deprecated
     */
    cachedRange: Range;

    cachedSelectionRange: SelectionRange;
}

export default EditorCore;
