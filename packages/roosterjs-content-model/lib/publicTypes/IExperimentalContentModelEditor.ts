import { ContentModelDocument } from './block/group/ContentModelDocument';
import { DefaultStyleMap, FormatParsers } from './context/DomToModelSettings';
import { EditorContext } from './context/EditorContext';
import { ElementProcessor } from './context/ElementProcessor';
import { FormatAppliers } from './context/ModelToDomSettings';
import { IEditor } from 'roosterjs-editor-types';

/**
 * Options for creating DomToModelContext
 */
export interface DomToModelOption {
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
}

/**
 * Options for creating ModelToDomContext
 */
export interface ModelToDomOption {
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
     * @param startNode Optional start node. If provided, Content Model will be created from this node (including itself),
     * otherwise it will create Content Model for the whole content in editor.
     * @param option The options to customize the behavior of DOM to Content Model conversion
     */
    createContentModel(startNode?: HTMLElement, option?: DomToModelOption): ContentModelDocument;

    /**
     * Set content with content model
     * @param model The content model to set
     * @param mergingCallback A callback to indicate how should the new content be integrated into existing content
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     */
    setContentModel(
        model: ContentModelDocument,
        mergingCallback?: (fragment: DocumentFragment) => void,
        option?: ModelToDomOption
    ): void;
}
