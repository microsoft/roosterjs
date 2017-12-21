import EditorPlugin from './EditorPlugin';
import UndoService from './UndoService';
import { DefaultFormat } from 'roosterjs-editor-types';

// Options that can be specified when editor loads to customize the behavior
interface EditorOptions {
    plugins?: EditorPlugin[];
    defaultFormat?: DefaultFormat;
    undo?: UndoService;
    initialContent?: string;
    disableRestoreSelectionOnFocus?: boolean;
    omitContentEditableAttributeChanges?: boolean;
}

export default EditorOptions;
