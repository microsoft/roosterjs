import { contains, safeInstanceOf } from 'roosterjs-editor-dom';
import { Keys, KnownAnnounceStrings, SelectionRangeTypes } from 'roosterjs-editor-types';
import type { AnnounceFeature } from '../AnnounceFeature';

const TABLE_CELL_SELECTOR = 'td,th';
const TABLE_SELECTOR = 'table';

const announceWarningOnLastCell: AnnounceFeature = {
    shouldHandle: ({ editor, lastFocusedElement }) => {
        const selection = editor.getSelectionRangeEx();

        return (
            selection?.type == SelectionRangeTypes.Normal &&
            selection.areAllCollapsed &&
            selection.ranges.length === 1 &&
            !contains(
                lastFocusedElement,
                selection.ranges[0].startContainer,
                true /*treatSameNodeAsContain*/
            ) &&
            isLastCell() && {
                defaultStrings: KnownAnnounceStrings.AnnounceOnFocusLastCell,
            }
        );
        function isLastCell(): boolean {
            const table = editor.getElementAtCursor(TABLE_SELECTOR);

            if (safeInstanceOf(table, 'HTMLTableElement')) {
                const allCells = table.querySelectorAll(TABLE_CELL_SELECTOR);
                const focusedCell = editor.getElementAtCursor(TABLE_CELL_SELECTOR);

                return focusedCell == allCells.item(allCells.length - 1);
            }
            return false;
        }
    },
    keys: [Keys.TAB, Keys.UP, Keys.DOWN, Keys.LEFT, Keys.RIGHT],
};

export default announceWarningOnLastCell;
