import type { ContentModelBlock } from '../block/ContentModelBlock';
import type { ContentModelBlockGroup } from '../group/ContentModelBlockGroup';
import type { ContentModelDecorator } from '../decorator/ContentModelDecorator';
import type { ContentModelSegment } from '../segment/ContentModelSegment';
import type { ModelToDomContext } from './ModelToDomContext';

/**
 * Type of Content Model to DOM handler
 * @param doc Target HTML Document object
 * @param parent Parent HTML node to append the new node from the given model
 * @param model The Content Model to handle
 * @param context The context object to provide related information
 */
export type ContentModelHandler<
    T extends ContentModelSegment | ContentModelBlockGroup | ContentModelDecorator
> = (doc: Document, parent: Node, model: T, context: ModelToDomContext) => void;

/**
 * Type of Content Model to DOM handler for block
 * @param doc Target HTML Document object
 * @param parent Parent HTML node to append the new node from the given model
 * @param model The Content Model to handle
 * @param context The context object to provide related information
 * @param refNode Reference node. This is the next node the new node to be inserted.
 * It is used when write DOM tree onto existing DOM true. If there is no reference node, pass null.
 */
export type ContentModelBlockHandler<T extends ContentModelBlock | ContentModelBlockGroup> = (
    doc: Document,
    parent: Node,
    model: T,
    context: ModelToDomContext,
    refNode: Node | null
) => Node | null;

/**
 * Type of Content Model to DOM handler for block
 * @param doc Target HTML Document object
 * @param parent Parent HTML node to append the new node from the given model
 * @param model The Content Model to handle
 * @param context The context object to provide related information
 * @param segmentNodes Nodes that created to represent this segment. In most cases there will be one node returned, except
 * - For segments with decorators: decorator elements will also be included
 * - For inline entity segment, the delimiter SPANs will also be included
 */
export type ContentModelSegmentHandler<T extends ContentModelSegment> = (
    doc: Document,
    parent: Node,
    model: T,
    context: ModelToDomContext,
    segmentNodes: Node[]
) => void;
