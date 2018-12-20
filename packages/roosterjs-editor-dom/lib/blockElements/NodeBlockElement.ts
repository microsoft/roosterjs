import contains from '../utils/contains';
import getNextPreviousInlineElement from '../inlineElements/getNextPreviousInlineElement';
import isNodeAfter from '../utils/isNodeAfter';
import { BlockElement, InlineElement } from 'roosterjs-editor-types';
import {
    getFirstInlineElement,
    getLastInlineElement,
} from '../inlineElements/getFirstLastInlineElement';

/**
 * This presents a content block that can be reprented by a single html block type element.
 * In most cases, it corresponds to an HTML block level element, i.e. P, DIV, LI, TD etc.
 */
export default class NodeBlockElement implements BlockElement {
    private firstInline: InlineElement;
    private lastInline: InlineElement;

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
     * @deprecated
     * Get the text content in the block
     */
    public getTextContent(): string {
        return this.element.textContent;
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
     * @deprecated
     * Get all nodes represented in a Node array
     */
    public getContentNodes(): Node[] {
        return [this.element];
    }

    /**
     * @deprecated
     * Get the first inline element in the block
     */
    public getFirstInlineElement(): InlineElement {
        if (!this.firstInline) {
            this.firstInline = getFirstInlineElement(this.element);
        }

        return this.firstInline;
    }

    /**
     * @deprecated
     * Get the last inline element in the block
     */
    public getLastInlineElement(): InlineElement {
        if (!this.lastInline) {
            this.lastInline = getLastInlineElement(this.element);
        }

        return this.lastInline;
    }

    /**
     * @deprecated
     * Gets all inline in the block
     */
    public getInlineElements(): InlineElement[] {
        let allInlines: InlineElement[] = [];
        let startInline = this.getFirstInlineElement();
        while (startInline) {
            allInlines.push(startInline);
            startInline = getNextPreviousInlineElement(this.element, startInline, true /*isNext*/);
        }

        return allInlines;
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
     * @deprecated
     * Checks if an inline element falls within the block
     */
    public isInBlock(inlineElement: InlineElement): boolean {
        return this.contains(inlineElement.getContainerNode());
    }

    /**
     * Checks if a certain html node is within the block
     */
    public contains(node: Node): boolean {
        return contains(this.element, node, true /*treatSameNodeAsContain*/);
    }
}
