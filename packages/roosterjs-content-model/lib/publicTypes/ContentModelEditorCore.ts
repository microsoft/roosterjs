import { ContentModelDocument } from './group/ContentModelDocument';
import { ContentModelSegmentFormat } from './format/ContentModelSegmentFormat';
import { CoreApiMap, EditorCore } from 'roosterjs-editor-types';
import { DomToModelOption, ModelToDomOption } from './IContentModelEditor';
import { EditorContext } from './context/EditorContext';

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
    option?: DomToModelOption
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
     * Whether reuse Content Model is allowed
     */
    reuseModel: boolean;

    /**
     * Whether adding delimiter for entity is allowed
     */
    addDelimiterForEntity: boolean;
}
