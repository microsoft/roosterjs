import { addRangeToSelection } from '../corePlugin/utils/addRangeToSelection';
import { isNodeOfType, toArray } from 'roosterjs-content-model-dom';
import { PluginEventType } from 'roosterjs-editor-types';
import { VTable } from 'roosterjs-editor-dom';
import type { SetDOMSelection, TableSelection } from 'roosterjs-content-model-types';

const IMAGE_ID = 'imageSelected';
const CONTENT_DIV_ID = 'contentDiv_';
const DEFAULT_SELECTION_BORDER_COLOR = '#DB626C';
const TABLE_ID = 'tableSelected';
const SELECTED_CSS_RULE =
    '{background-color: rgb(198,198,198) !important; caret-color: transparent}';
const MAX_RULE_SELECTOR_LENGTH = 9000;

/**
 * @internal
 */
export const setDOMSelection: SetDOMSelection = (core, selection, skipSelectionChangedEvent) => {
    // We are applying a new selection, so we don't need to apply cached selection in DOMEventPlugin.
    // Set skipReselectOnFocus to skip this behavior
    const skipReselectOnFocus = core.selection.skipReselectOnFocus;
    const doc = core.contentDiv.ownerDocument;

    core.selection.skipReselectOnFocus = true;

    try {
        let selectionRules: string[] | undefined;

        const divId = addUniqueId(core.contentDiv, CONTENT_DIV_ID);

        if (selection) {
            switch (selection.type) {
                case 'image':
                    const image = selection.image;
                    const imageId = addUniqueId(image, IMAGE_ID);

                    selectionRules = buildImageCSS(
                        divId,
                        imageId,
                        core.selection.imageSelectionBorderColor
                    );
                    core.selection.selection = selection;

                    setRangeSelection(doc, image);

                    break;
                case 'table':
                    const { table, firstColumn, firstRow } = selection;
                    const tableId = addUniqueId(table, TABLE_ID);
                    const firstCell = table.rows[firstRow]?.cells[firstColumn];

                    selectionRules = buildTableCss(divId, tableId, selection);
                    core.selection.selection = selection;

                    setRangeSelection(doc, firstCell);

                    break;
                case 'range':
                    addRangeToSelection(doc, selection.range);

                    core.selection.selection = core.api.hasFocus(core) ? null : selection;
                    break;
            }
        } else {
            core.selection.selection = null;
        }

        const sheet = core.selection.selectionStyleNode?.sheet;

        if (sheet) {
            for (let i = sheet.cssRules.length - 1; i >= 0; i--) {
                sheet.deleteRule(i);
            }

            if (selectionRules) {
                for (let i = 0; i < selectionRules.length; i++) {
                    sheet.insertRule(selectionRules[i]);
                }
            }
        }
    } finally {
        core.selection.skipReselectOnFocus = skipReselectOnFocus;
    }

    if (!skipSelectionChangedEvent) {
        core.api.triggerEvent(
            core,
            {
                eventType: PluginEventType.SelectionChanged,
                selectionRangeEx: null,
            },
            true /*broadcast*/
        );
    }
};

function setRangeSelection(doc: Document, element: HTMLElement | undefined) {
    if (element) {
        const range = doc.createRange();

        range.selectNode(element);
        range.collapse();

        addRangeToSelection(doc, range);
    }
}

function buildImageCSS(divId: string, imageId: string, borderColor?: string): string[] {
    const color = borderColor || DEFAULT_SELECTION_BORDER_COLOR;

    return [
        `#${divId} #${imageId} {outline-style: auto!important;outline-color: ${color}!important;caret-color: transparent!important;}`,
    ];
}

function addUniqueId(el: HTMLElement, idPrefix: string): string {
    const doc = el.ownerDocument;
    if (!el.id) {
        return applyId(el, idPrefix, doc);
    } else {
        const elements = doc.querySelectorAll(`#${el.id}`);
        if (elements.length > 1) {
            el.removeAttribute('id');
            return applyId(el, idPrefix, doc);
        } else {
            return el.id;
        }
    }
}

function applyId(el: HTMLElement, idPrefix: string, doc: Document) {
    let cont = 0;
    const getElement = () => doc.getElementById(idPrefix + cont);
    //Ensure that there are no elements with the same ID
    let element = getElement();
    while (element) {
        cont++;
        element = getElement();
    }

    const newId = idPrefix + cont;
    el.id = newId;

    return newId;
}

function buildTableCss(divId: string, tableId: string, selection: TableSelection): string[] {
    const selectors: string[] = [];
    const { firstColumn, firstRow, lastColumn, lastRow } = selection;
    const vTable = new VTable(selection.table);
    const isAllTableSelected =
        firstRow == 0 &&
        firstColumn == 0 &&
        lastRow == vTable.cells?.length &&
        lastColumn == vTable.cells?.[lastRow]?.length;

    if (isAllTableSelected) {
        handleAllTableSelected('#' + divId, tableId, vTable, selectors);
    } else {
        handleTableSelected(selection, tableId, vTable, '#' + divId, selectors);
    }

    const cssRules: string[] = [];
    let currentRules: string = '';

    while (selectors.length > 0) {
        currentRules += (currentRules.length > 0 ? ',' : '') + selectors.shift() || '';
        if (
            currentRules.length + (selectors[0]?.length || 0) > MAX_RULE_SELECTOR_LENGTH ||
            selectors.length == 0
        ) {
            cssRules.push(currentRules + ' ' + SELECTED_CSS_RULE);
            currentRules = '';
        }
    }

    return cssRules;
}

function handleAllTableSelected(
    contentDivSelector: string,
    tableId: string,
    vTable: VTable,
    selectors: string[]
) {
    const table = vTable.table;
    const tableSelector = contentDivSelector + ' #' + tableId;
    selectors.push(tableSelector, `${tableSelector} *`);

    const tableRange = new Range();
    tableRange.selectNode(table);
}

function handleTableSelected(
    selection: TableSelection,
    tableId: string,
    vTable: VTable,
    contentDivSelector: string,
    selectors: string[]
) {
    const tr1 = selection.firstRow;
    const td1 = selection.firstColumn;
    const tr2 = selection.lastRow;
    const td2 = selection.lastColumn;
    const table = vTable.table;

    let firstSelected: HTMLTableCellElement | null = null;
    let lastSelected: HTMLTableCellElement | null = null;

    // Get whether table has thead, tbody or tfoot.
    const tableChildren = toArray(table.childNodes).filter(
        (node): node is HTMLTableSectionElement =>
            ['THEAD', 'TBODY', 'TFOOT'].indexOf(
                isNodeOfType(node, 'ELEMENT_NODE') ? node.tagName : ''
            ) > -1
    );

    // Set the start and end of each of the table children, so we can build the selector according the element between the table and the row.
    let cont = 0;
    const indexes = tableChildren.map(node => {
        const result = {
            el: node.tagName,
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
                    const selector = generateCssFromCell(
                        contentDivSelector,
                        tableId,
                        middleElSelector,
                        currentRow,
                        cell.tagName,
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
        }
    });
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
