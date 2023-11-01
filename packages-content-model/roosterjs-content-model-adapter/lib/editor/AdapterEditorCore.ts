import type { ICoreEditor } from 'roosterjs-content-model-core';
import type { CompatibleGetContentMode } from 'roosterjs-editor-types/lib/compatibleTypes';
import type {
    ContentMetadata,
    EditorPlugin,
    GetContentMode,
    InsertOption,
    Rect,
    TrustedHTMLHandler,
} from 'roosterjs-editor-types';

/**
 * Get current editor content as HTML string
 * @param core The AdapterEditorCore object
 * @param mode specify what kind of HTML content to retrieve
 * @returns HTML string representing current editor content
 */
export declare type GetContent = (
    core: AdapterEditorCore,
    mode: GetContentMode | CompatibleGetContentMode
) => string;

/**
 * Insert a DOM node into editor content
 * @param core The AdapterEditorCore object. No op if null.
 * @param option An insert option object to specify how to insert the node
 */
export type InsertNode = (
    core: AdapterEditorCore,
    node: Node,
    option: InsertOption | null
) => boolean;

/**
 * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
 * if triggerContentChangedEvent is set to true
 * @param core The AdapterEditorCore object
 * @param content HTML content to set in
 * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
 */
export type SetContent = (
    core: AdapterEditorCore,
    content: string,
    triggerContentChangedEvent: boolean,
    metadata?: ContentMetadata
) => void;

export interface AdapterEditorCoreApiMap {
    /**
     * Get current editor content as HTML string
     * @param core The EditorCore object
     * @param mode specify what kind of HTML content to retrieve
     * @returns HTML string representing current editor content
     */
    getContent: GetContent;

    /**
     * Insert a DOM node into editor content
     * @param core The EditorCore object. No op if null.
     * @param option An insert option object to specify how to insert the node
     */
    insertNode: InsertNode;

    /**
     * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
     * if triggerContentChangedEvent is set to true
     * @param core The EditorCore object
     * @param content HTML content to set in
     * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
     */
    setContent: SetContent;
}

export interface AdapterEditorCore {
    /**
     * Core editor for Content Model
     */
    readonly coreEditor: ICoreEditor;

    /**
     * The content DIV element of this editor
     */
    readonly contentDiv: HTMLDivElement;

    /**
     * An array of editor plugins.
     */
    readonly plugins: EditorPlugin[];

    /**
     * Core API map of this editor
     */
    readonly api: AdapterEditorCoreApiMap;

    /**
     * Original API map of this editor. Overridden core API can use API from this map to call the original version of core API.
     */
    readonly originalApi: AdapterEditorCoreApiMap;

    /**
     * A handler to convert HTML string to a trust HTML string.
     * By default it will just return the original HTML string directly.
     * To override, pass your own trusted HTML handler to EditorOptions.trustedHTMLHandler
     */
    readonly trustedHTMLHandler: TrustedHTMLHandler;

    /*
     * Current zoom scale, default value is 1
     * When editor is put under a zoomed container, need to pass the zoom scale number using this property
     * to let editor behave correctly especially for those mouse drag/drop behaviors
     */
    zoomScale: number;

    /**
     * Retrieves the Visible Viewport of the editor.
     */
    getVisibleViewport: () => Rect | null;

    /**
     * Color of the border of a selectedImage. Default color: '#DB626C'
     */
    imageSelectionBorderColor?: string;
}
