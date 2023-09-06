import { CoreApiMap, EditorCore, SelectionRangeEx } from 'roosterjs-editor-types';
import {
    ContentModelDocument,
    ContentModelHandlerMap,
    ContentModelSegmentFormat,
    DomToModelOption,
    EditorContext,
    ElementProcessorMap,
    FormatAppliers,
    FormatAppliersPerCategory,
    FormatParsers,
    FormatParsersPerCategory,
    ModelToDomOption,
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
     * Cached selection range ex. This range only exist when cached model exists and it has selection
     */
    cachedRangeEx?: SelectionRangeEx;

    /**
     * Default format used by Content Model. This is calculated from lifecycle.defaultFormat
     */
    defaultFormat: ContentModelSegmentFormat;

    /**
     * Overrides default format handlers
     */
    formatParserOverride?: Partial<FormatParsers>;

    /**
     * Provide additional format parsers for each format type
     */
    additionalFormatParsers?: Partial<FormatParsersPerCategory>;

    /**
     * Base processor map to override the default one
     */
    baseProcessorMap?: Readonly<ElementProcessorMap>;

    /**
     * Overrides default format appliers
     */
    formatApplierOverride?: Partial<FormatAppliers>;

    /**
     * Provide additional format appliers for each format type
     */
    additionalFormatAppliers?: Partial<FormatAppliersPerCategory>;

    /**
     * Base handler map to override the default one
     */
    baseHandlerMap?: Readonly<ContentModelHandlerMap>;

    /**
     * Whether adding delimiter for entity is allowed
     */
    addDelimiterForEntity: boolean;
}
