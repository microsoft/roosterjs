import Disposable from '../../../pluginUtils/Disposable';
import TableEditFeature from './TableEditorFeature';
import { createElement, getIntersectedRect, normalizeRect, VTable } from 'roosterjs-editor-dom';
import { CreateElementData, IEditor, TableOperation } from 'roosterjs-editor-types';

const INSERTER_COLOR = '#4A4A4A';
const INSERTER_COLOR_DARK_MODE = 'white';
const INSERTER_SIDE_LENGTH = 12;
const INSERTER_BORDER_SIZE = 1;

/**
 * @internal
 */
export default function createTableInserter(
    editor: IEditor,
    td: HTMLTableCellElement,
    isRTL: boolean,
    isHorizontal: boolean,
    onInsert: (table: HTMLTableElement) => void,
    getOnMouseOut: (feature: HTMLElement) => (ev: MouseEvent) => void,
    onShowHelperElement?: (
        elementData: CreateElementData,
        helperType: 'CellResizer' | 'TableInserter' | 'TableResizer' | 'TableSelector'
    ) => void
): TableEditFeature | null {
    const table = editor.getElementAtCursor('table', td);

    const tdRect = normalizeRect(td.getBoundingClientRect());
    const viewPort = editor.getVisibleViewport();
    const tableRect = table && viewPort ? getIntersectedRect([table], [viewPort]) : null;

    // set inserter position
    if (tdRect && tableRect) {
        const document = td.ownerDocument;
        const createElementData = getInsertElementData(
            isHorizontal,
            editor.isDarkMode(),
            isRTL,
            editor.getDefaultFormat().backgroundColor || 'white'
        );

        onShowHelperElement?.(createElementData, 'TableInserter');

        const div = createElement(createElementData, document) as HTMLDivElement;

        if (isHorizontal) {
            // tableRect.left/right is used because the Inserter is always intended to be on the side
            div.style.left = `${
                isRTL
                    ? tableRect.right
                    : tableRect.left - (INSERTER_SIDE_LENGTH - 1 + 2 * INSERTER_BORDER_SIZE)
            }px`;
            div.style.top = `${tdRect.bottom - 8}px`;
            (div.firstChild as HTMLElement).style.width = `${tableRect.right - tableRect.left}px`;
        } else {
            div.style.left = `${isRTL ? tdRect.left - 8 : tdRect.right - 8}px`;
            // tableRect.top is used because the Inserter is always intended to be on top
            div.style.top = `${
                tableRect.top - (INSERTER_SIDE_LENGTH - 1 + 2 * INSERTER_BORDER_SIZE)
            }px`;
            (div.firstChild as HTMLElement).style.height = `${tableRect.bottom - tableRect.top}px`;
        }

        document.body.appendChild(div);

        const handler = new TableInsertHandler(
            div,
            td,
            isHorizontal,
            editor,
            onInsert,
            getOnMouseOut
        );

        return { div, featureHandler: handler, node: td };
    }

    return null;
}

class TableInsertHandler implements Disposable {
    private onMouseOutEvent: null | ((ev: MouseEvent) => void);
    constructor(
        private div: HTMLDivElement,
        private td: HTMLTableCellElement,
        private isHorizontal: boolean,
        private editor: IEditor,
        private onInsert: (table: HTMLTableElement) => void,
        getOnMouseOut: (feature: HTMLElement) => (ev: MouseEvent) => void
    ) {
        this.div.addEventListener('click', this.insertTd);
        this.onMouseOutEvent = getOnMouseOut(div);
        this.div.addEventListener('mouseout', this.onMouseOutEvent);
    }

    dispose() {
        this.div.removeEventListener('click', this.insertTd);

        if (this.onMouseOutEvent) {
            this.div.removeEventListener('mouseout', this.onMouseOutEvent);
        }

        this.onMouseOutEvent = null;
    }

    private insertTd = () => {
        let vtable = new VTable(this.td);
        if (!this.isHorizontal) {
            vtable.normalizeTableCellSize(this.editor.getZoomScale());

            // Since adding new column will cause table width to change, we need to remove width properties
            vtable.table.removeAttribute('width');
            vtable.table.style.setProperty('width', null);
        }

        vtable.edit(this.isHorizontal ? TableOperation.InsertBelow : TableOperation.InsertRight);
        vtable.writeBack();

        this.onInsert(vtable.table);
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
