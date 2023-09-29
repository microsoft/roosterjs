import { AnnounceFeature, AnnounceFeatureParam } from '../AnnounceFeature';
import { contains, safeInstanceOf } from 'roosterjs-editor-dom';
import { Keys } from 'roosterjs-editor-types/lib/enum/Keys';
import { KnownAnnounceStrings } from 'roosterjs-editor-types';
import { SelectionRangeTypes } from 'roosterjs-editor-types/lib/enum/SelectionRangeTypes';

const TABLE_CELL_SELECTOR = 'td,th';
const TABLE_SELECTOR = 'table';
const ANNOUNCE_TIMEOUT_DELAY = 100;

const announceWarningOnLastCell: AnnounceFeature = {
    handle({ editor, announceCallback }: AnnounceFeatureParam) {
        const table = editor.getElementAtCursor(TABLE_SELECTOR);

        if (safeInstanceOf(table, 'HTMLTableElement')) {
            const ammountOfRows = table.rows.length;
            const lastRow = table.rows[ammountOfRows - 1];
            const ammountOfCols = lastRow.cells.length;
            const lastCell = lastRow.cells[ammountOfCols - 1];

            const focusedCell = editor.getElementAtCursor(TABLE_CELL_SELECTOR);
            if (focusedCell == lastCell) {
                editor.getDocument().defaultView?.setTimeout(() => {
                    announceCallback({
                        defaultStrings: KnownAnnounceStrings.AnnounceOnFocusLastCell,
                    });
                }, ANNOUNCE_TIMEOUT_DELAY);
            }
        }
    },
    shouldHandle({ editor, lastFocusedElement }: AnnounceFeatureParam) {
        const selection = editor.getSelectionRangeEx();

        return (
            selection?.type == SelectionRangeTypes.Normal &&
            selection.areAllCollapsed &&
            selection.ranges.length > 0 &&
            !contains(
                lastFocusedElement,
                selection.ranges[0].startContainer,
                true /*treatSameNodeAsContain*/
            )
        );
    },
    keys: [Keys.TAB, Keys.UP, Keys.DOWN, Keys.LEFT, Keys.RIGHT],
};

export default announceWarningOnLastCell;
