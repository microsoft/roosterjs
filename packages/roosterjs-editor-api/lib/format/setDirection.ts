import execFormatWithUndo from './execFormatWithUndo';
import { BlockElement, ContentScope, Direction } from 'roosterjs-editor-types';
import { NodeBlockElement, StartEndBlockElement, wrapAll } from 'roosterjs-editor-dom';
import { Editor } from 'roosterjs-editor-core';

/**
 * Change direction for the blocks/paragraph in the selection
 * @param editor The editor instance
 * @param dir The direction option
 */
export default function setDirection(editor: Editor, dir: Direction): void {
    editor.focus();
    let dirValue = dir == Direction.LeftToRight ? 'ltr' : 'rtl';
    let styleValue = dir == Direction.LeftToRight ? 'left' : 'right';

    // Loop through all blocks in the selection
    // For NodeBlockElement (which normally represents a P or DIV etc.), apply dir & text-align directly on the blocks
    // For StartEndBlockElement (which mostly represents text segment broken down through a <BR> in the middle), if start and end
    // are under same parent, add a DIV wrap and then apply dir and text-align.
    // Otherwise (i.e. <ced><div>abc<span>12<br>34</span><div></ced>, abc<span>12<br> is a block) do nothing since there isn't
    // really a way to change direction for such blocks (some HTML shuffling is needed)
    let blockElements: BlockElement[] = [];
    let contentTraverser = editor.getContentTraverser(ContentScope.Selection);
    let startBlock = contentTraverser.currentBlockElement;
    while (startBlock) {
        blockElements.push(startBlock);
        startBlock = contentTraverser.getNextBlockElement();
    }

    if (blockElements.length > 0) {
        execFormatWithUndo(editor, () => {
            for (let block of blockElements) {
                // Any DOM change in the loop might interfere with the traversing so we should try to
                // get the next block first before running any logic that may change DOM
                if (block instanceof NodeBlockElement) {
                    // Apply dir and text-align right on the block
                    let containerNode = block.getStartNode() as HTMLElement;
                    containerNode.setAttribute('dir', dirValue);
                    containerNode.style.textAlign = styleValue;
                } else if (
                    block instanceof StartEndBlockElement &&
                    block.getStartNode().parentNode == block.getEndNode().parentNode
                ) {
                    // TODO: do this only for balanced start-end block
                    // Add support for un-balanced start-end block later on
                    // example for un-balanced start-end: <div>abc<span>123<br>456</span></div>
                    // in this case, the first block abc<span>123<br> is not a balanced node where
                    // the start node "abc" is not in same level as the end node <br> (the <br> is in a span)
                    // Some html suffling is required to properly wrap the content before applying dir
                    let allNodes = block.getContentNodes();
                    wrapAll(
                        allNodes,
                        `<div dir='${dirValue}', style='text-align:${styleValue};'></div>`
                    );
                }
            }
        });
    }
}
