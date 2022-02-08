import { getTagOfNode, toArray } from 'roosterjs-editor-dom';
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
    unselect();

    if (coordinates && table) {
        ensureUniqueId(table, TABLE_ID);
        ensureUniqueId(core.contentDiv, CONTENT_DIV_ID);

        const ranges = select(core, table, coordinates);
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
            } else if (!css.endsWith(',')) {
                css += ',';
            }

            let selector =
                contentDivSelector +
                ' #' +
                table.id +
                middleElSelector +
                ' tr:nth-child(' +
                currentRow +
                ')>*:nth-child(' +
                j +
                ')';

            css += selector;
        }

        const rowSelector =
            (middleElement ? middleElement.el + '>' : '') + 'tr:nth-child(' + currentRow + ')>';
        const firstSelector = `${rowSelector}*:nth-child(${td1})`;
        const lastSelector = `${rowSelector}*:nth-child(${td2})`;

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

function select(core: EditorCore, table: HTMLTableElement, coordinates: TableSelection): Range[] {
    const doc = core.contentDiv.ownerDocument;
    const contentDivSelector = '#' + core.contentDiv.id;
    let { css, ranges } = buildCss(table, coordinates, contentDivSelector);

    if (!styleElement) {
        styleElement = doc.createElement('style');
        doc.head.appendChild(styleElement);
    }
    styleElement.sheet.insertRule(css);

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

function ensureUniqueId(el: HTMLElement, idPrefix: string) {
    if (el && !el.id) {
        const doc = el.ownerDocument;
        const getElement = (doc: Document) => doc.getElementById(idPrefix + cont);
        let cont = 0;
        //Ensure that there are no elements with the same ID
        let element = getElement(doc);
        while (element) {
            element = getElement(doc);
            cont++;
        }

        el.id = idPrefix + cont;
    }
}
