import { handleSegmentCommon } from '../utils/handleSegmentCommon';
import { isGeneralSegment } from '../../modelApi/common/isGeneralSegment';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { NodeType } from 'roosterjs-editor-types';
import { reuseCachedElement } from '../utils/reuseCachedElement';
import { wrap } from 'roosterjs-editor-dom';
import {
    ContentModelBlockAndSegmentHandler,
    ContentModelGeneralBlock,
} from 'roosterjs-content-model-types';

/**
 * @internal
 */
export const handleGeneralModel: ContentModelBlockAndSegmentHandler<ContentModelGeneralBlock> = (
    doc,
    parent,
    group,
    context,
    paragraph,
    refNode,
    newNodes
) => {
    let node: Node = group.element;

    if (refNode && node.parentNode == parent) {
        refNode = reuseCachedElement(parent, node, refNode);
    } else {
        node = node.cloneNode();
        group.element = node as HTMLElement;

        parent.insertBefore(node, refNode);
    }

    if (isGeneralSegment(group) && isNodeOfType(node, NodeType.Element) && paragraph) {
        const element = wrap(node, 'span');

        handleSegmentCommon(doc, node, element, group, context, paragraph, newNodes);
    } else {
        newNodes?.push(node);
    }

    context.modelHandlers.blockGroupChildren(
        doc,
        node,
        group,
        context,
        null /*refNode, not used by blockGroupChildren handler*/
    );

    return refNode;
};
