import EditorPlugin from './EditorPlugin';
import UndoSnapshotsService from './UndoSnapshotsService';
import { ContentEditFeatureArray } from './ContentEditFeature';
import { CoreApiMap } from './EditorCore';
import { DarkModeOptions, DefaultFormat } from 'roosterjs-editor-types';

/**
 * The options to specify parameters customizing an editor, used by ctor of Editor class
 */
export default interface EditorOptions {
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
     * Undo snapshot service. Use this parameter to customize the undo snapshot service.
     */
    undoSnapshotService?: UndoSnapshotsService;

    /**
     * Initial HTML content
     * Default value is whatever already inside the editor content DIV
     */
    initialContent?: string;

    /**
     * A function map to override default core API implementation
     * Default value is null
     */
    coreApiOverride?: Partial<CoreApiMap>;

    /**
     * Content edit features
     */
    editFeatures?: ContentEditFeatureArray;

    /**
     * If the editor is currently in dark mode
     */
    inDarkMode?: boolean;

    /**
     * Dark mode options for default format and paste handler
     */
    darkModeOptions?: DarkModeOptions;

    /**
     * The scroll container to get scroll event from.
     * By default, the scroll container will be the same with editor content DIV
     */
    scrollContainer?: HTMLElement;

    /**
     * Whether enable experiment features
     */
    enableExperimentFeatures?: boolean;
}
