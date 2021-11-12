import findClosestElementAncestor from './findClosestElementAncestor';
import getTagOfNode from './getTagOfNode';
import safeInstanceOf from './safeInstanceOf';
import VTable from '../table/VTable';
import { IContentTraverser } from 'roosterjs-editor-types';

/**
 * Highlight the table cells when are in the selection range
 * @param selection Wether a Selection from the document when browser is Firefox or a Content Traverser
 */
export const highlightTableSelection = (selection: Selection | IContentTraverser) => {
    let firstTDSelected: HTMLTableCellElement;
    let lastTDSelected: HTMLTableCellElement;
    let table: HTMLTableElement;

    if (selection instanceof Selection) {
        for (let index = 0; index < selection.rangeCount; index++) {
            const range = selection.getRangeAt(index);
            const container = range.startContainer;
            if (getTagOfNode(container) == 'TR') {
                let element = container.childNodes[range.startOffset] as HTMLElement;

                if (getTagOfNode(element) != 'TD') {
                    element = findClosestElementAncestor(element, null, 'td');
                }

                if (element && safeInstanceOf(element, 'HTMLTableCellElement')) {
                    let tempTable = findClosestElementAncestor(
                        element,
                        null,
                        'table'
                    ) as HTMLTableElement;
                    if (tempTable && tempTable != table) {
                        table = tempTable;
                        firstTDSelected = element;
                    } else {
                        lastTDSelected = element;
                    }

                    if (index == selection.rangeCount - 1) {
                        setTableSelectedRange(table, firstTDSelected, lastTDSelected);
                        break;
                    }
                } else {
                    if (table) {
                        setTableSelectedRange(table, firstTDSelected, lastTDSelected);
                    }
                }
            }
        }
    } else {
        while (selection?.currentBlockElement) {
            let currentElement = selection.currentBlockElement;
            selection.getNextBlockElement();

            let element = currentElement.collapseToSingleElement();

            if (getTagOfNode(element) != 'TD') {
                element = findClosestElementAncestor(element, null, 'td');
            }
            if (element && safeInstanceOf(element, 'HTMLTableCellElement')) {
                let tempTable = findClosestElementAncestor(
                    element,
                    null,
                    'table'
                ) as HTMLTableElement;
                if (tempTable && tempTable != table) {
                    table = tempTable;
                    firstTDSelected = element;
                } else {
                    lastTDSelected = element;
                }

                if (selection.currentBlockElement == currentElement) {
                    setTableSelectedRange(table, firstTDSelected, lastTDSelected);
                    break;
                }
            } else {
                if (table) {
                    setTableSelectedRange(table, firstTDSelected, lastTDSelected);
                }
            }

            if (selection.currentBlockElement == currentElement) {
                break;
            }
        }
    }
};

/**
 * Set the table selected range by adding a background color style
 * @param table the table
 * @param firstTDSelected first table cell of the range
 * @param lastTDSelected last table cell of the range
 */
export const setTableSelectedRange = (
    table: HTMLTableElement,
    firstTDSelected: HTMLTableCellElement,
    lastTDSelected: HTMLTableCellElement
) => {
    if (firstTDSelected && !lastTDSelected) {
        lastTDSelected = firstTDSelected;
    }
    let vTable = new VTable(table);
    vTable.highlightSelection(firstTDSelected, lastTDSelected);
};
