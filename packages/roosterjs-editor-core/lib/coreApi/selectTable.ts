import {
    createRange,
    getStyles,
    getTagOfNode,
    Position,
    setStyles,
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
    table: HTMLTableElement,
    coordinates?: TableSelection
) => {
    unselect(core);

    if (areValidCoordinates(coordinates) && table) {
        ensureUniqueId(table, TABLE_ID);
        ensureUniqueId(core.contentDiv, CONTENT_DIV_ID);

        const ranges = select(core, table, coordinates);
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
        };
    }

    return null;
};

function buildCss(
    table: HTMLTableElement,
    coordinates: TableSelection,
    contentDivSelector: string
): { css: string; ranges: Range[] } {
    const tr1 = coordinates.firstCell.y;
    const td1 = coordinates.firstCell.x;
    const tr2 = coordinates.lastCell.y;
    const td2 = coordinates.lastCell.x;
    const ranges: Range[] = [];

    let firstSelected: HTMLTableCellElement | null = null;
    let lastSelected: HTMLTableCellElement | null = null;
    let css = '';
    let isFirst = true;

    const vTable = new VTable(table);

    // Get whether table has thead, tbody or tfoot.
    const tableChildren = toArray(table.childNodes).filter(
        node => ['THEAD', 'TBODY', 'TFOOT'].indexOf(getTagOfNode(node)) > -1
    );
    // Set the start and end of each of the table childs, so we can build the selector according the element between the table and the row.
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
                const tag = getTagOfNode(cell);
                tdCount++;

                if (rowIndex >= tr1 && rowIndex <= tr2 && cellIndex >= td1 && cellIndex <= td2) {
                    if (isFirst) {
                        isFirst = false;
                    } else if (!css.endsWith(',')) {
                        css += ',';
                    }

                    removeImportant(cell);

                    const selector = generateCssFromCell(
                        contentDivSelector,
                        table.id,
                        middleElSelector,
                        currentRow,
                        tag,
                        tdCount
                    );
                    css += selector;
                    firstSelected = firstSelected || table.querySelector(selector);
                    lastSelected = table.querySelector(selector)!;
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

    css += '{background-color: rgba(198,198,198,0.7) !important;}';

    return { css, ranges };
}

function select(core: EditorCore, table: HTMLTableElement, coordinates: TableSelection): Range[] {
    const doc = core.contentDiv.ownerDocument;
    const contentDivSelector = '#' + core.contentDiv.id;
    let { css, ranges } = buildCss(table, coordinates, contentDivSelector);

    let styleElement = doc.getElementById(STYLE_ID + core.contentDiv.id) as HTMLStyleElement;
    if (!styleElement) {
        styleElement = doc.createElement('style');
        doc.head.appendChild(styleElement);
        styleElement.id = STYLE_ID + core.contentDiv.id;
    }

    styleElement.sheet?.insertRule(css);

    return ranges;
}

function unselect(core: EditorCore) {
    const div = core.contentDiv;
    let styleElement = div.ownerDocument.getElementById(STYLE_ID + div.id) as HTMLStyleElement;
    if (styleElement?.sheet?.cssRules) {
        while (styleElement.sheet.cssRules.length > 0) {
            styleElement.sheet.deleteRule(0);
        }
    }
}

function ensureUniqueId(el: HTMLElement, idPrefix: string) {
    const doc = el.ownerDocument;

    if (!el.id) {
        let cont = 0;
        const getElement = () => doc.getElementById(idPrefix + cont);
        //Ensure that there are no elements with the same ID
        let element = getElement();
        while (element) {
            cont++;
            element = getElement();
        }

        el.id = idPrefix + cont;
    } else {
        const elements = doc.querySelectorAll(`#${el.id}`);
        if (elements.length > 1) {
            el.removeAttribute('id');
            ensureUniqueId(el, idPrefix);
        }
    }
}

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
        const styles = getStyles(cell);
        let modifiedStyles = 0;
        ['background-color', 'background'].forEach(style => {
            if (styles[style]?.indexOf('!important') > -1) {
                const index = styles[style].indexOf('!');
                styles[style] = styles[style].substring(0, index);
                modifiedStyles++;
            }
        });

        if (modifiedStyles > 0) {
            setStyles(cell, styles);
        }
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
