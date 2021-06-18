import CorePlugins from './CorePlugins';
import DefaultFormat from './DefaultFormat';
import EditorPlugin from './EditorPlugin';
import UndoSnapshotsService from './UndoSnapshotsService';
import { CoreApiMap } from './EditorCore';
import { ExperimentalFeatures } from '../enum/ExperimentalFeatures';

/**
 * The options to specify parameters customizing an editor, used by ctor of Editor class
 */
export default interface EditorOptions {
    /**
     * List of plugins.
     * The order of plugins here determines in what order each event will be dispatched.
     * Plugins not appear in this list will not be added to editor, including built-in plugins.
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
     * A plugin map to override default core Plugin implementation
     * Default value is null
     */
    corePluginOverride?: Partial<CorePlugins>;

    /**
     * If the editor is currently in dark mode
     */
    inDarkMode?: boolean;

    /**
     * @deprecated
     * RoosterJS provides an experimental "external content handler" that transforms text
     * This is used when content is pasted or inserted via a method we can hook into.
     * This transform is currently "lossy" and will eliminate color information.
     * If you want to change this behavior, you may define a different function here.
     * It takes in the impacted HTMLElement
     */
    onExternalContentTransform?: (htmlIn: HTMLElement) => void;

    /**
     * A util function to transform light mode color to dark mode color
     * Default value is to return the original light color
     */
    getDarkColor?: (lightColor: string) => string;

    /**
     * Whether to skip the adjust editor process when for light/dark mode
     */
    doNotAdjustEditorColor?: boolean;

    /**
     * The scroll container to get scroll event from.
     * By default, the scroll container will be the same with editor content DIV
     */
    scrollContainer?: HTMLElement;

    /**
     * Specify the enabled experimental features
     */
    experimentalFeatures?: ExperimentalFeatures[];

    /**
     * By default, we will stop propagation of a printable keyboard event
     * (a keyboard event which is caused by printable char input).
     * Set this option to true to override this behavior in case you still need the event
     * to be handled by ancestor nodes of editor.
     */
    allowKeyboardEventPropagation?: boolean;

    /**
     * Allowed custom content type when paste besides text/plain, text/html and images
     * Only text types are supported, and do not add "text/" prefix to the type values
     */
    allowedCustomPasteType?: string[];
}
