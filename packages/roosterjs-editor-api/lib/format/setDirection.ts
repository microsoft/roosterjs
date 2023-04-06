import collapseSelectedBlocks from '../utils/collapseSelectedBlocks';
import formatUndoSnapshot from '../utils/formatUndoSnapshot';
import { Direction, IEditor } from 'roosterjs-editor-types';
import type { CompatibleDirection } from 'roosterjs-editor-types/lib/compatibleTypes';

/**
 * Change direction for the blocks/paragraph at selection
 * @param editor The editor instance
 * @param direction The direction option:
 * Direction.LeftToRight refers to 'ltr', Direction.RightToLeft refers to 'rtl'
 */
export default function setDirection(editor: IEditor, direction: Direction | CompatibleDirection) {
    editor.focus();

    formatUndoSnapshot(
        editor,
        (start, end) => {
            collapseSelectedBlocks(editor, element => {
                element.setAttribute('dir', direction == Direction.LeftToRight ? 'ltr' : 'rtl');
                element.style.textAlign = direction == Direction.LeftToRight ? 'left' : 'right';
            });
            if (start && end) {
                editor.select(start, end);
            }
        },
        'setDirection'
    );
}
