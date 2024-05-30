import type { KnownAnnounceStrings } from '../parameter/AnnounceData';
import type { PasteType } from '../enum/PasteType';
import type { Colors, ColorTransformFunction } from '../context/DarkColorHandler';
import type { EditorPlugin } from './EditorPlugin';
import type { ContentModelSegmentFormat } from '../contentModel/format/ContentModelSegmentFormat';
import type { CoreApiMap } from './EditorCore';
import type { DomToModelOption } from '../context/DomToModelOption';
import type { ModelToDomOption } from '../context/ModelToDomOption';
import type { ContentModelDocument } from '../contentModel/blockGroup/ContentModelDocument';
import type { Snapshots } from '../parameter/Snapshot';
import type { TrustedHTMLHandler } from '../parameter/TrustedHTMLHandler';

/**
 * Options for editor
 */
export interface EditorOptions {
    /**
     * Default options used for DOM to Content Model conversion
     */
    defaultDomToModelOptions?: DomToModelOption;

    /**
     * Default options used for Content Model to DOM conversion
     */
    defaultModelToDomOptions?: ModelToDomOption;

    /**
     * Whether content model should be cached in order to improve editing performance.
     * Pass true to disable the cache.
     * @default false
     */
    disableCache?: boolean;

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
    getDarkColor?: ColorTransformFunction;

    /**
     * Existing known color pairs
     */
    knownColors?: Record<string, Colors>;

    /**
     * Whether to use cached known colors for dark mode
     * If false, the getDarkColor function will be called every time when color is needed
     */
    skipKnownColorsWhenGetDarkColor?: boolean;

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
    coreApiOverride?: Partial<CoreApiMap>;

    /**
     * Color of the border of a selectedImage. Default color: '#DB626C'
     */
    imageSelectionBorderColor?: string;

    /**
     * Background color of a selected table cell. Default color: '#C6C6C6'
     */
    tableCellSelectionBackgroundColor?: string;

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
     * Undo snapshot. Use this parameter to provide an external storage of undo snapshots
     */
    snapshots?: Snapshots;

    /**
     * A callback to be invoked when any exception is thrown during disposing editor
     * @param plugin The plugin that causes exception
     * @param error The error object we got
     */
    disposeErrorHandler?: (plugin: EditorPlugin, error: Error) => void;

    /**
     * Default paste type. By default will use the normal (as-is) paste type.
     */
    defaultPasteType?: PasteType;

    /**
     * A callback to help get string template to announce, used for accessibility
     * @param key The key of known announce data
     * @returns A template string to announce, use placeholder such as "{0}" for variables if necessary
     */
    announcerStringGetter?: (key: KnownAnnounceStrings) => string;
}
