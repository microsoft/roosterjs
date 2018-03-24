import InlineElement from '../inlineElements/InlineElement';
import BlockElement from '../blockElements/BlockElement';

/**
 * A scoper provides two things to a content traverser:
 * 1) a start position -- a start inline or block element
 * 2) check if a block and inline element is in scope
 *
 * The reason why the inline element check is made as trimInlineElement (instead of isInlineInScope) is to accommodate
 * selection scoping where the traverser may give a full inline element and only a partial of it
 * falls within the selection. In that case, we want to trim the inline to return a partial inline element
 * 2) There are two extra optional getInlineElementBeforeStart and getInlineElementAfterStart
 * The two functions are added to support null startInlineElement which can happen when startElement is at boundary of a scope
 * i.e. for SelectionBlockScoper with a startPosition to be SelectionStart, cursor can be in the end of block. In that case, there
 * isn't anything after the cursor so you get a null startInlineElement. The scoper works together with content traverser.
 * When users ask for a previous inline element and content traverser sees a null startInline element, it will fall back to
 * call this getInlineElementBeforeStart to get a previous inline element. Not all scoper needs this, so it is made as optional
 */
interface TraversingScoper {
    /**
     * Get the start block element
     */
    getStartBlockElement: () => BlockElement;

    /**
     * Get the start inline element
     */
    getStartInlineElement: () => InlineElement;

    /**
     * Get the inline element before start position
     */
    getInlineElementBeforeStart?: () => InlineElement;

    /**
     * Get the inline element after start position
     */
    getInlineElementAfterStart?: () => InlineElement;

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
