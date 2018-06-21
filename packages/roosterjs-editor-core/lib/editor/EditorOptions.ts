import EditorPlugin from './EditorPlugin';
import UndoService from './UndoService';
import { CoreApiMap } from './EditorCore';
import { DefaultFormat } from 'roosterjs-editor-types';

/**
 * The options to specify parameters customizing an editor, used by ctor of Editor class
 */
interface EditorOptions {
    /**
     * List of plugins.
     * The order of plugins here determines in what order each event will be dispatched.
     * Plugins not appear in t his list will not be added to editor, including bulit-in plugins.
     * Default value is empty array.
     */
    plugins?: EditorPlugin[];

    /**
     * Default format of editor content. This will be applied to empty content.
     * If there is already content inside editor, format of existing content will not be changed.
     * Default value is the computed style of editor content DIV
     */
    defaultFormat?: DefaultFormat;

    /**
     * Undo service object. Use this parameter to customize the undo service.
     * Default value is a new instance of Undo object
     */
    undo?: UndoService;

    /**
     * Initial HTML content
     * Default value is whatever already inside the editor content DIV
     */
    initialContent?: string;

    /**
     * Whether auto restore previous selection when focus to editor
     * Default value is false
     */
    disableRestoreSelectionOnFocus?: boolean;

    /**
     * Whether skip setting contenteditable attribute to content DIV
     * Default value is false
     */
    omitContentEditableAttributeChanges?: boolean;

    /**
     * A function map to override default core API implementation
     * Default value is null
     */
    coreApiOverride?: Partial<CoreApiMap>;
}

export default EditorOptions;
