import collapseSelectedBlocks from '../utils/collapseSelectedBlocks';
import { ChangeSource, Direction, IEditor } from 'roosterjs-editor-types';

/**
 * Change direction for the blocks/paragraph at selection
 * @param editor The editor instance
 * @param direction The direction option:
 * Direction.LeftToRight refers to 'ltr', Direction.RightToLeft refers to 'rtl'
 */
export default function setDirection(editor: IEditor, direction: Direction) {
    editor.focus();
    editor.addUndoSnapshot((start, end) => {
        collapseSelectedBlocks(editor, element => {
            element.setAttribute('dir', direction == Direction.LeftToRight ? 'ltr' : 'rtl');
            element.style.textAlign = direction == Direction.LeftToRight ? 'left' : 'right';
        });
        editor.select(start, end);
    }, ChangeSource.Format);
}
