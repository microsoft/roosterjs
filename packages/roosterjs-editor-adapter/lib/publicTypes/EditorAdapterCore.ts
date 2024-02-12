import type { StandaloneEditorCore } from 'roosterjs-content-model-types';
import type {
    CustomData,
    ExperimentalFeatures,
    InsertOption,
    SizeTransformer,
    DarkColorHandler,
    EditPluginState,
    ContextMenuProvider,
} from 'roosterjs-editor-types';

/**
 * Insert a DOM node into editor content
 * @param core The EditorAdapterCore object. No op if null.
 * @param innerCore The StandaloneEditorCore object
 * @param option An insert option object to specify how to insert the node
 */
export type InsertNode = (
    core: EditorAdapterCore,
    innerCore: StandaloneEditorCore,
    node: Node,
    option: InsertOption | null
) => boolean;

/**
 * Core API map for editor adapter
 */
export interface EditorAdapterCoreApiMap {
    /**
     * Insert a DOM node into editor content
     * @param core The EditorAdapterCore object. No op if null.
     * @param innerCore The StandaloneEditorCore object
     * @param option An insert option object to specify how to insert the node
     */
    insertNode: InsertNode;
}

/**
 * Represents the core data structure of a editor adapter
 */
export interface EditorAdapterCore {
    /**
     * Core API map of this editor
     */
    readonly api: EditorAdapterCoreApiMap;

    /**
     * Original API map of this editor. Overridden core API can use API from this map to call the original version of core API.
     */
    readonly originalApi: EditorAdapterCoreApiMap;

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
     * Plugin state of EditPlugin
     */
    readonly edit: EditPluginState;

    /**
     * Context Menu providers
     */
    readonly contextMenuProviders: ContextMenuProvider<any>[];

    /**
     * @deprecated Use zoomScale instead
     */
    readonly sizeTransformer: SizeTransformer;
}
