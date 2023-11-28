import { addRangeToSelection } from '../corePlugin/utils/addRangeToSelection';
import { PluginEventType } from 'roosterjs-editor-types';
import { toArray } from 'roosterjs-content-model-dom';
import {
    VTable,
    getTagOfNode,
    removeGlobalCssStyle,
    setGlobalCssStyles,
} from 'roosterjs-editor-dom';
import type {
    SetDOMSelection,
    StandaloneEditorCore,
    TableSelection,
} from 'roosterjs-content-model-types';

const IMAGE_ID = 'imageSelected';
const CONTENT_DIV_ID = 'contentDiv_';
const IMAGE_STYLE_ID = 'imageStyle';
const DEFAULT_SELECTION_BORDER_COLOR = '#DB626C';
const TABLE_ID = 'tableSelected';
const TABLE_STYLE_ID = 'tableStyle';
const SELECTED_CSS_RULE =
    '{background-color: rgb(198,198,198) !important; caret-color: transparent}';
const MAX_RULE_SELECTOR_LENGTH = 9000;

/**
 * @internal
 */
export const setDOMSelection: SetDOMSelection = (core, selection) => {
    // We are applying a new selection, so we don't need to apply cached selection in DOMEventPlugin.
    // Set skipReselectOnFocus to skip this behavior
    const skipReselectOnFocus = core.selection.skipReselectOnFocus;
    const doc = core.contentDiv.ownerDocument;

    core.selection.skipReselectOnFocus = true;

    unselectImage(core);
    unselectTable(core);

    try {
        if (selection) {
            switch (selection.type) {
                case 'image':
                    const image = selection.image;

                    addUniqueId(image, IMAGE_ID);
                    addUniqueId(core.contentDiv, CONTENT_DIV_ID);

                    const range = doc.createRange();

                    range.selectNode(image);
                    range.collapse();

                    addRangeToSelection(doc, range);
                    selectImage(core, image);

                    core.selection.selection = selection;

                    break;
                case 'table':
                    const { table, firstColumn, firstRow } = selection;

                    addUniqueId(table, TABLE_ID);
                    addUniqueId(core.contentDiv, CONTENT_DIV_ID);

                    selectTable(core, selection);

                    if (!isMergedCell(selection)) {
                        const cellToSelect = table.rows.item(firstRow)?.cells.item(firstColumn);

                        if (cellToSelect) {
                            const range = doc.createRange();

                            range.selectNode(cellToSelect);
                            range.collapse();
                            addRangeToSelection(doc, range);
                        }
                    }

                    core.selection.selection = selection;

                    break;
                case 'range':
                    addRangeToSelection(doc, selection.range);

                    core.selection.selection = core.api.hasFocus(core) ? null : selection;
                    break;
            }
        } else {
            core.selection.selection = null;
        }
    } finally {
        core.selection.skipReselectOnFocus = skipReselectOnFocus;
    }

    core.api.triggerEvent(
        core,
        {
            eventType: PluginEventType.SelectionChanged,
            selectionRangeEx: null,
        },
        true /*broadcast*/
    );
};

function unselectImage(core: StandaloneEditorCore) {
    const doc = core.contentDiv.ownerDocument;
    removeGlobalCssStyle(doc, IMAGE_STYLE_ID + core.contentDiv.id);
}

function selectImage(core: StandaloneEditorCore, image: HTMLImageElement) {
    const borderCSS = buildImageBorderCSS(core, image.id);
    setGlobalCssStyles(
        core.contentDiv.ownerDocument,
        borderCSS,
        IMAGE_STYLE_ID + core.contentDiv.id
    );
}

function buildImageBorderCSS(core: StandaloneEditorCore, imageId: string): string {
    const divId = core.contentDiv.id;
    const color = core.imageSelectionBorderColor || DEFAULT_SELECTION_BORDER_COLOR;

    return `#${divId} #${imageId} {outline-style: auto!important;outline-color: ${color}!important;caret-color: transparent!important;}`;
}

function addUniqueId(el: HTMLElement, idPrefix: string) {
    const doc = el.ownerDocument;
    if (!el.id) {
        applyId(el, idPrefix, doc);
    } else {
        const elements = doc.querySelectorAll(`#${el.id}`);
        if (elements.length > 1) {
            el.removeAttribute('id');
            applyId(el, idPrefix, doc);
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

    el.id = idPrefix + cont;
}

function unselectTable(core: StandaloneEditorCore) {
    const doc = core.contentDiv.ownerDocument;
    removeGlobalCssStyle(doc, TABLE_STYLE_ID + core.contentDiv.id);
}

function selectTable(core: StandaloneEditorCore, selection: TableSelection) {
    const contentDivSelector = '#' + core.contentDiv.id;
    const cssRules = buildTableCss(selection, contentDivSelector);

    cssRules.forEach(css =>
        setGlobalCssStyles(core.contentDiv.ownerDocument, css, TABLE_STYLE_ID + core.contentDiv.id)
    );
}

function buildTableCss(selection: TableSelection, contentDivSelector: string): string[] {
    const selectors: string[] = [];
    const { firstColumn, firstRow, lastColumn, lastRow } = selection;
    const vTable = new VTable(selection.table);
    const isAllTableSelected =
        firstRow == 0 &&
        firstColumn == 0 &&
        lastRow == vTable.cells?.length &&
        lastColumn == vTable.cells?.[lastRow]?.length;

    if (isAllTableSelected) {
        handleAllTableSelected(contentDivSelector, vTable, selectors);
    } else {
        handleTableSelected(selection, vTable, contentDivSelector, selectors);
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

function handleAllTableSelected(contentDivSelector: string, vTable: VTable, selectors: string[]) {
    const table = vTable.table;
    const tableSelector = contentDivSelector + ' #' + table.id;
    selectors.push(tableSelector, `${tableSelector} *`);

    const tableRange = new Range();
    tableRange.selectNode(table);
}

function handleTableSelected(
    selection: TableSelection,
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

function isMergedCell(selection: TableSelection): boolean {
    const { table, firstRow, firstColumn } = selection;
    return !(table.rows.item(firstRow) && table.rows.item(firstRow)?.cells.item(firstColumn));
}
