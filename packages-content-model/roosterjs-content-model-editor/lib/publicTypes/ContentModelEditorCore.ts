import { ContentModelCachePluginState } from './pluginState/ContentModelCachePluginState';
import { CoreApiMap, EditorCore, SelectionRangeEx } from 'roosterjs-editor-types';
import {
    ContentModelDocument,
    ContentModelSegmentFormat,
    DomToModelOption,
    EditorContext,
    ModelToDomOption,
} from 'roosterjs-content-model-types';

/**
 *
 */
export interface CreateContentModelOptions {
    /**
     *
     */
    useReducedModel?: boolean;

    /**
     * When specified, use this selection to override existing selection inside editor
     */
    selectionOverride?: SelectionRangeEx;
}

/**
 * Create a EditorContext object used by ContentModel API
 * @param core The ContentModelEditorCore object
 */
export type CreateEditorContext = (core: ContentModelEditorCore) => EditorContext;

/**
 * Create Content Model from DOM tree in this editor
 * @param core The ContentModelEditorCore object
 * @param option The option to customize the behavior of DOM to Content Model conversion
 */
export type CreateContentModel = (
    core: ContentModelEditorCore,
    option: CreateContentModelOptions
) => ContentModelDocument;

/**
 * Set content with content model
 * @param core The ContentModelEditorCore object
 * @param model The content model to set
 * @param option Additional options to customize the behavior of Content Model to DOM conversion
 */
export type SetContentModel = (
    core: ContentModelEditorCore,
    model: ContentModelDocument,
    option?: ModelToDomOption
) => void;

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
export interface ContentModelEditorCore extends EditorCore {
    /**
     * Core API map of this editor
     */
    readonly api: ContentModelCoreApiMap;

    /**
     * Original API map of this editor. Overridden core API can use API from this map to call the original version of core API.
     */
    readonly originalApi: ContentModelCoreApiMap;

    /**
     * When reuse Content Model is allowed, we cache the Content Model object here after created
     */
    cachedModel?: ContentModelDocument;

    /**
     *
     */
    cache: ContentModelCachePluginState;

    /**
     * Segment indexer helps create an index of segments, so we can easily update selection in content model
     * when selection is changed
     */
    // segmentIndexer: SegmentIndexer;

    /**
     * Default format used by Content Model. This is calculated from lifecycle.defaultFormat
     */
    defaultFormat: ContentModelSegmentFormat;

    /**
     * Default DOM to Content Model options
     */
    defaultDomToModelOptions: DomToModelOption;

    /**
     * Default Content Model to DOM options
     */
    defaultModelToDomOptions: ModelToDomOption;

    /**
     * Whether adding delimiter for entity is allowed
     */
    addDelimiterForEntity: boolean;
}
