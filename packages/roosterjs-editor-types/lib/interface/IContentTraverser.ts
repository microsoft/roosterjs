import BlockElement from './BlockElement';
import InlineElement from './InlineElement';

/**
 * Interface of ContentTraverser, provides traversing of content inside editor.
 */
export default interface IContentTraverser {
    /**
     * Get current block
     */
    currentBlockElement: BlockElement;

    /**
     * Get next block element
     */
    getNextBlockElement(): BlockElement;

    /**
     * Get previous block element
     */
    getPreviousBlockElement(): BlockElement;

    /**
     * Current inline element getter
     */
    currentInlineElement: InlineElement;

    /**
     * Get next inline element
     */
    getNextInlineElement(): InlineElement;

    /**
     * Get previous inline element
     */
    getPreviousInlineElement(): InlineElement;
}
