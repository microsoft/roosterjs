import addUniqueId from './utils/addUniqueId';
import {
    createRange,
    getTagOfNode,
    isWholeTableSelected,
    Position,
    removeGlobalCssStyle,
    removeImportantStyleRule,
    setGlobalCssStyles,
    toArray,
    VTable,
} from 'roosterjs-editor-dom';
import {
    EditorCore,
    SelectionRangeTypes,
    TableSelection,
    SelectTable,
    PositionType,
    Coordinates,
} from 'roosterjs-editor-types';

const TABLE_ID = 'tableSelected';
const CONTENT_DIV_ID = 'contentDiv_';
const STYLE_ID = 'tableStyle';
const SELECTED_CSS_RULE =
    '{background-color: rgb(198,198,198) !important; caret-color: transparent}';

/**
 * @internal
 * Select a table and save data of the selected range
 * @param core The EditorCore object
 * @param table table to select
 * @param coordinates first and last cell of the selection, if this parameter is null, instead of
 * selecting, will unselect the table.
 * @returns true if successful
 */
export const selectTable: SelectTable = (
    core: EditorCore,
    table: HTMLTableElement | null,
    coordinates?: TableSelection
) => {
    unselect(core);

    if (areValidCoordinates(coordinates) && table) {
        addUniqueId(table, TABLE_ID);
        addUniqueId(core.contentDiv, CONTENT_DIV_ID);

        const { ranges, isWholeTableSelected } = select(core, table, coordinates);
        if (!isMergedCell(table, coordinates)) {
            const cellToSelect = table.rows
                .item(coordinates.firstCell.y)
                ?.cells.item(coordinates.firstCell.x);

            if (cellToSelect) {
                core.api.selectRange(
                    core,
                    createRange(new Position(cellToSelect, PositionType.Begin))
                );
            }
        }

        return {
            type: SelectionRangeTypes.TableSelection,
            ranges,
            table,
            areAllCollapsed: ranges.filter(range => range?.collapsed).length == ranges.length,
            coordinates,
            isWholeTableSelected,
        };
    }

    return null;
};

const MAX_RULE_SELECTOR_LENGTH = 8000;
function buildCss(
    table: HTMLTableElement,
    coordinates: TableSelection,
    contentDivSelector: string
): { cssRules: string[]; ranges: Range[]; isWholeTableSelected: boolean } {
    const ranges: Range[] = [];
    const selectors: string[] = [];

    const vTable = new VTable(table);
    const isAllTableSelected = isWholeTableSelected(vTable, coordinates);
    if (isAllTableSelected) {
        handleAllTableSelected(contentDivSelector, vTable, selectors, ranges);
    } else {
        handleTableSelected(coordinates, vTable, contentDivSelector, selectors, ranges);
    }

    const cssRules: string[] = [];
    let currentRules: string = '';
    while (selectors.length > 0) {
        currentRules += (currentRules.length > 0 ? ',' : '') + selectors.shift() || '';
        if (currentRules.length > MAX_RULE_SELECTOR_LENGTH || selectors.length == 0) {
            cssRules.push(currentRules + ' ' + SELECTED_CSS_RULE);
            currentRules = '';
        }
    }

    return { cssRules, ranges, isWholeTableSelected: isAllTableSelected };
}

function handleAllTableSelected(
    contentDivSelector: string,
    vTable: VTable,
    selectors: string[],
    ranges: Range[]
) {
    const table = vTable.table;
    const tableSelector = contentDivSelector + ' #' + table.id;
    selectors.push(tableSelector, `${tableSelector} *`);

    const tableRange = new Range();
    tableRange.selectNode(table);
    ranges.push(tableRange);
}

