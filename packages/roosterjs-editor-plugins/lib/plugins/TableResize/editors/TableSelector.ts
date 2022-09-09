import DragAndDropHelper from '../../../pluginUtils/DragAndDropHelper';
import TableEditorFeature from './TableEditorFeature';
import { createElement, normalizeRect } from 'roosterjs-editor-dom';
import { CreateElementData, Rect } from 'roosterjs-editor-types';
import type { HelperType } from './HelperType';

const TABLE_SELECTOR_LENGTH = 12;
const TABLE_SELECTOR_ID = '_Table_Selector';

/**
 * @internal
 */
export default function createTableSelector(
    table: HTMLTableElement,
    zoomScale: number,
    onFinishDragging: (table: HTMLTableElement) => void,
    onShowHelperElement?: (
        elementData: CreateElementData,
        helperType: HelperType,
        table?: HTMLTableElement
    ) => void,
    shouldShow?: (rect: Rect) => boolean
): TableEditorFeature {
    const rect = normalizeRect(table.getBoundingClientRect());
    if (rect && shouldShow && !shouldShow(rect)) {
        return { div: null, featureHandler: null, node: table };
    }

    const document = table.ownerDocument;
    const createElementData = {
        tag: 'div',
        style: 'position: fixed; cursor: all-scroll; user-select: none; border: 1px solid #808080',
    };

    onShowHelperElement?.(createElementData, 'TableSelector', table);

    const div = createElement(createElementData, document) as HTMLDivElement;

    div.id = TABLE_SELECTOR_ID;
    div.style.width = `${TABLE_SELECTOR_LENGTH}px`;
    div.style.height = `${TABLE_SELECTOR_LENGTH}px`;
    document.body.appendChild(div);

    const context: DragAndDropContext = {
        table,
        zoomScale,
        rect,
    };

    setSelectorDivPosition(context, div);

    const onDragEnd = (context: DragAndDropContext, event: MouseEvent): false => {
        if (event.target == div) {
            onFinishDragging(context.table);
        }
        return false;
    };

    const featureHandler = new DragAndDropHelper<DragAndDropContext, DragAndDropInitValue>(
        div,
        context,
        setSelectorDivPosition,
        {
            onDragEnd,
        },
        zoomScale
    );

    return { div, featureHandler, node: table };
}

interface DragAndDropContext {
    table: HTMLTableElement;
    zoomScale: number;
    rect: Rect | null;
}

interface DragAndDropInitValue {
    event: MouseEvent;
}

function setSelectorDivPosition(context: DragAndDropContext, trigger: HTMLElement) {
    const { rect } = context;
    if (rect) {
        trigger.style.top = `${rect.top - TABLE_SELECTOR_LENGTH}px`;
        trigger.style.left = `${rect.left - TABLE_SELECTOR_LENGTH - 2}px`;
    }
}
