import DragAndDropHelper from '../../../pluginUtils/DragAndDropHelper';
import { createElement, normalizeRect, VTable } from 'roosterjs-editor-dom';
import { highlightAll } from '../utils/highlightAll';
import { KnownCreateElementDataIndex, SizeTransformer } from 'roosterjs-editor-types';
import { TableSelectorFeature } from './TableSelectorFeature';

const TABLE_SELECTOR_LENGTH = 12;
const TABLE_SELECTOR_ID = '_Table_Selector';

/**
 * @internal
 */
export default function createTableSelector(
    table: HTMLTableElement,
    sizeTransformer: SizeTransformer,
    onFinishDragging: (vTable: VTable) => void
): TableSelectorFeature {
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
        sizeTransformer,
    };

    setSelectorDivPosition(context, div);

    const onDragEnd = (context: DragAndDropContext, event: MouseEvent): false => {
        if (event.target == div) {
            const vTable = new VTable(context.table);
            onFinishDragging(vTable);
            highlightAll(vTable);
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
        sizeTransformer
    );

    return { div, featureHandler };
}

interface DragAndDropContext {
    table: HTMLTableElement;
    sizeTransformer: SizeTransformer;
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
