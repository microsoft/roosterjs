import contains from '../utils/contains';
import isNodeAfter from '../utils/isNodeAfter';
import { BlockElement } from 'roosterjs-editor-types';

/**
 * @internal
 * This presents a content block that can be represented by a single html block type element.
 * In most cases, it corresponds to an HTML block level element, i.e. P, DIV, LI, TD etc.
 */
export default class NodeBlockElement implements BlockElement {
    constructor(private element: HTMLElement) {}

    /**
     * Collapse this element to a single DOM element.
     * If the content nodes are separated in different root nodes, wrap them to a single node
     * If the content nodes are included in root node with other nodes, split root node
     */
    public collapseToSingleElement(): HTMLElement {
        return this.element;
    }

    /**
     * Get the start node of the block
     * For NodeBlockElement, start and end essentially refers to same node
     */
    public getStartNode(): Node {
        return this.element;
    }

    /**
     * Get the end node of the block
     * For NodeBlockElement, start and end essentially refers to same node
     */
    public getEndNode(): Node {
        return this.element;
    }

    /**
     * Checks if it refers to same block
     */
    public equals(blockElement: BlockElement): boolean {
        // Ideally there is only one unique way to generate a block so we only need to compare the startNode
        return this.element == blockElement.getStartNode();
    }

    /**
     * Checks if a block is after the current block
     */
    public isAfter(blockElement: BlockElement): boolean {
        // if the block's startNode is after current node endEnd, we say it is after
        return isNodeAfter(this.element, blockElement.getEndNode());
    }

    /**
     * Checks if a certain html node is within the block
     */
    public contains(node: Node): boolean {
        return contains(this.element, node, true /*treatSameNodeAsContain*/);
    }

    /**
     * Get the text content of this block element
     */
    public getTextContent(): string {
        return this.element?.textContent || '';
    }
}
