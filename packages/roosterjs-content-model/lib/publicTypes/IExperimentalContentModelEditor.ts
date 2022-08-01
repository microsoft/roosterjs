import { ContentModelContext } from './ContentModelContext';
import { ContentModelDocument } from './block/group/ContentModelDocument';
import { IEditor } from 'roosterjs-editor-types';

/**
 * !!! This is a temporary interface and will be removed in the future !!!
 *
 * An interface of editor with Content Model support (in experiment)
 */
export interface IExperimentalContentModelEditor extends IEditor {
    /**
     * Create a ContentModelContext object used by ContentModel API
     */
    createContentModelContext(): ContentModelContext;

    /**
     * Create Content Model from DOM tree in this editor
     * @param startNode Optional start node. If provided, Content Model will be created from this node (including itself),
     * otherwise it will create Content Model for the whole content in editor.
     */
    createContentModel(startNode?: HTMLElement): ContentModelDocument;

    /**
     * Create DOM fragment from Content Model
     * @param model The Content Model to create fragment from
     */
    createFragmentFromContentModel(model: ContentModelDocument): DocumentFragment;
}
