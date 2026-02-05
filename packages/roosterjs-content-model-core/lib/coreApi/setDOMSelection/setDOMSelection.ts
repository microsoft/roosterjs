import { addRangeToSelection } from './addRangeToSelection';
import { areSameSelections } from '../../corePlugin/cache/areSameSelections';
import { ensureUniqueId } from '../setEditorStyle/ensureUniqueId';
import { findLastedCoInMergedCell } from './findLastedCoInMergedCell';
import { findTableCellElement } from './findTableCellElement';
import { getSafeIdSelector, parseTableCells } from 'roosterjs-content-model-dom';
import { setTableCellsStyle } from './setTableCellsStyle';
import { toggleCaret } from './toggleCaret';
import type { SelectionChangedEvent, SetDOMSelection } from 'roosterjs-content-model-types';

const DOM_SELECTION_CSS_KEY = '_DOMSelection';
const HIDE_SELECTION_CSS_KEY = '_DOMSelectionHideSelection';
const IMAGE_ID = 'image';
const TRANSPARENT_SELECTION_CSS_RULE = 'background-color: transparent !important;';
const SELECTION_SELECTOR = '*::selection';
const DEFAULT_SELECTION_BORDER_COLOR = '#DB626C';

/**
 * @internal
 */
export const setDOMSelection: SetDOMSelection = (core, selection, skipSelectionChangedEvent) => {
    const existingSelection = core.api.getDOMSelection(core);

    if (existingSelection && selection && areSameSelections(existingSelection, selection)) {
        return;
    }

    // We are applying a new selection, so we don't need to apply cached selection in DOMEventPlugin.
    // Set skipReselectOnFocus to skip this behavior
    const skipReselectOnFocus = core.selection.skipReselectOnFocus;

    const doc = core.physicalRoot.ownerDocument;
    const isDarkMode = core.lifecycle.isDarkMode;
    core.selection.skipReselectOnFocus = true;
    core.api.setEditorStyle(core, DOM_SELECTION_CSS_KEY, null /*cssRule*/);
    core.api.setEditorStyle(core, HIDE_SELECTION_CSS_KEY, null /*cssRule*/);

    toggleCaret(core, false /* hide */);

    try {
        switch (selection?.type) {
            case 'image':
                const image = selection.image;

                core.selection.selection = selection;

                const imageSelectionColor = isDarkMode
                    ? core.selection.imageSelectionBorderColorDark
                    : core.selection.imageSelectionBorderColor;

                core.api.setEditorStyle(
                    core,
                    DOM_SELECTION_CSS_KEY,
                    `outline-style:solid!important; outline-color:${
                        imageSelectionColor || DEFAULT_SELECTION_BORDER_COLOR
                    }!important;`,
                    [getSafeIdSelector(ensureUniqueId(image, IMAGE_ID))]
                );
                core.api.setEditorStyle(
                    core,
                    HIDE_SELECTION_CSS_KEY,
                    TRANSPARENT_SELECTION_CSS_RULE,
                    [SELECTION_SELECTOR]
                );

                setRangeSelection(doc, image, false /* collapse */);
                break;
            case 'table':
                const { table, firstColumn, firstRow, lastColumn, lastRow } = selection;
                const parsedTable = parseTableCells(selection.table);
                let firstCell = {
                    row: Math.min(firstRow, lastRow),
                    col: Math.min(firstColumn, lastColumn),
                    cell: <HTMLTableCellElement | null>null,
                };
                let lastCell = {
                    row: Math.max(firstRow, lastRow),
                    col: Math.max(firstColumn, lastColumn),
                };

                firstCell = findTableCellElement(parsedTable, firstCell) || firstCell;
                lastCell = findLastedCoInMergedCell(parsedTable, lastCell) || lastCell;

                if (
                    isNaN(firstCell.row) ||
                    isNaN(firstCell.col) ||
                    isNaN(lastCell.row) ||
                    isNaN(lastCell.col)
                ) {
                    return;
                }

                selection = {
                    type: 'table',
                    table,
                    firstRow: firstCell.row,
                    firstColumn: firstCell.col,
                    lastRow: lastCell.row,
                    lastColumn: lastCell.col,
                    tableSelectionInfo: selection.tableSelectionInfo,
                };

                core.selection.selection = selection;

                setTableCellsStyle(core, table, parsedTable, firstCell, lastCell);
                core.api.setEditorStyle(
                    core,
                    HIDE_SELECTION_CSS_KEY,
                    TRANSPARENT_SELECTION_CSS_RULE,
                    [SELECTION_SELECTOR]
                );

                toggleCaret(core, true /* hide */);

                const nodeToSelect = firstCell.cell?.firstElementChild || firstCell.cell;

                if (nodeToSelect) {
                    setRangeSelection(
                        doc,
                        (nodeToSelect as HTMLElement) || undefined,
                        true /* collapse */
                    );
                }

                break;
            case 'range':
                addRangeToSelection(doc, selection.range, selection.isReverted);

                core.selection.selection = core.domHelper.hasFocus() ? null : selection;
                break;

            default:
                core.selection.selection = null;
                break;
        }
    } finally {
        core.selection.skipReselectOnFocus = skipReselectOnFocus;
    }

    if (!skipSelectionChangedEvent) {
        const eventData: SelectionChangedEvent = {
            eventType: 'selectionChanged',
            newSelection: selection,
        };

        core.api.triggerEvent(core, eventData, true /*broadcast*/);
    }
};

function setRangeSelection(doc: Document, element: HTMLElement | undefined, collapse: boolean) {
    if (element && doc.contains(element)) {
        const range = doc.createRange();
        let isReverted: boolean | undefined = undefined;

        range.selectNode(element);
        if (collapse) {
            range.collapse();
        } else {
            const selection = doc.defaultView?.getSelection();
            const range = selection && selection.rangeCount > 0 && selection.getRangeAt(0);
            if (selection && range) {
                isReverted =
                    selection.focusNode != range.endContainer ||
                    selection.focusOffset != range.endOffset;
            }
        }

        addRangeToSelection(doc, range, isReverted);
    }
}
