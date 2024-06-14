import { addRangeToSelection } from './addRangeToSelection';
import { areSameSelections } from '../../corePlugin/cache/areSameSelections';
import { ensureImageHasSpanParent } from './ensureImageHasSpanParent';
import { ensureUniqueId } from '../setEditorStyle/ensureUniqueId';
import { findLastedCoInMergedCell } from './findLastedCoInMergedCell';
import { findTableCellElement } from './findTableCellElement';
import { isNodeOfType, parseTableCells, toArray } from 'roosterjs-content-model-dom';
import type {
    ParsedTable,
    SelectionChangedEvent,
    SetDOMSelection,
    TableCellCoordinate,
} from 'roosterjs-content-model-types';

const DOM_SELECTION_CSS_KEY = '_DOMSelection';
const HIDE_CURSOR_CSS_KEY = '_DOMSelectionHideCursor';
const HIDE_SELECTION_CSS_KEY = '_DOMSelectionHideSelection';
const IMAGE_ID = 'image';
const TABLE_ID = 'table';
const CARET_CSS_RULE = 'caret-color: transparent';
const TRANSPARENT_SELECTION_CSS_RULE = 'background-color: transparent !important;';
const SELECTION_SELECTOR = '*::selection';

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
    core.api.setEditorStyle(core, HIDE_CURSOR_CSS_KEY, null /*cssRule*/);
    core.api.setEditorStyle(core, HIDE_SELECTION_CSS_KEY, null /*cssRule*/);

    try {
        switch (selection?.type) {
            case 'image':
                const image = ensureImageHasSpanParent(selection.image);

                core.selection.selection = {
                    type: 'image',
                    image,
                };
                const imageSelectionColor = isDarkMode
                    ? core.selection.imageSelectionBorderColorDark
                    : core.selection.imageSelectionBorderColor;

                core.api.setEditorStyle(
                    core,
                    DOM_SELECTION_CSS_KEY,
                    `outline-style:solid!important; outline-color:${imageSelectionColor}!important;display: ${
                        core.environment.isSafari ? '-webkit-inline-flex' : 'inline-flex'
                    };`,
                    [`span:has(>img#${ensureUniqueId(image, IMAGE_ID)})`]
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
                };

                const tableId = ensureUniqueId(table, TABLE_ID);
                const tableSelectors =
                    firstCell.row == 0 &&
                    firstCell.col == 0 &&
                    lastCell.row == parsedTable.length - 1 &&
                    lastCell.col == (parsedTable[lastCell.row]?.length ?? 0) - 1
                        ? [`#${tableId}`, `#${tableId} *`]
                        : handleTableSelected(parsedTable, tableId, table, firstCell, lastCell);

                core.selection.selection = selection;

                const tableSelectionColor = isDarkMode
                    ? core.selection.tableCellSelectionBackgroundColorDark
                    : core.selection.tableCellSelectionBackgroundColor;
                core.api.setEditorStyle(
                    core,
                    DOM_SELECTION_CSS_KEY,
                    `background-color:${tableSelectionColor}!important;`,
                    tableSelectors
                );
                core.api.setEditorStyle(core, HIDE_CURSOR_CSS_KEY, CARET_CSS_RULE);

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

function handleTableSelected(
    parsedTable: ParsedTable,
    tableId: string,
    table: HTMLTableElement,
    firstCell: TableCellCoordinate,
    lastCell: TableCellCoordinate
) {
    const selectors: string[] = [];

    // Get whether table has thead, tbody or tfoot, then Set the start and end of each of the table children,
    // so we can build the selector according the element between the table and the row.
    let cont = 0;
    const indexes = toArray(table.childNodes)
        .filter(
            (node): node is HTMLTableSectionElement =>
                ['THEAD', 'TBODY', 'TFOOT'].indexOf(
                    isNodeOfType(node, 'ELEMENT_NODE') ? node.tagName : ''
                ) > -1
        )
        .map(node => {
            const result = {
                el: node.tagName,
                start: cont,
                end: node.childNodes.length + cont,
            };

            cont = result.end;
            return result;
        });

    parsedTable.forEach((row, rowIndex) => {
        let tdCount = 0;

        //Get current TBODY/THEAD/TFOOT
        const midElement = indexes.filter(ind => ind.start <= rowIndex && ind.end > rowIndex)[0];
        const middleElSelector = midElement ? '>' + midElement.el + '>' : '>';
        const currentRow =
            midElement && rowIndex + 1 >= midElement.start
                ? rowIndex + 1 - midElement.start
                : rowIndex + 1;

        for (let cellIndex = 0; cellIndex < row.length; cellIndex++) {
            const cell = row[cellIndex];

            if (typeof cell == 'object') {
                tdCount++;

                if (
                    rowIndex >= firstCell.row &&
                    rowIndex <= lastCell.row &&
                    cellIndex >= firstCell.col &&
                    cellIndex <= lastCell.col
                ) {
                    const selector = `#${tableId}${middleElSelector} tr:nth-child(${currentRow})>${cell.tagName}:nth-child(${tdCount})`;

                    selectors.push(selector, selector + ' *');
                }
            }
        }
    });

    return selectors;
}

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
