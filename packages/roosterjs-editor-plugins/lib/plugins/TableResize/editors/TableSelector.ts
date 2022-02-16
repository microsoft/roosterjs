import DragAndDropHelper from '../../../pluginUtils/DragAndDropHelper';
import TableEditorFeature from './TableEditorFeature';
import { createElement, normalizeRect } from 'roosterjs-editor-dom';
import { KnownCreateElementDataIndex } from 'roosterjs-editor-types';

const TABLE_SELECTOR_LENGTH = 12;
const TABLE_SELECTOR_ID = '_Table_Selector';

/**
 * @internal
 */
export default function createTableSelector(
    table: HTMLTableElement,
    zoomScale: number,
    onFinishDragging: (table: HTMLTableElement) => void
): TableEditorFeature {
    const document = table.ownerDocument;
    const div = createElement(
        KnownCreateElementDataIndex.TableSelector,
        document
    ) as HTMLDivElement;

    div.id = TABLE_SELECTOR_ID;
    div.style.width = `${TABLE_SELECTOR_LENGTH}px`;
    div.style.height = `${TABLE_SELECTOR_LENGTH}px`;
    document.body.appendChild(div);

    const context: DragAndDropContext = {
        table,
        zoomScale,
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
}

interface DragAndDropInitValue {
    event: MouseEvent;
}

function setSelectorDivPosition(context: DragAndDropContext, trigger: HTMLElement) {
    const { table } = context;
    const rect = normalizeRect(table.getBoundingClientRect());

    if (rect) {
        trigger.style.top = `${rect.top - TABLE_SELECTOR_LENGTH}px`;
        trigger.style.left = `${rect.left - TABLE_SELECTOR_LENGTH - 2}px`;
    }
}
