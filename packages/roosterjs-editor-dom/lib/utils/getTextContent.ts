import ContentTraverser from '../contentTraverser/ContentTraverser';

/**
 * get block element's text content.
 * @param rootNode Root node that the get the textContent of.
 * @param startNode Node the node start traverser to start traversing.
 * @returns text content of given text content.
 */
export default function getTextContent(rootNode: Node): string {
    const traverser = ContentTraverser.createBodyTraverser(rootNode);
    let block = traverser && traverser.currentBlockElement;
    let textContent: string[] = [];

    while (block) {
        textContent.push(block.getTextContent());
        block = traverser.getNextBlockElement();
    }

    return textContent.join('\n');
}
