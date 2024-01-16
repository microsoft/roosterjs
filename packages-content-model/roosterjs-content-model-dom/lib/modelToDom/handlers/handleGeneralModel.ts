import { handleSegmentCommon } from '../utils/handleSegmentCommon';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { reuseCachedElement } from '../../domUtils/reuseCachedElement';
import { wrap } from '../../domUtils/wrap';
import type {
    ContentModelBlockHandler,
    ContentModelGeneralBlock,
    ContentModelGeneralSegment,
    ContentModelSegmentHandler,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleGeneralBlock: ContentModelBlockHandler<ContentModelGeneralBlock> = (
    doc,
    parent,
    group,
    context,
    refNode
) => {
    let node: Node = group.element;

    if (refNode && node.parentNode == parent) {
        refNode = reuseCachedElement(parent, node, refNode);
    } else {
        node = node.cloneNode();
        group.element = node as HTMLElement;

        parent.insertBefore(node, refNode);
    }

    context.onNodeCreated?.(group, node);
    context.modelHandlers.blockGroupChildren(doc, node, group, context);

    return refNode;
};

/**
 * @internal
 */
export const handleGeneralSegment: ContentModelSegmentHandler<ContentModelGeneralSegment> = (
    doc,
    parent,
    group,
    context,
    segmentNodes
) => {
    const node = group.element.cloneNode() as HTMLElement;
    group.element = node;
    parent.appendChild(node);

    if (isNodeOfType(node, 'ELEMENT_NODE')) {
        const element = wrap(doc, node, 'span');

        handleSegmentCommon(doc, node, element, group, context, segmentNodes);
        context.onNodeCreated?.(group, node);
    }

    context.modelHandlers.blockGroupChildren(doc, node, group, context);
};
