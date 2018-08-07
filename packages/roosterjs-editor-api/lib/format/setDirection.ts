import { BlockElement, Direction, ChangeSource } from 'roosterjs-editor-types';
import { NodeBlockElement, StartEndBlockElement } from 'roosterjs-editor-dom';
import { Editor } from 'roosterjs-editor-core';

/**
 * Change direction for the blocks/paragraph at selection
 * @param editor The editor instance
 * @param direction The direction option:
 * Direction.LeftToRight refers to 'ltr', Direction.RightToLeft refers to 'rtl'
 */
export default function setDirection(editor: Editor, direction: Direction) {
    editor.focus();

    let blockElements: BlockElement[] = [];
    let contentTraverser = editor.getSelectionTraverser();
    let startBlock = contentTraverser && contentTraverser.currentBlockElement;
    while (startBlock) {
        blockElements.push(startBlock);
        startBlock = contentTraverser.getNextBlockElement();
    }

    if (blockElements.length > 0) {
        editor.addUndoSnapshot((start, end) => {
            for (let block of blockElements) {
                let nodeBlock =
                    block instanceof StartEndBlockElement
                        ? block.toNodeBlockElement()
                        : (block as NodeBlockElement);
                let node = nodeBlock.getStartNode() as HTMLElement;
                node.setAttribute('dir', direction == Direction.LeftToRight ? 'ltr' : 'rtl');
                node.style.textAlign = direction == Direction.LeftToRight ? 'left' : 'right';
            }
            editor.select(start, end);
        }, ChangeSource.Format);
    }
}
