import { createElement } from '../../../pluginUtils/CreateElement/createElement';
import { getIntersectedRect } from '../../../pluginUtils/Rect/getIntersectedRect';
import { isElementOfType, normalizeRect } from 'roosterjs-content-model-dom';
import type { TableEditFeature } from './TableEditFeature';
import type { OnTableEditorCreatedCallback } from '../../OnTableEditorCreatedCallback';
import {
    formatTableWithContentModel,
    insertTableColumn,
    insertTableRow,
} from 'roosterjs-content-model-api';
import type { CreateElementData } from '../../../pluginUtils/CreateElement/CreateElementData';
import type { Disposable } from '../../../pluginUtils/Disposable';
import type { IEditor } from 'roosterjs-content-model-types';

const INSERTER_COLOR = '#4A4A4A';
const INSERTER_COLOR_DARK_MODE = 'white';
const INSERTER_SIDE_LENGTH = 12;
const INSERTER_BORDER_SIZE = 1;
/**
 * @internal
 */
export const HORIZONTAL_INSERTER_ID = 'horizontalInserter';
/**
 * @internal
 */
export const VERTICAL_INSERTER_ID = 'verticalInserter';

/**
 * @internal
 */
export function createTableInserter(
    editor: IEditor,
    td: HTMLTableCellElement,
    table: HTMLTableElement,
    isRTL: boolean,
    isHorizontal: boolean,
    onBeforeInsert: () => void,
    onAfterInserted: () => void,
    anchorContainer?: HTMLElement,
    onTableEditorCreated?: OnTableEditorCreatedCallback
): TableEditFeature | null {
    const tdRect = normalizeRect(td.getBoundingClientRect());
    const viewPort = editor.getVisibleViewport();
    if (tdRect && viewPort) {
        const isOutsideTop = tdRect.top <= viewPort.top;
        const isOutsideBottom = tdRect.bottom >= viewPort.bottom;

        if (isOutsideBottom || isOutsideTop) {
            return null;
        }
        const tableRect = table ? getIntersectedRect([table], [viewPort]) : null;
        // set inserter position
        if (tableRect) {
            const document = td.ownerDocument;
            const createElementData = getInsertElementData(
                isHorizontal,
                editor.isDarkMode(),
                isRTL,
                editor.getDOMHelper().getDomStyle('backgroundColor') || 'white'
            );

            const div = createElement(createElementData, document) as HTMLDivElement;

            if (isHorizontal) {
                // tableRect.left/right is used because the Inserter is always intended to be on the side
                div.id = HORIZONTAL_INSERTER_ID;
                div.style.left = `${
                    isRTL
                        ? tableRect.right
                        : tableRect.left - (INSERTER_SIDE_LENGTH - 1 + 2 * INSERTER_BORDER_SIZE)
                }px`;
                div.style.top = `${tdRect.bottom - 8}px`;
                (div.firstChild as HTMLElement).style.width = `${
                    tableRect.right - tableRect.left
                }px`;
            } else {
                div.id = VERTICAL_INSERTER_ID;
                div.style.left = `${isRTL ? tdRect.left - 8 : tdRect.right - 8}px`;
                // tableRect.top is used because the Inserter is always intended to be on top
                div.style.top = `${
                    tableRect.top - (INSERTER_SIDE_LENGTH - 1 + 2 * INSERTER_BORDER_SIZE)
                }px`;
                (div.firstChild as HTMLElement).style.height = `${
                    tableRect.bottom - tableRect.top
                }px`;
            }

            (anchorContainer || document.body).appendChild(div);

            const handler = new TableInsertHandler(
                div,
                td,
                table,
                isHorizontal,
                editor,
                onBeforeInsert,
                onAfterInserted,
                onTableEditorCreated
            );

            return { div, featureHandler: handler, node: td };
        }
    }

    return null;
}

/**
 * @internal
 * Exported for test only
 */
export class TableInsertHandler implements Disposable {
    private disposer: undefined | (() => void);
    constructor(
        private div: HTMLDivElement,
        private td: HTMLTableCellElement,
        private table: HTMLTableElement,
        private isHorizontal: boolean,
        private editor: IEditor,
        private onBeforeInsert: () => void,
        private onAfterInsert: () => void,
        onTableEditorCreated?: OnTableEditorCreatedCallback
    ) {
        this.div.addEventListener('click', this.insertTd);
        this.disposer = onTableEditorCreated?.(
            isHorizontal ? 'HorizontalTableInserter' : 'VerticalTableInserter',
            div
        );
    }

    dispose() {
        this.div.removeEventListener('click', this.insertTd);
        this.disposer?.();
        this.disposer = undefined;
    }

    private insertTd = () => {
        // Get cell coordinates
        const columnIndex = this.td.cellIndex;
        const row =
            this.td.parentElement && isElementOfType(this.td.parentElement, 'tr')
                ? this.td.parentElement
                : undefined;
        const rowIndex = row && row.rowIndex;

        if (row?.cells == undefined || rowIndex == undefined) {
            return;
        }

        this.onBeforeInsert();

        // Insert row or column
        formatTableWithContentModel(
            this.editor,
            'editTablePlugin',
            tableModel => {
                this.isHorizontal
                    ? insertTableRow(tableModel, 'insertBelow')
                    : insertTableColumn(tableModel, 'insertRight');
            }, // Select cell to make insertion
            {
                type: 'table',
                firstColumn: columnIndex,
                firstRow: rowIndex,
                lastColumn: columnIndex,
                lastRow: rowIndex,
                table: this.table,
            }
        );

        this.onAfterInsert();
    };
}

function getInsertElementData(
    isHorizontal: boolean,
    isDark: boolean,
    isRTL: boolean,
    backgroundColor: string
): CreateElementData {
    const inserterColor = isDark ? INSERTER_COLOR_DARK_MODE : INSERTER_COLOR;
    const outerDivStyle = `position: fixed; width: ${INSERTER_SIDE_LENGTH}px; height: ${INSERTER_SIDE_LENGTH}px; font-size: 16px; color: black; line-height: 8px; vertical-align: middle; text-align: center; cursor: pointer; border: solid ${INSERTER_BORDER_SIZE}px ${inserterColor}; border-radius: 50%; background-color: ${backgroundColor}`;
    const leftOrRight = isRTL ? 'right' : 'left';
    const childBaseStyles = `position: absolute; box-sizing: border-box; background-color: ${backgroundColor};`;
    const childInfo: CreateElementData = {
        tag: 'div',
        style:
            childBaseStyles +
            (isHorizontal
                ? `${leftOrRight}: 12px; top: 5px; height: 3px; border-top: 1px solid ${inserterColor}; border-bottom: 1px solid ${inserterColor}; border-right: 1px solid ${inserterColor}; border-left: 0px;`
                : `left: 5px; top: 12px; width: 3px; border-left: 1px solid ${inserterColor}; border-right: 1px solid ${inserterColor}; border-bottom: 1px solid ${inserterColor}; border-top: 0px;`),
    };

    return {
        tag: 'div',
        style: outerDivStyle,
        children: [childInfo, '+'],
    };
}
