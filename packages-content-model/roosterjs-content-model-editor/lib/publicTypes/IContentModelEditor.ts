import { ContentModelCoreApiMap } from './ContentModelEditorCore';
import { ContentModelEditorPlugin } from './ContentModelEditorPlugin';
import { ContentModelPluginEventType } from './event/ContentModelPluginEventType';
import { DOMEventHandler } from './interface/domEventHandler';
import { TrustedHTMLHandler } from './callback/TrustedHTMLHandler';
import {
    ContentModelPluginEventData,
    ContentModelPluginEventFromType,
} from './event/ContentModelPluginEventData';
import type {
    ContentModelDocument,
    ContentModelSegmentFormat,
    DOMSelection,
    DomToModelOption,
    ModelToDomOption,
    OnNodeCreated,
} from 'roosterjs-content-model-types';

/**
 * An interface of editor with Content Model support.
 * (This interface is still under development, and may still be changed in the future with some breaking changes)
 */
export interface IContentModelEditor {
    /**
     * Dispose this editor, dispose all plugins and custom data
     */
    dispose(): void;

    /**
     * Get whether this editor is disposed
     * @returns True if editor is disposed, otherwise false
     */
    isDisposed(): boolean;

    /**
     * Get document which contains this editor
     * @returns The HTML document which contains this editor
     */
    getDocument(): Document;

    /**
     * Add a custom DOM event handler to handle events not handled by roosterjs.
     * Caller need to take the responsibility to dispose the handler properly
     * @param eventName DOM event name to handle
     * @param handler Handler callback
     * @returns A dispose function. Call the function to dispose this event handler
     */
    addDomEventHandler(eventName: string, handler: DOMEventHandler): () => void;

    /**
     * Add a bunch of custom DOM event handler to handle events not handled by roosterjs.
     * Caller need to take the responsibility to dispose the handler properly
     * @param handlerMap A event name => event handler map
     * @returns A dispose function. Call the function to dispose all event handlers added by this function
     */
    addDomEventHandler(handlerMap: Record<string, DOMEventHandler>): () => void;

    /**
     * Trigger an event to be dispatched to all plugins
     * @param eventType Type of the event
     * @param data data of the event with given type, this is the rest part of PluginEvent with the given type
     * @param broadcast indicates if the event needs to be dispatched to all plugins
     * True means to all, false means to allow exclusive handling from one plugin unless no one wants that
     * @returns the event object which is really passed into plugins. Some plugin may modify the event object so
     * the result of this function provides a chance to read the modified result
     */
    triggerPluginEvent<T extends ContentModelPluginEventType>(
        eventType: T,
        data: ContentModelPluginEventData<T>,
        broadcast?: boolean
    ): ContentModelPluginEventFromType<T>;

    /**
     * Get custom data related to this editor
     * @param key Key of the custom data
     * @param getter Getter function. If custom data for the given key doesn't exist,
     * call this function to get one and store it if it is specified. Otherwise return undefined
     * @param disposer An optional disposer function to dispose this custom data when
     * dispose editor.
     */
    getCustomData<T>(key: string, getter?: () => T, disposer?: (value: T) => void): T;

    /**
     * Add undo snapshot, and execute a format callback function, then add another undo snapshot, then trigger
     * ContentChangedEvent with given change source.
     * If this function is called nested, undo snapshot will only be added in the outside one
     * @param callback The callback function to perform formatting, returns a data object which will be used as
     * the data field in ContentChangedEvent if changeSource is not null.
     * @param changeSource The change source to use when fire ContentChangedEvent. When the value is not null,
     * a ContentChangedEvent will be fired with change source equal to this value
     * @param canUndoByBackspace True if this action can be undone when user presses Backspace key (aka Auto Complete).
     * @param additionalData Optional parameter to provide additional data related to the ContentChanged Event.
     */
    addUndoSnapshot(
        callback?: () => any,
        changeSource?: string,
        canUndoByBackspace?: boolean
        // additionalData?: ContentChangedData
    ): void;

