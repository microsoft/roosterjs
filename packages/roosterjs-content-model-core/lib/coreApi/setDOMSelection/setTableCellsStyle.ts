import { ensureUniqueId } from '../setEditorStyle/ensureUniqueId';
import { getSafeIdSelector, isNodeOfType, toArray } from 'roosterjs-content-model-dom';
import type { EditorCore, ParsedTable, TableCellCoordinate } from 'roosterjs-content-model-types';

const DOM_SELECTION_CSS_KEY = '_DOMSelection';
const TABLE_ID = 'table';

/**
 * @internal
 * Set style for table cells in the selection
 * @param core The EditorCore object
 * @param selection The table selection
 * @param style The CSS style to apply, or empty string to remove style
 * @param parsedTable Optional pre-parsed table to avoid parsing twice
 */
export function removeTableCellsStyle(core: EditorCore) {
    core.api.setEditorStyle(core, DOM_SELECTION_CSS_KEY, '');
}

/**
 * @internal
 * Set style for table cells in the selection
 * @param core The EditorCore object
 * @param selection The table selection
 * @param style The CSS style to apply, or empty string to remove style
 * @param parsedTable Optional pre-parsed table to avoid parsing twice
 */
export function setTableCellsStyle(
    core: EditorCore,
    table: HTMLTableElement,
    parsedTable: ParsedTable,
    firstCell: TableCellCoordinate,
    lastCell: TableCellCoordinate
) {
    const tableId = ensureUniqueId(table, TABLE_ID);
    const tableSelector = getSafeIdSelector(tableId);
    const tableSelectionColor = core.lifecycle.isDarkMode
        ? core.selection.tableCellSelectionBackgroundColorDark
        : core.selection.tableCellSelectionBackgroundColor;

    const tableSelectors =
        firstCell.row == 0 &&
        firstCell.col == 0 &&
        lastCell.row == parsedTable.length - 1 &&
        lastCell.col == (parsedTable[lastCell.row]?.length ?? 0) - 1
            ? [tableSelector, `${tableSelector} *`]
            : buildTableSelectors(parsedTable, tableSelector, table, firstCell, lastCell);

    core.api.setEditorStyle(
        core,
        DOM_SELECTION_CSS_KEY,
        `background-color:${tableSelectionColor}!important;`,
        tableSelectors
    );
}

/**
 * @internal
 * Build CSS selectors for table cells within the selection range
 */
function buildTableSelectors(
    parsedTable: ParsedTable,
    tableSelector: string,
    table: HTMLTableElement,
    firstCell: TableCellCoordinate,
    lastCell: TableCellCoordinate
): string[] {
    const selectors: string[] = [];

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
                    const selector = `${tableSelector}${middleElSelector} tr:nth-child(${currentRow})>${cell.tagName}:nth-child(${tdCount})`;

                    selectors.push(selector, selector + ' *');
                }
            }
        }
    });

    return selectors;
}
