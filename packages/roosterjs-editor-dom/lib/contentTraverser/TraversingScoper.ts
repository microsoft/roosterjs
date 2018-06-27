import { BlockElement, InlineElement } from 'roosterjs-editor-types';

/**
 * A scoper provides two things to a content traverser:
 * 1) a start position -- a start inline or block element
 * 2) check if a block and inline element is in scope
 *
 * The reason why the inline element check is made as trimInlineElement (instead of isInlineInScope) is to accommodate
 * selection scoping where the traverser may give a full inline element and only a partial of it
 * falls within the selection. In that case, we want to trim the inline to return a partial inline element
 */
interface TraversingScoper {
    /**
     * The root node of this scoper
     */
    rootNode: Node;

    /**
     * Get the start block element
     */
    getStartBlockElement: () => BlockElement;

    /**
     * Get the start inline element
     */
    getStartInlineElement: () => InlineElement;

    /**
     * Check if the given block element is in this scope
     */
    isBlockInScope: (blockElement: BlockElement) => boolean;

    /**
     * Trim the given inline element to match this scope
     */
    trimInlineElement: (inlineElement: InlineElement) => InlineElement;
}

export default TraversingScoper;
