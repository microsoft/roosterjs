import { BlockElement } from 'roosterjs-editor-types';
import ContentTraverser from '../contentTraverser/ContentTraverser';
import createRange from '../selection/createRange';

/**
 * get block element's text content.
 * @param rootNode Root node that the get the textContent of.
 * @param startNode Node the node start traverser to start traversing.
 * @returns text content of given text content.
 */
export default function getBlockElementTextContent(rootNode: Node, startNode?: Node): string {
    const traverser = ContentTraverser.createBodyTraverser(rootNode, startNode);
    let block = traverser && traverser.currentBlockElement;
    let blocks: BlockElement[] = [];
    let textContent: string = '';

    while (block) {
        blocks.push(block);
        block = traverser.getNextBlockElement();
    }

    blocks.forEach((block, index) => {
        const blockTextContent = getBlockTextContent(block);
        if (blockTextContent) {
            textContent = `${textContent}${blockTextContent}`;
        }
        if (index != blocks.length - 1) {
            textContent = `${textContent}\n`
        }
    });

    return textContent;
}

function getBlockTextContent(block: BlockElement) {
    return block.getStartNode() == block.getEndNode()
        ? block.getStartNode().textContent
        : createRange(block.getStartNode(), block.getEndNode()).toString();
}

