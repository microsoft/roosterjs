import { ContentModelDocument } from './block/group/ContentModelDocument';
import { FormatContext } from '../formatHandlers/FormatContext';
import { IEditor } from 'roosterjs-editor-types';

/**
 * !!! This is a temporary interface and will be removed in the future !!!
 *
 * An interface of editor with Content Model support (in experiment)
 */
export interface IExperimentalContentModelEditor extends IEditor {
    createFormatContext(): FormatContext;

    /**
     * Create Content Model from DOM tree in this editor
     * @param startNode Optional start node. If provided, Content Model will be created from this node (including itself),
     * otherwise it will create Content Model for the whole content in editor.
     */
    getContentModel(startNode?: HTMLElement): ContentModelDocument;

    /**
     * Create DOM fragment from Content Model
     * @param model The Content Model to create fragment from
     */
    getDOMFromContentModel(model: ContentModelDocument): DocumentFragment;
}
