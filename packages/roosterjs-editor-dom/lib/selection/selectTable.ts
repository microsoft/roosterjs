import { SelectionRangeTypes, TableSelection, TableSelectionRange } from 'roosterjs-editor-types';

const TABLE_ID = 'roosterjs_tableSelected_';
const STYLE_TAG_ID = 'style_';

/**
 * Select a table
 * @param table table to select
 * @param coordinates first and last cell of the selection, if this parameter is null, instead of
 * selecting, will unselect the table.
 * @param document owner document of the table, if added will append a style element with styles to add to the table
 * @returns TableSelectionRange if selected a new table, if unselecting the table, null
 */
export default function selectTable(
    table: HTMLTableElement,
    coordinates?: TableSelection,
    document?: Document
): TableSelectionRange | null {
    if (coordinates) {
        table.id = ensureUniqueId(table, document);
        const ranges = select(table, coordinates, document);

        return {
            type: SelectionRangeTypes.TableSelection,
            ranges,
            table,
            areAllCollapsed: ranges.filter(range => range?.collapsed).length == ranges.length,
            coordinates,
        };
    }

    unselect(STYLE_TAG_ID + table.id, document);
    return null;
}

function buildCss(
    table: HTMLTableElement,
    coordinates: TableSelection
): { css: string; ranges: Range[] } {
    coordinates = normalizeTableSelection(coordinates);
    const tr1 = coordinates.firstCell.y + 1;
    const td1 = coordinates.firstCell.x + 1;
    const tr2 = coordinates.lastCell.y + 1;
    const td2 = coordinates.lastCell.x + 1;
    const ranges: Range[] = [];
    let firstSelected: HTMLTableCellElement | null = null;
    let lastSelected: HTMLTableCellElement | null = null;

    let css = '';

    var isFirst = true;
    for (var i = tr1; i <= tr2; i++) {
        firstSelected = null;
        lastSelected = null;

        for (var j = td1; j <= td2; j++) {
            if (isFirst) {
                isFirst = false;
            } else {
                css += ',';
            }
            css += '#' + table.id + '>tbody>tr:nth-child(' + i + ')>td:nth-child(' + j + ')';
        }

        firstSelected =
            firstSelected ||
            table.querySelector('tr:nth-child(' + i + ')>td:nth-child(' + td1 + ')');
        lastSelected = table.querySelector('tr:nth-child(' + i + ')>td:nth-child(' + td2 + ')')!;

        if (firstSelected && lastSelected) {
            const rowRange = new Range();
            rowRange.setStartBefore(firstSelected);
            rowRange.setEndAfter(lastSelected);
            ranges.push(rowRange);
        }
    }

    css += '{background-color: rgba(198,198,198,0.7) !important;}';

    return { css, ranges };
}

function select(
    table: HTMLTableElement,
    coordinates: TableSelection,
    document?: Document
): Range[] {
    let { css, ranges } = buildCss(table, coordinates);

    if (document) {
        const id = table.id;
        unselect(STYLE_TAG_ID + id, document);
        var style = document.createElement('style');
        style.id = STYLE_TAG_ID + id;
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }

    return ranges;
}

function unselect(id: string, document?: Document) {
    if (document) {
        var style = document.getElementById(id);
        if (style) {
            style.parentNode?.removeChild(style);
        }
    }
}

/**
 * Make the first Cell of a table selection always be on top of the last cell.
 * @param input Table selection
 * @returns Table Selection where the first cell is always going to be first selected in the table
 * and the last cell always going to be last selected in the table.
 */
function normalizeTableSelection(input: TableSelection): TableSelection {
    const { firstCell, lastCell } = input;

    let newFirst = {
        x: min(firstCell.x, lastCell.x),
        y: min(firstCell.y, lastCell.y),
    };
    let newLast = {
        x: max(firstCell.x, lastCell.x),
        y: max(firstCell.y, lastCell.y),
    };

    return { firstCell: newFirst, lastCell: newLast };
}

function min(input1: number, input2: number) {
    return input1 > input2 ? input2 : input1;
}

function max(input1: number, input2: number) {
    return input1 < input2 ? input2 : input1;
}

function ensureUniqueId(table: HTMLTableElement, document?: Document): string {
    let cont = 0;

    if (document && !table.id) {
        //Ensure that:
        //  1. there are no elements with the same ID
        //  2. No Style added for the same ID
        let element = document.getElementById(TABLE_ID + cont);
        let styleElement = document.getElementById(STYLE_TAG_ID + TABLE_ID + cont);
        while (element || styleElement) {
            element = document.getElementById(TABLE_ID + cont);
            styleElement = document.getElementById(STYLE_TAG_ID + TABLE_ID + cont);
            cont++;
        }

        return TABLE_ID + cont;
    }
    return table.id;
}
