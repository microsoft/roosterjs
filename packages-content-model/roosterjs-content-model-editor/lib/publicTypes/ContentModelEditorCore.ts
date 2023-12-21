import type { EditorPlugin, StandaloneEditorCore } from 'roosterjs-content-model-types';
import type {
    CompatibleGetContentMode,
    CompatibleExperimentalFeatures,
} from 'roosterjs-editor-types/lib/compatibleTypes';
import type {
    CustomData,
    ExperimentalFeatures,
    ContentMetadata,
    GetContentMode,
    InsertOption,
    NodePosition,
    StyleBasedFormatState,
    EditPluginState,
    SizeTransformer,
} from 'roosterjs-editor-types';

/**
 * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
 * if triggerContentChangedEvent is set to true
 * @param core The ContentModelEditorCore object
 * @param innerCore The StandaloneEditorCore object
 * @param content HTML content to set in
 * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
 */
export type SetContent = (
    core: ContentModelEditorCore,
    innerCore: StandaloneEditorCore,
    content: string,
    triggerContentChangedEvent: boolean,
    metadata?: ContentMetadata
) => void;

/**
 * Get current editor content as HTML string
 * @param core The ContentModelEditorCore object
 * @param innerCore The StandaloneEditorCore object
 * @param mode specify what kind of HTML content to retrieve
 * @returns HTML string representing current editor content
 */
export type GetContent = (
    core: ContentModelEditorCore,
    innerCore: StandaloneEditorCore,
    mode: GetContentMode | CompatibleGetContentMode
) => string;

/**
 * Insert a DOM node into editor content
 * @param core The ContentModelEditorCore object. No op if null.
 * @param innerCore The StandaloneEditorCore object
 * @param option An insert option object to specify how to insert the node
 */
export type InsertNode = (
    core: ContentModelEditorCore,
    innerCore: StandaloneEditorCore,
    node: Node,
    option: InsertOption | null
) => boolean;

/**
 * Get style based format state from current selection, including font name/size and colors
 * @param core The ContentModelEditorCore objects
 * @param innerCore The StandaloneEditorCore object
 * @param node The node to get style from
 */
export type GetStyleBasedFormatState = (
    core: ContentModelEditorCore,
    innerCore: StandaloneEditorCore,
    node: Node | null
) => StyleBasedFormatState;

/**
 * Ensure user will type into a container element rather than into the editor content DIV directly
 * @param core The ContentModelEditorCore object.
 * @param innerCore The StandaloneEditorCore object
 * @param position The position that user is about to type to
 * @param keyboardEvent Optional keyboard event object
 * @param deprecated Deprecated parameter, not used
 */
export type EnsureTypeInContainer = (
    core: ContentModelEditorCore,
    innerCore: StandaloneEditorCore,
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
     * @param innerCore The StandaloneEditorCore object
     * @param content HTML content to set in
     * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
     */
    setContent: SetContent;

    /**
     * Insert a DOM node into editor content
     * @param core The ContentModelEditorCore object. No op if null.
     * @param innerCore The StandaloneEditorCore object
     * @param option An insert option object to specify how to insert the node
     */
    insertNode: InsertNode;

    /**
     * Get current editor content as HTML string
     * @param core The ContentModelEditorCore object
     * @param innerCore The StandaloneEditorCore object
     * @param mode specify what kind of HTML content to retrieve
     * @returns HTML string representing current editor content
     */
    getContent: GetContent;

    /**
     * Get style based format state from current selection, including font name/size and colors
     * @param core The ContentModelEditorCore objects
     * @param innerCore The StandaloneEditorCore object
     * @param node The node to get style from
     */
    getStyleBasedFormatState: GetStyleBasedFormatState;

    /**
     * Ensure user will type into a container element rather than into the editor content DIV directly
     * @param core The EditorCore object.
     * @param innerCore The StandaloneEditorCore object
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

    /**
     * Custom data of this editor
     */
    readonly customData: Record<string, CustomData>;

    /**
     * Enabled experimental features
     */
    readonly experimentalFeatures: (ExperimentalFeatures | CompatibleExperimentalFeatures)[];

    /**
     * Plugin state of EditPlugin
     */
    readonly edit: EditPluginState;

    /**
     * @deprecated Use zoomScale instead
     */
    readonly sizeTransformer: SizeTransformer;
}
