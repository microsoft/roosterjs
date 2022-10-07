import { ContentModelDocument } from './block/group/ContentModelDocument';
import { DefaultStyleMap, FormatParsers } from './context/DomToModelSettings';
import { EditorContext } from './context/EditorContext';
import { ElementProcessor } from './context/ElementProcessor';
import { EntityPlaceholderPair } from './context/ModelToDomEntityContext';
import { FormatAppliers } from './context/ModelToDomSettings';
import { IEditor, SelectionRangeEx } from 'roosterjs-editor-types';

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
    processorOverride?: Record<string, ElementProcessor>;

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
     * A callback to specify how to merge DOM tree generated from Content Model in to existing container
     * @param source Source document fragment that is generated from Content Model
     * @param target Target container, usually to be editor root container
     * @param entityPairs An array of entity wrapper - placeholder pairs, used for reuse existing DOM structure for entity
     */
    mergingCallback?: (
        source: DocumentFragment,
        target: HTMLElement,
        entityPairs: EntityPlaceholderPair[]
    ) => void;

    /**
     * Overrides default format appliers
     */
    formatApplierOverride?: Partial<FormatAppliers>;
}

/**
 * !!! This is a temporary interface and will be removed in the future !!!
 *
 * An interface of editor with Content Model support (in experiment)
 */
export interface IExperimentalContentModelEditor extends IEditor {
    /**
     * Create a EditorContext object used by ContentModel API
     */
    createEditorContext(): EditorContext;

    /**
     * Create Content Model from DOM tree in this editor
     * @param rootNode Optional start node. If provided, Content Model will be created from this node (including itself),
     * otherwise it will create Content Model for the whole content in editor.
     * @param option The options to customize the behavior of DOM to Content Model conversion
     */
    createContentModel(rootNode?: HTMLElement, option?: DomToModelOption): ContentModelDocument;

    /**
     * Set content with content model
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     */
    setContentModel(model: ContentModelDocument, option?: ModelToDomOption): void;
}
