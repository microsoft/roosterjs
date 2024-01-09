import type { EditorPlugin } from './EditorPlugin';
import type { ContentModelSegmentFormat } from '../format/ContentModelSegmentFormat';
import type { StandaloneCoreApiMap } from './StandaloneEditorCore';
import type { TrustedHTMLHandler } from 'roosterjs-editor-types';
import type { DomToModelOption } from '../context/DomToModelOption';
import type { ModelToDomOption } from '../context/ModelToDomOption';
import type { ContentModelDocument } from '../group/ContentModelDocument';
import type { SnapshotsManager } from '../parameter/SnapshotsManager';

/**
 * Options for Content Model editor
 */
export interface StandaloneEditorOptions {
    /**
     * Default options used for DOM to Content Model conversion
     */
    defaultDomToModelOptions?: DomToModelOption;

    /**
     * Default options used for Content Model to DOM conversion
     */
    defaultModelToDomOptions?: ModelToDomOption;

    /**
     * Reuse existing DOM structure if possible, and update the model when content or selection is changed
     */
    cacheModel?: boolean;

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
    defaultSegmentFormat?: ContentModelSegmentFormat;

    /**
     * Allowed custom content type when paste besides text/plain, text/html and images
     * Only text types are supported, and do not add "text/" prefix to the type values
     */
    allowedCustomPasteType?: string[];

    /**
     * The scroll container to get scroll event from.
     * By default, the scroll container will be the same with editor content DIV
     */
    scrollContainer?: HTMLElement;

    /**
     * A util function to transform light mode color to dark mode color
     * Default value is to return the original light color
     */
    getDarkColor?: (lightColor: string) => string;

    /**
     * Customized trusted type handler used for sanitizing HTML string before assign to DOM tree
     * This is required when trusted-type Content-Security-Policy (CSP) is enabled.
     * See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types
     */
    trustedHTMLHandler?: TrustedHTMLHandler;

    /**
     * A function map to override default core API implementation
     * Default value is null
     */
    coreApiOverride?: Partial<StandaloneCoreApiMap>;

    /**
     * Color of the border of a selectedImage. Default color: '#DB626C'
     */
    imageSelectionBorderColor?: string;

    /**
     * Initial Content Model
     */
    initialModel?: ContentModelDocument;

    /**
     * Whether to skip the adjust editor process when for light/dark mode
     */
    doNotAdjustEditorColor?: boolean;

    /**
     * If the editor is currently in dark mode
     */
    inDarkMode?: boolean;

    /**
     * Undo snapshot service based on content metadata. Use this parameter to customize the undo snapshot service.
     * When this property is set, value of undoSnapshotService will be ignored.
     */
    snapshotsManager?: SnapshotsManager;

    /**
     * A callback to be invoked when any exception is thrown during disposing editor
     * @param plugin The plugin that causes exception
     * @param error The error object we got
     */
    disposeErrorHandler?: (plugin: EditorPlugin, error: Error) => void;

    /**
     * @deprecated
     * Current zoom scale, @default value is 1
     * When editor is put under a zoomed container, need to pass the zoom scale number using this property
     * to let editor behave correctly especially for those mouse drag/drop behaviors
     */
    zoomScale?: number;
}
