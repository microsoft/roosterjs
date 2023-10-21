import { ContentModelCoreApiMap, TrustedHTMLHandler } from './ContentModelEditorCore';
import { ContentModelCorePlugins } from './ContentModelCorePlugins';
import { ContentModelEditorPlugin } from './ContentModelEditorPlugin';
import {
    ContentModelSegmentFormat,
    DomToModelOption,
    ModelToDomOption,
} from 'roosterjs-content-model-types';

/**
 * The options to specify parameters customizing an editor, used by ctor of Editor class
 */
export interface ContentModelEditorOptions {
    /**
     * Default options used for DOM to Content Model conversion
     */
    defaultDomToModelOptions?: DomToModelOption;

    /**
     * Default options used for Content Model to DOM conversion
     */
    defaultModelToDomOptions?: ModelToDomOption;

    /**
     * List of plugins.
     * The order of plugins here determines in what order each event will be dispatched.
     * Plugins not appear in this list will not be added to editor, including built-in plugins.
     * Default value is empty array.
     */
    plugins?: ContentModelEditorPlugin[];

    /**
     * Default format of editor content. This will be applied to empty content.
     * If there is already content inside editor, format of existing content will not be changed.
     * Default value is the computed style of editor content DIV
     */
    defaultFormat?: ContentModelSegmentFormat;

    /**
     * A function map to override default core API implementation
     * Default value is null
     */
    coreApiOverride?: Partial<ContentModelCoreApiMap>;

    /**
     * A plugin map to override default core Plugin implementation
     * Default value is null
     */
    corePluginOverride?: Partial<ContentModelCorePlugins>;

    /**
     * If the editor is currently in dark mode
     */
    inDarkMode?: boolean;

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
     * Customized trusted type handler used for sanitizing HTML string before assign to DOM tree
     * This is required when trusted-type Content-Security-Policy (CSP) is enabled.
     * See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types
     */
    trustedHTMLHandler?: TrustedHTMLHandler;

    /**
     * Retrieves the visible viewport of the Editor. The default viewport is the Rect of the scrollContainer.
     */
    // getVisibleViewport?: () => Rect | null;

    /**
     * Color of the border of a selectedImage. Default color: '#DB626C'
     */
    imageSelectionBorderColor?: string;

    /**
     * A callback to be invoked when any exception is thrown during disposing editor
     * @param plugin The plugin that causes exception
     * @param error The error object we got
     */
    disposeErrorHandler?: (plugin: ContentModelEditorPlugin, error: Error) => void;
}
