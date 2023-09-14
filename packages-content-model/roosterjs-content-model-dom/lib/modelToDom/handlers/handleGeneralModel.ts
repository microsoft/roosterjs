import { ContentModelBlockHandler, ContentModelGeneralBlock } from 'roosterjs-content-model-types';
import { handleSegmentCommon } from '../utils/handleSegmentCommon';
import { isGeneralSegment } from '../../modelApi/common/isGeneralSegment';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { NodeType } from 'roosterjs-editor-types';
import { reuseCachedElement } from '../utils/reuseCachedElement';
import { wrap } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export const handleGeneralModel: ContentModelBlockHandler<ContentModelGeneralBlock> = (
    doc,
    parent,
    group,
    context,
    refNode,
    onNodeCreated
) => {
    let node: Node = group.element;

    if (refNode && node.parentNode == parent) {
        refNode = reuseCachedElement(parent, node, refNode);
    } else {
        node = node.cloneNode();
        group.element = node as HTMLElement;

        parent.insertBefore(node, refNode);
    }

    if (isGeneralSegment(group) && isNodeOfType(node, NodeType.Element)) {
        const element = wrap(node, 'span');

        handleSegmentCommon(doc, node, element, group, context);
    } else {
        onNodeCreated?.(group, node);
    }

    context.modelHandlers.blockGroupChildren(doc, node, group, context);

    return refNode;
};
