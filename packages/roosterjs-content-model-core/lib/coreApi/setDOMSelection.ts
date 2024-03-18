import { addRangeToSelection } from '../corePlugin/utils/addRangeToSelection';
import { ensureUniqueId } from './setEditorStyle/ensureUniqueId';
import { isNodeOfType, toArray } from 'roosterjs-content-model-dom';
import { parseTableCells } from '../publicApi/domUtils/tableCellUtils';
import type {
    SelectionChangedEvent,
    SetDOMSelection,
    TableSelection,
} from 'roosterjs-content-model-types';

const DOM_SELECTION_CSS_KEY = '_DOMSelection';
const HIDE_CURSOR_CSS_KEY = '_DOMSelectionHideCursor';
const IMAGE_ID = 'image';
const TABLE_ID = 'table';
const DEFAULT_SELECTION_BORDER_COLOR = '#DB626C';
const TABLE_CSS_RULE = 'background-color:#C6C6C6!important;';
const CARET_CSS_RULE = 'caret-color: transparent';

/**
 * @internal
 */
export const setDOMSelection: SetDOMSelection = (core, selection, skipSelectionChangedEvent) => {
    // We are applying a new selection, so we don't need to apply cached selection in DOMEventPlugin.
    // Set skipReselectOnFocus to skip this behavior
    const skipReselectOnFocus = core.selection.skipReselectOnFocus;

    const doc = core.physicalRoot.ownerDocument;

    core.selection.skipReselectOnFocus = true;
    core.api.setEditorStyle(core, DOM_SELECTION_CSS_KEY, null /*cssRule*/);
    core.api.setEditorStyle(core, HIDE_CURSOR_CSS_KEY, null /*cssRule*/);

    try {
        switch (selection?.type) {
            case 'image':
                const image = selection.image;

                core.selection.selection = selection;
                core.api.setEditorStyle(
                    core,
                    DOM_SELECTION_CSS_KEY,
                    `outline-style:auto!important; outline-color:${
                        core.selection.imageSelectionBorderColor || DEFAULT_SELECTION_BORDER_COLOR
                    }!important;`,
                    [`#${ensureUniqueId(image, IMAGE_ID)}`]
                );
                core.api.setEditorStyle(core, HIDE_CURSOR_CSS_KEY, CARET_CSS_RULE);

                setRangeSelection(doc, image);
                break;
            case 'table':
                const { table, firstColumn, firstRow } = selection;
                const tableSelectors = buildTableSelectors(
                    ensureUniqueId(table, TABLE_ID),
                    selection
                );

                core.selection.selection = selection;
                core.api.setEditorStyle(
                    core,
                    DOM_SELECTION_CSS_KEY,
                    TABLE_CSS_RULE,
                    tableSelectors
                );
                core.api.setEditorStyle(core, HIDE_CURSOR_CSS_KEY, CARET_CSS_RULE);

                setRangeSelection(doc, table.rows[firstRow]?.cells[firstColumn]);
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

function buildTableSelectors(tableId: string, selection: TableSelection): string[] {
    const { firstColumn, firstRow, lastColumn, lastRow } = selection;
    const cells = parseTableCells(selection.table);
    const isAllTableSelected =
        firstRow == 0 &&
        firstColumn == 0 &&
        lastRow == cells.length - 1 &&
        lastColumn == (cells[lastRow]?.length ?? 0) - 1;
    return isAllTableSelected
        ? [`#${tableId}`, `#${tableId} *`]
        : handleTableSelected(tableId, selection, cells);
}

function handleTableSelected(
    tableId: string,
    selection: TableSelection,
    cells: (HTMLTableCellElement | null)[][]
) {
    const { firstRow, firstColumn, lastRow, lastColumn, table } = selection;
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

    cells.forEach((row, rowIndex) => {
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

            if (cell) {
                tdCount++;

                if (
                    rowIndex >= firstRow &&
                    rowIndex <= lastRow &&
                    cellIndex >= firstColumn &&
                    cellIndex <= lastColumn
                ) {
                    const selector = `#${tableId}${middleElSelector} tr:nth-child(${currentRow})>${cell.tagName}:nth-child(${tdCount})`;

                    selectors.push(selector, selector + ' *');
                }
            }
        }
    });

    return selectors;
}

function setRangeSelection(doc: Document, element: HTMLElement | undefined) {
    if (element && doc.contains(element)) {
        const range = doc.createRange();

        range.selectNode(element);
        range.collapse();

        addRangeToSelection(doc, range);
    }
}
