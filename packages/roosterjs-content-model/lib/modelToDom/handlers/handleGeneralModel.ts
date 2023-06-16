import { ContentModelBlockHandler } from '../../publicTypes/context/ContentModelHandler';
import { ContentModelGeneralBlock } from '../../publicTypes/group/ContentModelGeneralBlock';
import { handleSegmentCommon } from '../utils/handleSegmentCommon';
import { isGeneralSegment } from '../../modelApi/common/isGeneralSegment';
import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { ModelToDomContext } from '../../publicTypes/context/ModelToDomContext';
import { NodeType } from 'roosterjs-editor-types';
import { reuseCachedElement } from '../utils/reuseCachedElement';
import { wrap } from 'roosterjs-editor-dom';

/**
 * @internal
 */
export const handleGeneralModel: ContentModelBlockHandler<ContentModelGeneralBlock> = (
    doc: Document,
    parent: Node,
    group: ContentModelGeneralBlock,
    context: ModelToDomContext,
    refNode: Node | null
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
        context.onNodeCreated?.(group, node);
    }

    context.modelHandlers.blockGroupChildren(doc, node, group, context);

    return refNode;
};
