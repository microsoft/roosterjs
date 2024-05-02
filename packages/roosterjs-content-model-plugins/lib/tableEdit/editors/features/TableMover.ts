import { createElement } from '../../../pluginUtils/CreateElement/createElement';
import { DragAndDropHelper } from '../../../pluginUtils/DragAndDrop/DragAndDropHelper';
import { isNodeOfType, normalizeRect } from 'roosterjs-content-model-dom';
import type { OnTableEditorCreatedCallback } from '../../OnTableEditorCreatedCallback';
import type { DragAndDropHandler } from '../../../pluginUtils/DragAndDrop/DragAndDropHandler';
import type { IEditor, Rect } from 'roosterjs-content-model-types';
import type { TableEditFeature } from './TableEditFeature';

const TABLE_MOVER_LENGTH = 12;
const TABLE_MOVER_ID = '_Table_Mover';

/**
 * @internal
 * Contains the function to select whole table
 * Moving behavior not implemented yet
 */
export function createTableMover(
    table: HTMLTableElement,
    editor: IEditor,
    isRTL: boolean,
    onFinishDragging: (table: HTMLTableElement) => void,
    contentDiv?: EventTarget | null,
    anchorContainer?: HTMLElement,
    onTableEditorCreated?: OnTableEditorCreatedCallback
): TableEditFeature | null {
    const rect = normalizeRect(table.getBoundingClientRect());

    if (!isTableTopVisible(editor, rect, contentDiv as Node)) {
        return null;
    }

    const zoomScale = editor.getDOMHelper().calculateZoomScale();
    const document = table.ownerDocument;
    const createElementData = {
        tag: 'div',
        style: 'position: fixed; cursor: all-scroll; user-select: none; border: 1px solid #808080',
    };

    const div = createElement(createElementData, document) as HTMLDivElement;

    div.id = TABLE_MOVER_ID;
    div.style.width = `${TABLE_MOVER_LENGTH}px`;
    div.style.height = `${TABLE_MOVER_LENGTH}px`;

    (anchorContainer || document.body).appendChild(div);

    const context: TableMoverContext = {
        table,
        zoomScale,
        rect,
        isRTL,
    };

    setDivPosition(context, div);

    const onDragEnd = (context: TableMoverContext, event: MouseEvent): false => {
        if (event.target == div) {
            onFinishDragging(context.table);
        }
        return false;
    };

    const featureHandler = new TableMoverFeature(
        div,
        context,
        setDivPosition,
        {
            onDragEnd,
        },
        context.zoomScale,
        onTableEditorCreated
    );

    return { div, featureHandler, node: table };
}

interface TableMoverContext {
    table: HTMLTableElement;
    zoomScale: number;
    rect: Rect | null;
    isRTL: boolean;
}

interface TableMoverInitValue {
    event: MouseEvent;
}

class TableMoverFeature extends DragAndDropHelper<TableMoverContext, TableMoverInitValue> {
    private disposer: undefined | (() => void);

    constructor(
        div: HTMLElement,
        context: TableMoverContext,
        onSubmit: (
            context: TableMoverContext,
            trigger: HTMLElement,
            container?: HTMLElement
        ) => void,
        handler: DragAndDropHandler<TableMoverContext, TableMoverInitValue>,
        zoomScale: number,
        onTableEditorCreated?: OnTableEditorCreatedCallback
    ) {
        super(div, context, onSubmit, handler, zoomScale);
        this.disposer = onTableEditorCreated?.('TableMover', div);
    }

    dispose(): void {
        this.disposer?.();
        this.disposer = undefined;
        super.dispose();
    }
}

function setDivPosition(context: TableMoverContext, trigger: HTMLElement) {
    const { rect } = context;
    if (rect) {
        trigger.style.top = `${rect.top - TABLE_MOVER_LENGTH}px`;
        trigger.style.left = `${rect.left - TABLE_MOVER_LENGTH - 2}px`;
    }
}

function isTableTopVisible(editor: IEditor, rect: Rect | null, contentDiv?: Node | null): boolean {
    const visibleViewport = editor.getVisibleViewport();
    if (isNodeOfType(contentDiv, 'ELEMENT_NODE') && visibleViewport && rect) {
        const containerRect = normalizeRect(contentDiv.getBoundingClientRect());

        return !!containerRect && containerRect.top <= rect.top && visibleViewport.top <= rect.top;
    }

    return true;
}
