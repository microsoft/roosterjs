import { applyFormat } from '../utils/applyFormat';
import { handleSegmentCommon } from '../utils/handleSegmentCommon';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { reuseCachedElement } from '../../domUtils/reuseCachedElement';
import { wrap } from '../../domUtils/wrap';
import type {
    ContentModelBlockHandler,
    ContentModelSegmentHandler,
    ReadonlyContentModelGeneralBlock,
    ReadonlyContentModelGeneralSegment,
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
export const handleGeneralSegment: ContentModelSegmentHandler<ReadonlyContentModelGeneralSegment> = (
    doc,
    parent,
    group,
    context,
    segmentNodes
) => {
    parent.appendChild(group.element);

    if (isNodeOfType(group.element, 'ELEMENT_NODE')) {
        const element = wrap(doc, group.element, 'span');

        handleSegmentCommon(doc, group.element, element, group, context, segmentNodes);
        applyFormat(group.element, context.formatAppliers.general, group.format, context);

        context.onNodeCreated?.(group, group.element);
    }

    context.modelHandlers.blockGroupChildren(doc, group.element, group, context);
};
