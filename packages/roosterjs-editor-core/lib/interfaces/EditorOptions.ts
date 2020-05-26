import EditorPlugin from './EditorPlugin';
import UndoService from './UndoService';
import { CoreApiMap } from './EditorCore';
import { DarkModeOptions, DefaultFormat, PluginEvent } from 'roosterjs-editor-types';
import { GenericContentEditFeature } from './ContentEditFeature';

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

    /**
     * Additional content edit features
     */
    additionalEditFeatures?: GenericContentEditFeature<PluginEvent>[];

    /**
     * If the editor is currently in dark mode
     */
    inDarkMode?: boolean;

    /**
     * Dark mode options for default format and paste handler
     */
    darkModeOptions?: DarkModeOptions;

    /**
     * Initial custom data.
     * Use this option to set custom data before any plugin is initialized,
     * so that plugins can access the custom data safely.
     * The value of this map is the value of each custom data. No disposer function to specify here.
     * Because when set custom data via this way, it means the custom data value is created before editor,
     * so editor shouldn't control the lifecycle of these objects, and caller need to manage its lifecycle.
     */
    customData?: { [key: string]: any };

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
