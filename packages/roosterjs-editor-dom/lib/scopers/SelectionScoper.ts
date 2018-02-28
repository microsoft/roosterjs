import EditorSelection from './EditorSelection';
import InlineElementFactory from '../objectModel/InlineElementFactory';
import { InlineElement, BlockElement } from '../objectModel/types';
import TraversingScoper from './TraversingScoper';
import SelectionRange from '../selection/SelectionRange';

// This is selection scoper that provide a start inline as the start of the selection
// and checks if a block falls in the selection (isBlockInScope)
// last trimInlineElement to trim any inline element to return a partial that falls in the selection
class SelectionScoper implements TraversingScoper {
    private readonly editorSelection: EditorSelection;

    constructor(
        rootNode: Node,
        selectionRange: SelectionRange,
        inlineElementFactory: InlineElementFactory
    ) {
        this.editorSelection = new EditorSelection(rootNode, selectionRange, inlineElementFactory);
    }

    // Provide a start block as the first block after the cursor
    public getStartBlockElement(): BlockElement {
        return this.editorSelection.startBlockElement;
    }

    // Provide a start inline as the first inline after the cursor
    public getStartInlineElement(): InlineElement {
        return this.editorSelection.startInlineElement;
    }

    // Checks if a block completely falls in the selection
    public isBlockInScope(blockElement: BlockElement): boolean {
        return blockElement ? this.editorSelection.isBlockInScope(blockElement) : false;
    }

    // Trim an incoming inline. If it falls completely outside selection, return null
    // otherwise return a partial that represents the portion that falls in the selection
    public trimInlineElement(inlineElement: InlineElement): InlineElement {
        return inlineElement ? this.editorSelection.trimInlineElement(inlineElement) : null;
    }
}

export default SelectionScoper;
