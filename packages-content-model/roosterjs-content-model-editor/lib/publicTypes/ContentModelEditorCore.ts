import type { ContentModelCorePluginState } from './ContentModelCorePlugins';
import type { StandaloneEditorCore } from 'roosterjs-content-model-types';
import type {
    CustomData,
    ExperimentalFeatures,
    GetContentMode,
    InsertOption,
    SizeTransformer,
    DarkColorHandler,
} from 'roosterjs-editor-types';

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
    mode: GetContentMode
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
 * Core API map for Content Model editor
 */
export interface ContentModelCoreApiMap {
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
}

/**
 * Represents the core data structure of a Content Model editor
 */
export interface ContentModelEditorCore extends ContentModelCorePluginState {
    /**
     * Core API map of this editor
     */
    readonly api: ContentModelCoreApiMap;

    /**
     * Original API map of this editor. Overridden core API can use API from this map to call the original version of core API.
     */
    readonly originalApi: ContentModelCoreApiMap;

    /**
     * Custom data of this editor
     */
    readonly customData: Record<string, CustomData>;

    /**
     * Enabled experimental features
     */
    readonly experimentalFeatures: ExperimentalFeatures[];

    /**
     * Dark model handler for the editor, used for variable-based solution.
     * If keep it null, editor will still use original dataset-based dark mode solution.
     */
    readonly darkColorHandler: DarkColorHandler;

    /**
     * @deprecated Use zoomScale instead
     */
    readonly sizeTransformer: SizeTransformer;
}
