import { ContentModelDocument } from './group/ContentModelDocument';
import { IEditor, SelectionRangeEx } from 'roosterjs-editor-types';
import {
    ContentModelHandlerMap,
    DefaultImplicitFormatMap,
    FormatAppliers,
    FormatAppliersPerCategory,
} from './context/ModelToDomSettings';
import {
    DefaultStyleMap,
    ElementProcessorMap,
    FormatParsers,
    FormatParsersPerCategory,
} from './context/DomToModelSettings';

/**
 * Options for creating DomToModelContext
 */
export interface DomToModelOption {
    /**
     * True to create content model from the root element itself, false to create from all child nodes of root. @default false
     */
    includeRoot?: boolean;

    /**
     * Selection range to be included in Content Model
     */
    selectionRange?: SelectionRangeEx;

    /**
     * Overrides default element processors
     */
    processorOverride?: Partial<ElementProcessorMap>;

    /**
     * Overrides default element styles
     */
    defaultStyleOverride?: DefaultStyleMap;

    /**
     * Overrides default format handlers
     */
    formatParserOverride?: Partial<FormatParsers>;

    /**
     * When process table, whether we should always normalize it.
     * This can help persist the size of table that is not created from Content Model
     * @default false
     */
    alwaysNormalizeTable?: boolean;
}

/**
 * Options for creating ModelToDomContext
 */
export interface ModelToDomOption {
    /**
     * Overrides default format appliers
     */
    formatApplierOverride?: Partial<FormatAppliers>;

    /**
     * Provide additional format appliers for each format type
     */
    additionalFormatAppliers?: Partial<FormatAppliersPerCategory>;

    /**
     * Overrides default model handlers
     */
    modelHandlerOverride?: Partial<ContentModelHandlerMap>;

    /**
     * Overrides default element styles
     */
    defaultImplicitFormatOverride?: DefaultImplicitFormatMap;
}

/**
 * An interface of editor with Content Model support.
 * (This interface is still under development, and may still be changed in the future with some breaking changes)
 */
export interface IContentModelEditor extends IEditor {
    /**
     * Create Content Model from DOM tree in this editor
     * @param rootNode Optional start node. If provided, Content Model will be created from this node (including itself),
     * otherwise it will create Content Model for the whole content in editor.
     * @param option The options to customize the behavior of DOM to Content Model conversion
     */
    createContentModel(option?: DomToModelOption): ContentModelDocument;

    /**
     * Set content with content model
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     */
    setContentModel(model: ContentModelDocument, option?: ModelToDomOption): void;
}
