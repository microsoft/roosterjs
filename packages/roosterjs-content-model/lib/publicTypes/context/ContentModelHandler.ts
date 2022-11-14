import { ContentModelBlock } from '../block/ContentModelBlock';
import { ContentModelBlockGroup } from '../group/ContentModelBlockGroup';
import { ContentModelSegment } from '../segment/ContentModelSegment';
import { ModelToDomContext } from './ModelToDomContext';

/**
 * Type of Content Model to DOM handler
 * @param doc Target HTML Document object
 * @param parent Parent HTML node to append the new node from the given model
 * @param model The Content Model to handle
 * @param context The context object to provide related information
 */
export type ContentModelHandler<
    T extends ContentModelSegment | ContentModelBlock | ContentModelBlockGroup
> = (doc: Document, parent: Node, model: T, context: ModelToDomContext) => void;
