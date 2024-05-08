import { applyFormat } from '../utils/applyFormat';
import { handleSegmentCommon } from '../utils/handleSegmentCommon';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { reuseCachedElement } from '../../domUtils/reuseCachedElement';
import { wrap } from '../../domUtils/wrap';
import type {
    ContentModelBlockHandler,
    ContentModelGeneralSegment,
    ContentModelSegmentHandler,
    ReadonlyContentModelGeneralBlock,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleGeneralBlock: ContentModelBlockHandler<ReadonlyContentModelGeneralBlock> = (
    doc,
    parent,
    group,
    context,
    refNode
) => {
    const { element } = group;

    if (refNode && element.parentNode == parent) {
        refNode = reuseCachedElement(parent, element, refNode);
    } else {
        applyFormat(element, context.formatAppliers.general, group.format, context);

        parent.insertBefore(element, refNode);
    }

    context.onNodeCreated?.(group, element);
    context.modelHandlers.blockGroupChildren(doc, element, group, context);

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
        applyFormat(node, context.formatAppliers.general, group.format, context);

        context.onNodeCreated?.(group, node);
    }

    context.modelHandlers.blockGroupChildren(doc, node, group, context);
};
