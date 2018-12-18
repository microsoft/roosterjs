import getInlineElementAtNode from './getInlineElementAtNode';
import NodeBlockElement from '../blockElements/NodeBlockElement';
import { BlockElement, InlineElement } from 'roosterjs-editor-types';
import { getFirstInlineElement, getLastInlineElement } from './getFirstLastInlineElement';

/**
 * Get first/last InlineElement of the given BlockElement
 * @param block The BlockElement to get InlineElement from
 * @param isFirst True to get first InlineElement, false to get last InlineElement
 */
export default function getFirstLastInlineElementFromBlockElement(
    block: BlockElement,
    isFirst: boolean
): InlineElement {
    if (block instanceof NodeBlockElement) {
        let blockNode = block.getStartNode();
        return isFirst ? getFirstInlineElement(blockNode) : getLastInlineElement(blockNode);
    } else {
        return getInlineElementAtNode(block, isFirst ? block.getStartNode() : block.getEndNode());
    }
}
