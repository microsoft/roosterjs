import EditorSelection from './EditorSelection';
import InlineElementFactory from '../inlineElements/InlineElementFactory';
import {
    BlockElement,
    ContentPosition,
    InlineElement,
    TraversingScoper,
} from 'roosterjs-editor-types';

// This provides traversing content in a selection start block
// This is commonly used for those cursor context sensitive plugin
// i.e. Mentions, Hashtag etc. they want to know text being typed at cursor
// This provides a scope for parsing from cursor position up to begin of the selection block
class SelectionBlockScoper implements TraversingScoper {
    private readonly editorSelection: EditorSelection;
    private selectionBlock: BlockElement;

    constructor(
        rootNode: Node,
        selectionRange: Range,
        private startPosition: ContentPosition,
        inlineElementFactory: InlineElementFactory
    ) {
        this.editorSelection = new EditorSelection(rootNode, selectionRange, inlineElementFactory);
    }

    // Get the start block element
    public getStartBlockElement(): BlockElement {
        if (!this.selectionBlock) {
            this.selectionBlock = this.editorSelection.startBlockElement;
        }
        return this.selectionBlock;
    }

    // Get the start inline element
    // The start inline refers to inline before the selection start
    // The reason why we choose the one before rather after is, when cursor is at the end of a paragragh,
    // the one after likely will point to inline in next paragragh which may be null if the cursor is at bottom of editor
    public getStartInlineElement(): InlineElement {
        let theBlock = this.getStartBlockElement();
        let startInline: InlineElement;
        if (theBlock) {
            switch (this.startPosition) {
                case ContentPosition.Begin:
                    startInline = theBlock.getFirstInlineElement();
                    break;
                case ContentPosition.End:
                    startInline = theBlock.getLastInlineElement();
                    break;
                case ContentPosition.SelectionStart:
                    // Get the inline before selection start point, and ensure it falls in the selection block
                    startInline = this.editorSelection.startInlineElement;
                    if (startInline && !theBlock.isInBlock(startInline)) {
                        startInline = null;
                    }
                    break;
            }
        }

        return startInline;
    }

    // This is special case to support when startInlineElement is null
    // startInlineElement being null can happen when cursor is in the end of block. In that case, there
    // isn't anything after the cursor so you get a null startInlineElement. The scoper works together
    // with content traverser. When users ask for a previous inline element and content traverser sees
    // a null startInline element, it will fall back to call this getInlineElementBeforeStart to get a
    // a previous inline element
    public getInlineElementBeforeStart(): InlineElement {
        let inlineBeforeStart: InlineElement;
        let theBlock = this.getStartBlockElement();
        if (theBlock && this.startPosition == ContentPosition.SelectionStart) {
            // Get the inline before selection start point, and ensure it falls in the selection block
            inlineBeforeStart = this.editorSelection.inlineElementBeforeStart;
            if (inlineBeforeStart && !theBlock.isInBlock(inlineBeforeStart)) {
                inlineBeforeStart = null;
            }
        }

        return inlineBeforeStart;
    }

    public isBlockInScope(blockElement: BlockElement): boolean {
        let theBlock = this.getStartBlockElement();
        return theBlock && blockElement ? theBlock.equals(blockElement) : false;
    }

    // Trim the incoming inline element, and return an inline element
    // This just tests and return the inline element if it is in block
    // This is a block scoper, which is not like selection scoper where it may cut an inline element in half
    // A block scoper does not cut an inline in half
    public trimInlineElement(inlineElement: InlineElement): InlineElement {
        let theBlock = this.getStartBlockElement();
        return theBlock && inlineElement && theBlock.isInBlock(inlineElement)
            ? inlineElement
            : null;
    }
}

export default SelectionBlockScoper;