    /**
     * Create Content Model from DOM tree in this editor
     * @param rootNode Optional start node. If provided, Content Model will be created from this node (including itself),
     * otherwise it will create Content Model for the whole content in editor.
     * @param option The options to customize the behavior of DOM to Content Model conversion
     * @param selectionOverride When specified, use this selection to override existing selection inside editor
     */
    createContentModel(
        option?: DomToModelOption,
        selectionOverride?: DOMSelection
    ): ContentModelDocument;

    /**
     * Set content with content model
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     * @param onNodeCreated An optional callback that will be called when a DOM node is created
     */
    setContentModel(
        model: ContentModelDocument,
        option?: ModelToDomOption,
        onNodeCreated?: OnNodeCreated
    ): DOMSelection | null;

    /**
     * Get current DOM selection.
     * This is the replacement of IEditor.getSelectionRangeEx.
     */
    getDOMSelection(): DOMSelection | null;

    /**
     * Set DOMSelection into editor content.
     * This is the replacement of IEditor.select.
     * @param selection The selection to set
     */
    setDOMSelection(selection: DOMSelection): void;
}

/**
 * Options for Content Model editor
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

    // /**
    //  * Undo snapshot service based on content metadata. Use this parameter to customize the undo snapshot service.
    //  * When this property is set, value of undoSnapshotService will be ignored.
    //  */
    // undoMetadataSnapshotService?: UndoSnapshotsService<Snapshot>;

    /**
     * Initial HTML content
     * Default value is whatever already inside the editor content DIV
     */
    initialContent?: string;

    /**
     * A function map to override default core API implementation
     * Default value is null
     */
    coreApiOverride?: Partial<ContentModelCoreApiMap>;

    // /**
    //  * A plugin map to override default core Plugin implementation
    //  * Default value is null
    //  */
    // corePluginOverride?: Partial<CorePlugins>;

    /**
     * If the editor is currently in dark mode
     */
    inDarkMode?: boolean;

    /**
     * A util function to transform light mode color to dark mode color
     * Default value is to return the original light color
     */
    getDarkColor?: (lightColor: string) => string;

    // /**
    //  * Whether to skip the adjust editor process when for light/dark mode
    //  */
    // doNotAdjustEditorColor?: boolean;

    /**
     * The scroll container to get scroll event from.
     * By default, the scroll container will be the same with editor content DIV
     */
    scrollContainer?: HTMLElement;

    // /**
    //  * Specify the enabled experimental features
    //  */
    // experimentalFeatures?: (ExperimentalFeatures | CompatibleExperimentalFeatures)[];

    // /**
    //  * By default, we will stop propagation of a printable keyboard event
    //  * (a keyboard event which is caused by printable char input).
    //  * Set this option to true to override this behavior in case you still need the event
    //  * to be handled by ancestor nodes of editor.
    //  */
    // allowKeyboardEventPropagation?: boolean;

    // /**
    //  * Allowed custom content type when paste besides text/plain, text/html and images
    //  * Only text types are supported, and do not add "text/" prefix to the type values
    //  */
    // allowedCustomPasteType?: string[];

    /**
     * Customized trusted type handler used for sanitizing HTML string before assign to DOM tree
     * This is required when trusted-type Content-Security-Policy (CSP) is enabled.
     * See https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/trusted-types
     */
    trustedHTMLHandler?: TrustedHTMLHandler;

    // /**
    //  * Current zoom scale, @default value is 1
    //  * When editor is put under a zoomed container, need to pass the zoom scale number using this property
    //  * to let editor behave correctly especially for those mouse drag/drop behaviors
    //  */
    // zoomScale?: number;

    // /**
    //  * Retrieves the visible viewport of the Editor. The default viewport is the Rect of the scrollContainer.
    //  */
    // getVisibleViewport?: () => Rect | null;

    // /**
    //  * Color of the border of a selectedImage. Default color: '#DB626C'
    //  */
    // imageSelectionBorderColor?: string;
}
