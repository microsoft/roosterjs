import { addRangeToSelection } from './addRangeToSelection';
import { isNodeOfType, toArray } from 'roosterjs-content-model-dom';
import { parseTableCells } from '../../publicApi/domUtils/tableCellUtils';
import type {
    SelectionChangedEvent,
    SetDOMSelection,
    TableSelection,
} from 'roosterjs-content-model-types';

const IMAGE_ID = 'image';
const TABLE_ID = 'table';
const CONTENT_DIV_ID = 'contentDiv';
const DEFAULT_SELECTION_BORDER_COLOR = '#DB626C';
const TABLE_CSS_RULE = '{background-color: rgb(198,198,198) !important;}';
const CARET_CSS_RULE = '{caret-color: transparent}';
const MAX_RULE_SELECTOR_LENGTH = 9000;

/**
 * @internal
 */
export const setDOMSelection: SetDOMSelection = (core, selection, skipSelectionChangedEvent) => {
    // We are applying a new selection, so we don't need to apply cached selection in DOMEventPlugin.
    // Set skipReselectOnFocus to skip this behavior
    const skipReselectOnFocus = core.selection.skipReselectOnFocus;

    const doc = core.physicalRoot.ownerDocument;
    const sheet = core.selection.selectionStyleNode?.sheet;

    core.selection.skipReselectOnFocus = true;

    try {
        let selectionRules: string[] | undefined;
        const rootSelector = '#' + addUniqueId(core.physicalRoot, CONTENT_DIV_ID);

        switch (selection?.type) {
            case 'image':
                const image = selection.image;

                selectionRules = buildImageCSS(
                    rootSelector,
                    addUniqueId(image, IMAGE_ID),
                    core.selection.imageSelectionBorderColor
                );
                core.selection.selection = selection;

                setRangeSelection(doc, image);
                break;
            case 'table':
                const { table, firstColumn, firstRow } = selection;

                selectionRules = buildTableCss(
                    rootSelector,
                    addUniqueId(table, TABLE_ID),
                    selection
                );
                core.selection.selection = selection;

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
        const eventData: SelectionChangedEvent = {
            eventType: 'selectionChanged',
            newSelection: selection,
        };

        core.api.triggerEvent(core, eventData, true /*broadcast*/);
    }
};

function buildImageCSS(editorSelector: string, imageId: string, borderColor?: string): string[] {
    const color = borderColor || DEFAULT_SELECTION_BORDER_COLOR;

    return [
        `${editorSelector} #${imageId} {outline-style:auto!important;outline-color:${color}!important;}`,
        `${editorSelector} ${CARET_CSS_RULE}`,
    ];
}

function buildTableCss(
    editorSelector: string,
    tableId: string,
    selection: TableSelection
): string[] {
    const { firstColumn, firstRow, lastColumn, lastRow } = selection;
    const cells = parseTableCells(selection.table);
    const isAllTableSelected =
        firstRow == 0 &&
        firstColumn == 0 &&
        lastRow == cells.length - 1 &&
        lastColumn == (cells[lastRow]?.length ?? 0) - 1;
    const rootSelector = editorSelector + ' #' + tableId;
    const selectors = isAllTableSelected
        ? [rootSelector, `${rootSelector} *`]
        : handleTableSelected(rootSelector, selection, cells);

    const cssRules: string[] = [`${editorSelector} ${CARET_CSS_RULE}`];
    let currentRules: string = '';

    for (let i = 0; i < selectors.length; i++) {
        currentRules += (currentRules.length > 0 ? ',' : '') + selectors[i] || '';

        if (
            currentRules.length + (selectors[0]?.length || 0) > MAX_RULE_SELECTOR_LENGTH ||
            i == selectors.length - 1
        ) {
            cssRules.push(currentRules + ' ' + TABLE_CSS_RULE);
            currentRules = '';
        }
    }

    return cssRules;
}

function handleTableSelected(
    rootSelector: string,
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
                    const selector = `${rootSelector}${middleElSelector} tr:nth-child(${currentRow})>${cell.tagName}:nth-child(${tdCount})`;

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

function addUniqueId(element: HTMLElement, idPrefix: string): string {
    idPrefix = element.id || idPrefix;

    const doc = element.ownerDocument;
    let i = 0;

    while (!element.id || doc.querySelectorAll('#' + element.id).length > 1) {
        element.id = idPrefix + '_' + i++;
    }

    return element.id;
}
