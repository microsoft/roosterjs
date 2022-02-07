import {
    EditorCore,
    SelectionRangeTypes,
    TableSelection,
    SelectTable,
} from 'roosterjs-editor-types';

const TABLE_ID = 'tableSelected';
const CONTENT_DIV_ID = 'contentDiv_';

let styleElement: HTMLStyleElement;

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
    const doc = core.contentDiv.ownerDocument;

    if (coordinates) {
        ensureUniqueContentDivId(core);
        table.id = ensureUniqueId(table, doc);
        const ranges = select(table, coordinates, core);
        return {
            type: SelectionRangeTypes.TableSelection,
            ranges,
            table,
            areAllCollapsed: ranges.filter(range => range?.collapsed).length == ranges.length,
            coordinates,
        };
    }

    unselect();

    if (!coordinates && styleElement) {
        styleElement.parentElement.removeChild(styleElement);
        styleElement = null;
    }
    return null;
};

function buildCss(
    table: HTMLTableElement,
    coordinates: TableSelection,
    contentDivSelector: string
): { css: string; ranges: Range[] } {
    coordinates = normalizeTableSelection(coordinates);
    const tr1 = coordinates.firstCell.y + 1;
    const td1 = coordinates.firstCell.x + 1;
    const tr2 = coordinates.lastCell.y + 1;
    const td2 = coordinates.lastCell.x + 1;
    const ranges: Range[] = [];
    const tbodySelector = table.querySelector('tbody') ? '>tbody' : '';
    let firstSelected: HTMLTableCellElement | null = null;
    let lastSelected: HTMLTableCellElement | null = null;

    let css = '';

    let isFirst = true;
    for (let i = tr1; i <= tr2; i++) {
        firstSelected = null;
        lastSelected = null;

        for (let j = td1; j <= td2; j++) {
            if (isFirst) {
                isFirst = false;
            } else {
                css += ',';
            }

            let selector =
                contentDivSelector +
                ' #' +
                table.id +
                tbodySelector +
                ' >tr:nth-child(' +
                i +
                ')>td:nth-child(' +
                j +
                ')';
            if (table.querySelector(selector)) {
                css += selector;
            } else {
                selector = selector.replace('td', 'th');
                if (table.querySelector(selector)) {
                    css += selector;
                }
            }
        }

        const rowSelector = 'tr:nth-child(' + i + ')>';
        const firstSelector = `${rowSelector}td:nth-child(${td1}),${rowSelector}th:nth-child(${td1})`;
        const lastSelector = `${rowSelector}td:nth-child(${td2}),${rowSelector}th:nth-child(${td2})`;

        firstSelected = table.querySelector(firstSelector);
        lastSelected = table.querySelector(lastSelector)!;
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

function select(table: HTMLTableElement, coordinates: TableSelection, core: EditorCore): Range[] {
    const doc = core.contentDiv.ownerDocument;
    const contentDivId = core.contentDiv.id;

    const contentDivSelector = '#' + contentDivId;
    let { css, ranges } = buildCss(table, coordinates, contentDivSelector);
    if (doc) {
        unselect();
        if (styleElement && styleElement.ownerDocument != doc) {
            styleElement.parentElement.removeChild(styleElement);
            styleElement = null;
        }
        if (!styleElement) {
            styleElement = doc.createElement('style');
            doc.head.appendChild(styleElement);
        }
        styleElement.sheet.insertRule(css);
    }

    return ranges;
}

function unselect() {
    if (styleElement?.sheet?.cssRules) {
        while (styleElement.sheet.cssRules.length > 0) {
            styleElement.sheet.deleteRule(0);
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
        x: Math.min(firstCell.x, lastCell.x),
        y: Math.min(firstCell.y, lastCell.y),
    };
    let newLast = {
        x: Math.max(firstCell.x, lastCell.x),
        y: Math.max(firstCell.y, lastCell.y),
    };

    return { firstCell: newFirst, lastCell: newLast };
}

function ensureUniqueId(table: HTMLTableElement, doc?: Document): string {
    let cont = 0;

    if (doc && !table.id) {
        //Ensure that:
        //  1. there are no elements with the same ID
        const getElement = () =>
            doc.getElementById(TABLE_ID) || document.getElementById(TABLE_ID + cont);

        let element = getElement();
        while (element) {
            element = getElement();
            cont++;
        }
        return TABLE_ID + cont;
    }
    return table.id;
}

function ensureUniqueContentDivId(core: EditorCore) {
    const div = core.contentDiv;
    const doc = div.ownerDocument;
    let id = div.id;
    const getElement = (doc: Document) => doc.getElementById(CONTENT_DIV_ID + cont);
    let cont = 0;

    if (!id) {
        //Ensure that there are no elements with the same ID
        let element = getElement(doc) || getElement(document);
        while (element) {
            element = getElement(doc) || getElement(document);
            cont++;
        }

        div.id = CONTENT_DIV_ID + cont;
    }
}
