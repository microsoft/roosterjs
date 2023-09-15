import { ContentModelBlock } from '../block/ContentModelBlock';
import { ContentModelBlockGroup } from '../group/ContentModelBlockGroup';
import { ContentModelDecorator } from '../decorator/ContentModelDecorator';
import { ContentModelSegment } from '../segment/ContentModelSegment';
import { ModelToDomContext } from './ModelToDomContext';
import { OnNodeCreated } from './ModelToDomSettings';

/**
 * Type of Content Model to DOM handler
 * @param doc Target HTML Document object
 * @param parent Parent HTML node to append the new node from the given model
 * @param model The Content Model to handle
 * @param context The context object to provide related information
 * @param onNodeCreated An optional callback that will be called when a DOM node is created.
 * Note that this callback will only impact the current handler, but it won't be passed down to deeper handlers.
 * It is only supposed to be used as an additional parameter of customized model handlers
 */
export type ContentModelHandler<
    T extends ContentModelSegment | ContentModelBlockGroup | ContentModelDecorator
> = (
    doc: Document,
    parent: Node,
    model: T,
    context: ModelToDomContext,
    onNodeCreated?: OnNodeCreated
) => void;

/**
 * Type of Content Model to DOM handler for block
 * @param doc Target HTML Document object
 * @param parent Parent HTML node to append the new node from the given model
 * @param model The Content Model to handle
 * @param context The context object to provide related information
 * @param refNode Reference node. This is the next node the new node to be inserted.
 * It is used when write DOM tree onto existing DOM true. If there is no reference node, pass null.
 * @param onNodeCreated An optional callback that will be called when a DOM node is created
 * Note that this callback will only impact the current handler, but it won't be passed down to deeper handlers
 * It is only supposed to be used as an additional parameter of customized model handlers
 */
export type ContentModelBlockHandler<T extends ContentModelBlock | ContentModelBlockGroup> = (
    doc: Document,
    parent: Node,
    model: T,
    context: ModelToDomContext,
    refNode: Node | null,
    onNodeCreated?: OnNodeCreated
) => Node | null;
