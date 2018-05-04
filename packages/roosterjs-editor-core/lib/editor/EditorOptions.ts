import EditorPlugin from './EditorPlugin';
import UndoService from './UndoService';
import { CoreApiMap } from './EditorCore';
import { DefaultFormat } from 'roosterjs-editor-types';

// Options that can be specified when editor loads to customize the behavior
interface EditorOptions {
    plugins?: EditorPlugin[];
    defaultFormat?: DefaultFormat;
    undo?: UndoService;
    initialContent?: string;
    idleEventTimeSpanInSecond?: number;
    disableRestoreSelectionOnFocus?: boolean;
    omitContentEditableAttributeChanges?: boolean;
    coreApiOverride?: Partial<CoreApiMap>;
}

export default EditorOptions;
