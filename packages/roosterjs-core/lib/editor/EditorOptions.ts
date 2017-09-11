import EditorPlugin from './EditorPlugin';
import UndoService from './UndoService';
import { DefaultFormat } from 'roosterjs-types';

// Options that can be specified when editor loads to customize the behavior
interface EditorOptions {
    plugins: EditorPlugin[];
    defaultFormat?: DefaultFormat;
    undo?: UndoService;
}

export default EditorOptions;
