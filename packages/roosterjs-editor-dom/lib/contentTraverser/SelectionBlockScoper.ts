import EmptyInlineElement from '../inlineElements/EmptyInlineElement';
import getBlockElementAtNode from '../blockElements/getBlockElementAtNode';
import getInlineElementAtNode from '../inlineElements/getInlineElementAtNode';
import NodeBlockElement from '../blockElements/NodeBlockElement';
import Position from '../selection/Position';
import safeInstanceOf from '../utils/safeInstanceOf';
import TraversingScoper from './TraversingScoper';
import { BlockElement, ContentPosition, InlineElement, NodePosition } from 'roosterjs-editor-types';
import { getInlineElementAfter } from '../inlineElements/getInlineElementBeforeAfter';
import {
    getFirstInlineElement,
    getLastInlineElement,
} from '../inlineElements/getFirstLastInlineElement';
import type { CompatibleContentPosition } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * @internal
 * This provides traversing content in a selection start block
 * This is commonly used for those cursor context sensitive plugin,
 * they want to know text being typed at cursor
 * This provides a scope for parsing from cursor position up to begin of the selection block
 */
export default class SelectionBlockScoper implements TraversingScoper {
    private block: BlockElement | null;
    private position: NodePosition;

    /**
     * Create a new instance of SelectionBlockScoper class
     * @param rootNode The root node of the whole scope
     * @param position Position of the selection start
     * @param startFrom Where to start, can be Begin, End, SelectionStart
     */
    constructor(
        public rootNode: Node,
        position: NodePosition | Range,
        private startFrom: ContentPosition | CompatibleContentPosition
    ) {
        if (safeInstanceOf(position, 'Range')) {
            position = Position.getStart(position);
        }

        this.position = position.normalize();
        this.block = getBlockElementAtNode(this.rootNode, this.position.node);
    }

    /**
     * Get the start block element
     */
    public getStartBlockElement(): BlockElement | null {
        return this.block;
    }

    /**
     * Get the start inline element
     * The start inline refers to inline before the selection start
     *  The reason why we choose the one before rather after is, when cursor is at the end of a paragraph,
     * the one after likely will point to inline in next paragraph which may be null if the cursor is at bottom of editor
     */
    public getStartInlineElement(): InlineElement | null {
        if (this.block) {
            switch (this.startFrom) {
                case ContentPosition.Begin:
                case ContentPosition.End:
                case ContentPosition.DomEnd:
                    return getFirstLastInlineElementFromBlockElement(
                        this.block,
                        this.startFrom == ContentPosition.Begin
                    );
                case ContentPosition.SelectionStart:
                    // Get the inline before selection start point, and ensure it falls in the selection block
                    let startInline = getInlineElementAfter(this.rootNode, this.position);
                    return startInline && this.block.contains(startInline.getContainerNode())
                        ? startInline
                        : new EmptyInlineElement(this.position, this.block);
            }
        }

        return null;
    }

    /**
     * Check if the given block element is in current scope
     * @param blockElement The block element to check
     */
    public isBlockInScope(blockElement: BlockElement): boolean {
        return this.block && blockElement ? this.block.equals(blockElement) : false;
    }

    /**
     * Trim the incoming inline element, and return an inline element
     * This just tests and return the inline element if it is in block
     * This is a block scoper, which is not like selection scoper where it may cut an inline element in half
     * A block scoper does not cut an inline in half
     */
    public trimInlineElement(inlineElement: InlineElement): InlineElement | null {
        return this.block && inlineElement && this.block.contains(inlineElement.getContainerNode())
            ? inlineElement
            : null;
    }
}

/**
 * Get first/last InlineElement of the given BlockElement
 * @param block The BlockElement to get InlineElement from
 * @param isFirst True to get first InlineElement, false to get last InlineElement
 */
function getFirstLastInlineElementFromBlockElement(
    block: BlockElement,
    isFirst: boolean
): InlineElement | null {
    if (block instanceof NodeBlockElement) {
        let blockNode = block.getStartNode();
        return isFirst ? getFirstInlineElement(blockNode) : getLastInlineElement(blockNode);
    } else {
        return getInlineElementAtNode(block, isFirst ? block.getStartNode() : block.getEndNode());
    }
}
