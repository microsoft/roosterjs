import type { ContentModelPluginState } from './pluginState/ContentModelPluginState';
import type { CoreApiMap, EditorCore, SelectionRangeEx } from 'roosterjs-editor-types';
import type {
    ContentModelDocument,
    ContentModelSegmentFormat,
    DomToModelOption,
    DomToModelSettings,
    EditorContext,
    ModelToDomOption,
    ModelToDomSettings,
    OnNodeCreated,
} from 'roosterjs-content-model-types';

/**
 * Create a EditorContext object used by ContentModel API
 * @param core The ContentModelEditorCore object
 */
export type CreateEditorContext = (core: ContentModelEditorCore) => EditorContext;

/**
 * Create Content Model from DOM tree in this editor
 * @param core The ContentModelEditorCore object
 * @param option The option to customize the behavior of DOM to Content Model conversion
 * @param selectionOverride When passed, use this selection range instead of current selection in editor
 */
export type CreateContentModel = (
    core: ContentModelEditorCore,
    option?: DomToModelOption,
    selectionOverride?: SelectionRangeEx
) => ContentModelDocument;

/**
 * Set content with content model
 * @param core The ContentModelEditorCore object
 * @param model The content model to set
 * @param option Additional options to customize the behavior of Content Model to DOM conversion
 * @param onNodeCreated An optional callback that will be called when a DOM node is created
 */
export type SetContentModel = (
    core: ContentModelEditorCore,
    model: ContentModelDocument,
    option?: ModelToDomOption,
    onNodeCreated?: OnNodeCreated
) => SelectionRangeEx | null;

/**
 * The interface for the map of core API for Content Model editor.
 * Editor can call call API from this map under ContentModelEditorCore object
 */
export interface ContentModelCoreApiMap extends CoreApiMap {
    /**
     * Create a EditorContext object used by ContentModel API
     * @param core The ContentModelEditorCore object
     */
    createEditorContext: CreateEditorContext;

    /**
     * Create Content Model from DOM tree in this editor
     * @param core The ContentModelEditorCore object
     * @param option The option to customize the behavior of DOM to Content Model conversion
     */
    createContentModel: CreateContentModel;

    /**
     * Set content with content model
     * @param core The ContentModelEditorCore object
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     */
    setContentModel: SetContentModel;
}

/**
 * Represents the core data structure of a Content Model editor
 */
export interface ContentModelEditorCore extends EditorCore, ContentModelPluginState {
    /**
     * Core API map of this editor
     */
    readonly api: ContentModelCoreApiMap;

    /**
     * Original API map of this editor. Overridden core API can use API from this map to call the original version of core API.
     */
    readonly originalApi: ContentModelCoreApiMap;

    /**
     * Default format used by Content Model. This is calculated from lifecycle.defaultFormat
     */
    defaultFormat: ContentModelSegmentFormat;

    /**
     * Default DOM to Content Model options
     */
    defaultDomToModelOptions: (DomToModelOption | undefined)[];

    /**
     * Default Content Model to DOM options
     */
    defaultModelToDomOptions: (ModelToDomOption | undefined)[];

    /**
     * Default DOM to Content Model config, calculated from defaultDomToModelOptions,
     * will be used for creating content model if there is no other customized options
     */
    defaultDomToModelConfig: DomToModelSettings;

    /**
     * Default Content Model to DOM config, calculated from defaultModelToDomOptions,
     * will be used for setting content model if there is no other customized options
     */
    defaultModelToDomConfig: ModelToDomSettings;
}
