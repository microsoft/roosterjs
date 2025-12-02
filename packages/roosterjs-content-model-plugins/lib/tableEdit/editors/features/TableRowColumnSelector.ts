import { createElement } from '../../../pluginUtils/CreateElement/createElement';
import { CreateElementData } from 'roosterjs-editor-types';
import { Disposable } from '../../../pluginUtils/Disposable';
import { normalizeRect } from 'roosterjs-content-model-dom';
import type { TableEditFeature } from './TableEditFeature';
import type { OnTableEditorCreatedCallback } from '../../OnTableEditorCreatedCallback';
import type { IEditor, Rect } from 'roosterjs-content-model-types';

/**
 * @internal
 */
const ROW_SELECTOR_ID = 'rowSelector';
/**
 * @internal
 */
const COLUMN_SELECTOR_ID = 'columnSelector';

const STABLE_DOWN_ARROW_CURSOR =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48dGV4dCB4PSI4IiB5PSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNCIgZmlsbD0iYmxhY2siPiYjMTI5MDk1OzwvdGV4dD48L3N2Zz4=';

const STABLE_RIGHT_ARROW_CURSOR =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNiIgaGVpZ2h0PSIxNiIgdmlld0JveD0iMCAwIDE2IDE2Ij48dGV4dCB4PSI4IiB5PSIxMiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSIxNCIgZmlsbD0iYmxhY2siPiYjMTI5MDk4OzwvdGV4dD48L3N2Zz4=';

/**
 * @internal
 */
export function createTableRowColumnSelector(
    editor: IEditor,
    td: HTMLTableCellElement,
    table: HTMLTableElement,
    index: number,
    length: number,
    isRowSelector: boolean,
    onBeforeInsert: () => void,
    onAfterInserted: () => void,
    anchorContainer?: HTMLElement,
    onTableEditorCreated?: OnTableEditorCreatedCallback
): TableEditFeature | null {
    const tdRect = normalizeRect(td.getBoundingClientRect());

    if (tdRect) {
        const createElementData = getInsertElementData(tdRect, isRowSelector);
        const div = createElement(createElementData, document) as HTMLDivElement;
        div.id = isRowSelector ? ROW_SELECTOR_ID : COLUMN_SELECTOR_ID;

        (anchorContainer || document.body).appendChild(div);
        const handler = new TableSelectorHandler(
            editor,
            div,
            table,
            isRowSelector,
            index,
            length,
            onBeforeInsert,
            onAfterInserted,
            onTableEditorCreated
        );
        return { div, featureHandler: handler, node: td };
    }

    return null;
}

export class TableSelectorHandler implements Disposable {
    private disposer: undefined | (() => void);
    constructor(
        private editor: IEditor,
        private div: HTMLDivElement,
        private table: HTMLTableElement,
        private isRow: boolean,
        private index: number,
        private length: number,
        private onBeforeInsert: () => void,
        private onAfterInsert: () => void,
        onTableEditorCreated?: OnTableEditorCreatedCallback
    ) {
        this.div.addEventListener('click', this.selectRowColumn);
        this.disposer = onTableEditorCreated?.(
            this.isRow ? 'TableRowSelector' : 'TableColumnSelector',
            div
        );
    }

    dispose() {
        this.div.removeEventListener('click', this.selectRowColumn);
        this.disposer?.();
        this.disposer = undefined;
    }

    private selectRowColumn = () => {
        this.onBeforeInsert();
        if (this.isRow) {
            this.editor.setDOMSelection({
                type: 'table',
                table: this.table,
                firstRow: this.index,
                firstColumn: 0,
                lastColumn: this.length,
                lastRow: this.index,
            });
        } else {
            this.editor.setDOMSelection({
                type: 'table',
                table: this.table,
                firstRow: 0,
                firstColumn: this.index,
                lastColumn: this.index,
                lastRow: this.length,
            });
        }

        this.onAfterInsert();
    };
}

function getInsertElementData(rect: Rect, isRowSelector: boolean): CreateElementData {
    const length = isRowSelector ? rect.bottom - rect.top : rect.right - rect.left;
    const size = isRowSelector
        ? `width: 30px; height: ${length}px; top: ${rect.top}px; left: ${rect.left - 30}px`
        : `width: ${length - 5}px; height: 16px; top: ${rect.top - 16}px; left: ${rect.left}px`;

    const cursor = isRowSelector
        ? `url("${STABLE_RIGHT_ARROW_CURSOR}") 8 8, auto`
        : `url("${STABLE_DOWN_ARROW_CURSOR}") 8 8, auto`;

    const outerDivStyle = `position: fixed; ${size}; background-color: transparent; cursor: ${cursor}; pointer-events: auto; z-index: 1000;`;
    return {
        tag: 'div',
        style: outerDivStyle,
    };
}
