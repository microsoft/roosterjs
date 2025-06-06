import type { PasteTypeOrGetter } from '../parameter/PasteTypeOrGetter';
import type { ExperimentalFeature } from './ExperimentalFeature';
import type { KnownAnnounceStrings } from '../parameter/AnnounceData';
import type { Colors, ColorTransformFunction } from '../context/DarkColorHandler';
import type { EditorPlugin } from './EditorPlugin';
import type { ContentModelSegmentFormat } from '../contentModel/format/ContentModelSegmentFormat';
import type { CoreApiMap } from './EditorCore';
import type { DomToModelOption } from '../context/DomToModelOption';
import type { ModelToDomOption } from '../context/ModelToDomOption';
import type {
    ContentModelDocument,
    ReadonlyContentModelDocument,
} from '../contentModel/blockGroup/ContentModelDocument';
import type { Snapshots } from '../parameter/Snapshot';
import type { TrustedHTMLHandler } from '../parameter/TrustedHTMLHandler';

/**
 * Options for colors and dark mode
 */
export interface ColorOptions {
    /**
     * A util function to transform light mode color to dark mode color
     * Default value is to return the original light color
     */
    getDarkColor?: ColorTransformFunction;

    /**
     * A util function to generate color key for dark mode color.
     * By default, the color key is generated from the light mode color. For example,
     * color "#123456" will have the key "--darkColor__123456", and
     * color "rgb(0,0,0)" will have key "--darkColor_rgb_0_0_0_".
     * Pass in this function to customize this behavior.
     * The return value must be a valid CSS variable, starts with "--"
     */
    generateColorKey?: ColorTransformFunction;

    /**
     * Existing known color pairs
     */
    knownColors?: Record<string, Colors>;

    /**
     * Whether to skip the adjust editor process when for light/dark mode
     */
    doNotAdjustEditorColor?: boolean;

    /**
     * If the editor is currently in dark mode
     */
    inDarkMode?: boolean;
}

/**
 * Options for Content Model
 */
export interface ContentModelOptions {
    /**
     * Default options used for DOM to Content Model conversion
     */
    defaultDomToModelOptions?: DomToModelOption;

    /**
     * Default options used for Content Model to DOM conversion
     */
    defaultModelToDomOptions?: ModelToDomOption;

    /**
     * Default format of editor content. This will be applied to empty content.
     * If there is already content inside editor, format of existing content will not be changed.
     * Default value is the computed style of editor content DIV
     */
    defaultSegmentFormat?: ContentModelSegmentFormat;

    /**
     * An optional callback function that will be invoked before write content model back to editor.
     * This is used for make sure model can satisfy some customized requirement
     * @param model The model to fix up
     */
    onFixUpModel?: (model: ReadonlyContentModelDocument) => void;

    /**
     * @deprecated
     */
    disableCache?: boolean;
}

/**
 * Options for selection
 */
export interface SelectionOptions {
    /**
     * Color of the border of a selectedImage. Default color: '#DB626C'
     */
    imageSelectionBorderColor?: string;

    /**
     * Background color of a selected table cell. Default color: '#C6C6C6'
     */
    tableCellSelectionBackgroundColor?: string;
}

/**
 * Options for paste
 */
export interface PasteOptions {
    /**
     * Allowed custom content type when paste besides text/plain, text/html and images
     * Only text types are supported, and do not add "text/" prefix to the type values
     */
    allowedCustomPasteType?: string[];

    /**
     * Default paste type or function that returns the paste type. By default will use the normal (as-is) paste type.
     */
    defaultPasteType?: PasteTypeOrGetter;
}

/**
 * Options for editor fundamental data structure
 */
export interface EditorBaseOptions {
    /**
     * Enabled experimental features
     */
    experimentalFeatures?: (ExperimentalFeature | string)[];

    /**
     * List of plugins.
     * The order of plugins here determines in what order each event will be dispatched.
     * Plugins not appear in this list will not be added to editor, including built-in plugins.
     * Default value is empty array.
     */
    plugins?: EditorPlugin[];

    /**
     * The scroll container to get scroll event from.
     * By default, the scroll container will be the same with editor content DIV
     */
    scrollContainer?: HTMLElement;

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
     * Initial Content Model
     */
    initialModel?: ContentModelDocument;

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
     * A callback to help get string template to announce, used for accessibility
     * @param key The key of known announce data
     * @returns A template string to announce, use placeholder such as "{0}" for variables if necessary
     */
    announcerStringGetter?: (key: KnownAnnounceStrings) => string;

    /**
     * Whether to enable paragraph map. Default value is false.
     * Paragraph map is used to save a marker for paragraphs so it can be found even content is changed from a previous marked paragraph.
     */
    enableParagraphMap?: boolean;
}

/**
 * Options for editor
 */
export interface EditorOptions
    extends EditorBaseOptions,
        ColorOptions,
        ContentModelOptions,
        SelectionOptions,
        PasteOptions {}
