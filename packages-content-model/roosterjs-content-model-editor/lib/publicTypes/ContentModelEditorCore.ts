import { StandaloneEditorCore } from 'roosterjs-content-model-types/lib';
import type {
    CompatibleGetContentMode,
    CompatibleExperimentalFeatures,
} from 'roosterjs-editor-types/lib/compatibleTypes';
import type {
    CustomData,
    EditorPlugin,
    ExperimentalFeatures,
    SizeTransformer,
    ContentMetadata,
    GetContentMode,
    InsertOption,
    NodePosition,
    StyleBasedFormatState,
    EditPluginState,
} from 'roosterjs-editor-types';

/**
 * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
 * if triggerContentChangedEvent is set to true
 * @param core The ContentModelEditorCore object
 * @param content HTML content to set in
 * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
 */
export type SetContent = (
    core: ContentModelEditorCore,
    content: string,
    triggerContentChangedEvent: boolean,
    metadata?: ContentMetadata
) => void;

/**
 * Get current editor content as HTML string
 * @param core The ContentModelEditorCore object
 * @param mode specify what kind of HTML content to retrieve
 * @returns HTML string representing current editor content
 */
export type GetContent = (
    core: ContentModelEditorCore,
    mode: GetContentMode | CompatibleGetContentMode
) => string;

/**
 * Insert a DOM node into editor content
 * @param core The ContentModelEditorCore object. No op if null.
 * @param option An insert option object to specify how to insert the node
 */
export type InsertNode = (
    core: ContentModelEditorCore,
    node: Node,
    option: InsertOption | null
) => boolean;

/**
 * Get style based format state from current selection, including font name/size and colors
 * @param core The ContentModelEditorCore objects
 * @param node The node to get style from
 */
export type GetStyleBasedFormatState = (
    core: ContentModelEditorCore,
    node: Node | null
) => StyleBasedFormatState;

/**
 * Ensure user will type into a container element rather than into the editor content DIV directly
 * @param core The ContentModelEditorCore object.
 * @param position The position that user is about to type to
 * @param keyboardEvent Optional keyboard event object
 * @param deprecated Deprecated parameter, not used
 */
export type EnsureTypeInContainer = (
    core: ContentModelEditorCore,
    position: NodePosition,
    keyboardEvent?: KeyboardEvent,
    deprecated?: boolean
) => void;

/**
 * Core API map for Content Model editor
 */
export interface ContentModelCoreApiMap {
    /**
     * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
     * if triggerContentChangedEvent is set to true
     * @param core The ContentModelEditorCore object
     * @param content HTML content to set in
     * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
     */
    setContent: SetContent;

    /**
     * Insert a DOM node into editor content
     * @param core The ContentModelEditorCore object. No op if null.
     * @param option An insert option object to specify how to insert the node
     */
    insertNode: InsertNode;

    /**
     * Get current editor content as HTML string
     * @param core The ContentModelEditorCore object
     * @param mode specify what kind of HTML content to retrieve
     * @returns HTML string representing current editor content
     */
    getContent: GetContent;

    /**
     * Get style based format state from current selection, including font name/size and colors
     * @param core The ContentModelEditorCore objects
     * @param node The node to get style from
     */
    getStyleBasedFormatState: GetStyleBasedFormatState;

    /**
     * Ensure user will type into a container element rather than into the editor content DIV directly
     * @param core The EditorCore object.
     * @param position The position that user is about to type to
     * @param keyboardEvent Optional keyboard event object
     * @param deprecated Deprecated parameter, not used
     */
    ensureTypeInContainer: EnsureTypeInContainer;
}

/**
 * Represents the core data structure of a Content Model editor
 */
export interface ContentModelEditorCore {
    /**
     * Standalone editor core
     */
    standaloneEditorCore: StandaloneEditorCore;

    /**
     * Core API map of this editor
     */
    readonly api: ContentModelCoreApiMap;

    /**
     * Original API map of this editor. Overridden core API can use API from this map to call the original version of core API.
     */
    readonly originalApi: ContentModelCoreApiMap;

    /**
     * Bridge plugin to connect standalone editor plugins
     */
    readonly bridgePlugin: EditorPlugin;

    /*
     * Current zoom scale, default value is 1
     * When editor is put under a zoomed container, need to pass the zoom scale number using this property
     * to let editor behave correctly especially for those mouse drag/drop behaviors
     */
    zoomScale: number;

    /**
     * @deprecated Use zoomScale instead
     */
    sizeTransformer: SizeTransformer;

    /**
     * Custom data of this editor
     */
    customData: Record<string, CustomData>;

    /**
     * Enabled experimental features
     */
    experimentalFeatures: (ExperimentalFeatures | CompatibleExperimentalFeatures)[];

    /**
     * Plugin state of EditPlugin
     */
    edit: EditPluginState;
}