function handleTableSelected(
    coordinates: TableSelection,
    vTable: VTable,
    contentDivSelector: string,
    selectors: string[],
    ranges: Range[]
) {
    const tr1 = coordinates.firstCell.y;
    const td1 = coordinates.firstCell.x;
    const tr2 = coordinates.lastCell.y;
    const td2 = coordinates.lastCell.x;
    const table = vTable.table;

    let firstSelected: HTMLTableCellElement | null = null;
    let lastSelected: HTMLTableCellElement | null = null;
    // Get whether table has thead, tbody or tfoot.
    const tableChildren = toArray(table.childNodes).filter(
        node => ['THEAD', 'TBODY', 'TFOOT'].indexOf(getTagOfNode(node)) > -1
    );
    // Set the start and end of each of the table children, so we can build the selector according the element between the table and the row.
    let cont = 0;
    const indexes = tableChildren.map(node => {
        const result = {
            el: getTagOfNode(node),
            start: cont,
            end: node.childNodes.length + cont,
        };

        cont = result.end;
        return result;
    });

    vTable.cells?.forEach((row, rowIndex) => {
        let tdCount = 0;
        firstSelected = null;
        lastSelected = null;

        //Get current TBODY/THEAD/TFOOT
        const midElement = indexes.filter(ind => ind.start <= rowIndex && ind.end > rowIndex)[0];

        const middleElSelector = midElement ? '>' + midElement.el + '>' : '>';
        const currentRow =
            midElement && rowIndex + 1 >= midElement.start
                ? rowIndex + 1 - midElement.start
                : rowIndex + 1;

        for (let cellIndex = 0; cellIndex < row.length; cellIndex++) {
            const cell = row[cellIndex].td;
            if (cell) {
                tdCount++;
                if (rowIndex >= tr1 && rowIndex <= tr2 && cellIndex >= td1 && cellIndex <= td2) {
                    removeImportant(cell);

                    const selector = generateCssFromCell(
                        contentDivSelector,
                        table.id,
                        middleElSelector,
                        currentRow,
                        getTagOfNode(cell),
                        tdCount
                    );
                    const elementsSelector = selector + ' *';

                    selectors.push(selector, elementsSelector);
                    firstSelected = firstSelected || table.querySelector(selector);
                    lastSelected = table.querySelector(selector);
                }
            }
        }

        if (firstSelected && lastSelected) {
            const rowRange = new Range();
            rowRange.setStartBefore(firstSelected);
            rowRange.setEndAfter(lastSelected);
            ranges.push(rowRange);
        }
    });
}

function select(
    core: EditorCore,
    table: HTMLTableElement,
    coordinates: TableSelection
): { ranges: Range[]; isWholeTableSelected: boolean } {
    const contentDivSelector = '#' + core.contentDiv.id;
    let { cssRules, ranges, isWholeTableSelected } = buildCss(
        table,
        coordinates,
        contentDivSelector
    );
    cssRules.forEach(css =>
        setGlobalCssStyles(core.contentDiv.ownerDocument, css, STYLE_ID + core.contentDiv.id)
    );

    return { ranges, isWholeTableSelected };
}

const unselect = (core: EditorCore) => {
    const doc = core.contentDiv.ownerDocument;
    removeGlobalCssStyle(doc, STYLE_ID + core.contentDiv.id);
};

function generateCssFromCell(
    contentDivSelector: string,
    tableId: string,
    middleElSelector: string,
    rowIndex: number,
    cellTag: string,
    index: number
): string {
    return (
        contentDivSelector +
        ' #' +
        tableId +
        middleElSelector +
        ' tr:nth-child(' +
        rowIndex +
        ')>' +
        cellTag +
        ':nth-child(' +
        index +
        ')'
    );
}

function removeImportant(cell: HTMLTableCellElement) {
    if (cell) {
        removeImportantStyleRule(cell, ['background-color', 'background']);
    }
}

function areValidCoordinates(input?: TableSelection): input is TableSelection {
    if (input) {
        const { firstCell, lastCell } = input || {};
        if (firstCell && lastCell) {
            const handler = (coordinate: Coordinates) =>
                isValidCoordinate(coordinate.x) && isValidCoordinate(coordinate.y);
            return handler(firstCell) && handler(lastCell);
        }
    }

    return false;
}

function isValidCoordinate(input: number): boolean {
    return (!!input || input == 0) && input > -1;
}

function isMergedCell(table: HTMLTableElement, coordinates: TableSelection): boolean {
    const { firstCell } = coordinates;
    return !(table.rows.item(firstCell.y) && table.rows.item(firstCell.y)?.cells.item(firstCell.x));
}
