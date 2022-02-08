import { getTagOfNode, normalizeTableSelection, toArray } from 'roosterjs-editor-dom';
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

    if (!table && !coordinates && styleElement) {
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

    let firstSelected: HTMLTableCellElement | null = null;
    let lastSelected: HTMLTableCellElement | null = null;
    let css = '';
    let isFirst = true;

    // Get whether table has thead, tbody or tfoot.
    const tableChilds = toArray(table.childNodes).filter(
        node => ['THEAD', 'TBODY', 'TFOOT'].indexOf(getTagOfNode(node)) > -1
    );

    // Set the start and end of each of the table childs, so we can build the selector according the element between the table and the row.
    let cont = 0;
    const indexes = tableChilds.map(node => {
        const result = {
            el: getTagOfNode(node),
            start: cont + 1,
            end: node.childNodes.length + cont,
        };

        cont = result.end;
        return result;
    });

    for (let i = tr1; i <= tr2; i++) {
        firstSelected = null;
        lastSelected = null;

        //Get current TBODY/THEAD/TFOOT
        const middleElement = indexes.filter(ind => ind.start <= i && ind.end >= i)[0];

        //Get selector that is going to be used, if no middle Element, means tr is underneath of the table element.
        const middleElSelector = middleElement ? '>' + middleElement.el + '>' : '>';

        //Get current index depending on the middle element, if no middle element just return the index
        const currentRow =
            middleElement && i >= middleElement.start ? i - middleElement.start + 1 : i;

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
                middleElSelector +
                ' tr:nth-child(' +
                currentRow +
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
        firstSelected =
            firstSelected ||
            table.querySelector('tr:nth-child(' + currentRow + ')>td:nth-child(' + td1 + ')');
        lastSelected = table.querySelector(
            'tr:nth-child(' + currentRow + ')>td:nth-child(' + td2 + ')'
        )!;

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
function ensureUniqueId(table: HTMLTableElement, doc?: Document): string {
    let cont = 0;

    if (doc && !table.id) {
        //Ensure that:
        //  1. there are no elements with the same ID
        //  2. No Style added for the same ID
        const getElement = () =>
            doc.getElementById(TABLE_ID + cont) || document.getElementById(TABLE_ID + cont);

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
