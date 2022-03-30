import BlockElement from './BlockElement';
import InlineElement from './InlineElement';

/**
 * Interface of ContentTraverser, provides traversing of content inside editor.
 */
export default interface IContentTraverser {
    /**
     * Get current block
     */
    currentBlockElement: BlockElement | null;

    /**
     * Get next block element
     */
    getNextBlockElement(): BlockElement | null;

    /**
     * Get previous block element
     */
    getPreviousBlockElement(): BlockElement | null;

    /**
     * Current inline element getter
     */
    currentInlineElement: InlineElement | null;

    /**
     * Get next inline element
     */
    getNextInlineElement(): InlineElement | null;

    /**
     * Get previous inline element
     */
    getPreviousInlineElement(): InlineElement | null;
}
