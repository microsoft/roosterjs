import { ContentModelBlock } from '../block/ContentModelBlock';
import { ContentModelBlockGroup } from '../group/ContentModelBlockGroup';
import { ContentModelDecorator } from '../decorator/ContentModelDecorator';
import { ContentModelParagraph } from '../block/ContentModelParagraph';
import { ContentModelSegment } from '../segment/ContentModelSegment';
import { ModelToDomContext } from './ModelToDomContext';

/**
 * Type of Content Model to DOM handler for segment
 * @param doc Target HTML Document object
 * @param parent Parent HTML node to append the new node from the given model
 * @param model The Content Model to handle
 * @param context The context object to provide related information
 * @param paragraph Parent paragraph of current segment
 * @param newNodes DOM Nodes created during this handling process
 * Note that this parameter will only impact the current handler, it won't be passed down to deeper handlers.
 * It is only supposed to be used as an additional parameter of customized model handlers
 */
export type ContentModelSegmentHandler<T extends ContentModelSegment | ContentModelDecorator> = (
    doc: Document,
    parent: Node,
    model: T,
    context: ModelToDomContext,
    paragraph: ContentModelParagraph,
    newNodes?: Node[]
) => void;

/**
 * Type of Content Model to DOM handler for block
 * @param doc Target HTML Document object
 * @param parent Parent HTML node to append the new node from the given model
 * @param model The Content Model to handle
 * @param context The context object to provide related information
 * @param refNode Reference node. This is the next node the new node to be inserted.
 * It is used when write DOM tree onto existing DOM true. If there is no reference node, pass null.
 * @param newNodes DOM Nodes created during this handling process
 * Note that this parameter will only impact the current handler, it won't be passed down to deeper handlers.
 * It is only supposed to be used as an additional parameter of customized model handlers
 */
export type ContentModelBlockHandler<T extends ContentModelBlock | ContentModelBlockGroup> = (
    doc: Document,
    parent: Node,
    model: T,
    context: ModelToDomContext,
    refNode: Node | null,
    newNodes?: Node[]
) => Node | null;

/**
 * Type of Content Model to DOM handler for segment and block
 * @param doc Target HTML Document object
 * @param parent Parent HTML node to append the new node from the given model
 * @param model The Content Model to handle
 * @param context The context object to provide related information
 * @param paragraph Parent paragraph of current segment
 * @param refNode Reference node. This is the next node the new node to be inserted.
 * It is used when write DOM tree onto existing DOM true. If there is no reference node, pass null.
 * @param newNodes DOM Nodes created during this handling process
 * Note that this parameter will only impact the current handler, it won't be passed down to deeper handlers.
 * It is only supposed to be used as an additional parameter of customized model handlers
 */
export type ContentModelBlockAndSegmentHandler<
    T extends ContentModelSegment | ContentModelBlock
> = (
    doc: Document,
    parent: Node,
    model: T,
    context: ModelToDomContext,
    paragraph: ContentModelParagraph | null,
    refNode: Node | null,
    newNodes?: Node[]
) => Node | null;
