import type CorePlugins from './CorePlugins';
import type DarkColorHandler from './DarkColorHandler';
import type DefaultFormat from './DefaultFormat';
import type EditorPlugin from './EditorPlugin';
import type Rect from './Rect';
import type Snapshot from './Snapshot';
import type UndoSnapshotsService from './UndoSnapshotsService';
import type { CoreApiMap } from './EditorCore';
import type { ExperimentalFeatures } from '../enum/ExperimentalFeatures';
import type { SizeTransformer } from '../type/SizeTransformer';
import type { TrustedHTMLHandler } from '../type/TrustedHTMLHandler';
import type { CompatibleExperimentalFeatures } from '../compatibleEnum/ExperimentalFeatures';

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
     * @deprecated Use undoMetadataSnapshotService instead
     * Undo snapshot service. Use this parameter to customize the undo snapshot service.
     */
    undoSnapshotService?: UndoSnapshotsService<string>;

    /**
     * Undo snapshot service based on content metadata. Use this parameter to customize the undo snapshot service.
     * When this property is set, value of undoSnapshotService will be ignored.
     */
    undoMetadataSnapshotService?: UndoSnapshotsService<Snapshot>;

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
    onExternalContentTransform?: (
        element: HTMLElement,
        fromDarkMode: boolean,
        toDarkMode: boolean,
        darkColorHandler: DarkColorHandler
    ) => void;

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
    experimentalFeatures?: (ExperimentalFeatures | CompatibleExperimentalFeatures)[];

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

    /**
     * Customized trusted type handler used for sanitizing HTML string before assign to DOM tree
     * This is required when trusted-type Content-Security-Policy (CSP) is enabled.
     * See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types
     */
    trustedHTMLHandler?: TrustedHTMLHandler;

    /**
     * Current zoom scale, @default value is 1
     * When editor is put under a zoomed container, need to pass the zoom scale number using this property
     * to let editor behave correctly especially for those mouse drag/drop behaviors
     */
    zoomScale?: number;

    /**
     * @deprecated Use zoomScale instead
     */
    sizeTransformer?: SizeTransformer;

    /**
     * Retrieves the visible viewport of the Editor. The default viewport is the Rect of the scrollContainer.
     */
    getVisibleViewport?: () => Rect | null;

    /**
     * Color of the border of a selectedImage. Default color: '#DB626C'
     */
    imageSelectionBorderColor?: string;

    /**
     * A callback to be invoked when any exception is thrown during disposing editor
     * @param plugin The plugin that causes exception
     * @param error The error object we got
     */
    disposeErrorHandler?: (plugin: EditorPlugin, error: Error) => void;
}
