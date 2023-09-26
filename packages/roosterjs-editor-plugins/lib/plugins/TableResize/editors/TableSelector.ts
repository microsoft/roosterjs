import DragAndDropHelper from '../../../pluginUtils/DragAndDropHelper';
import type DragAndDropHandler from '../../../pluginUtils/DragAndDropHandler';
import type TableEditorFeature from './TableEditorFeature';
import type { CreateElementData, IEditor, Rect } from 'roosterjs-editor-types';
import {
    createElement,
    normalizeRect,
    safeInstanceOf,
    getComputedStyle,
} from 'roosterjs-editor-dom';

const TABLE_SELECTOR_LENGTH = 12;
const TABLE_SELECTOR_ID = '_Table_Selector';

/**
 * @internal
 */
export default function createTableSelector(
    table: HTMLTableElement,
    editor: IEditor,
    onFinishDragging: (table: HTMLTableElement) => void,
    getOnMouseOut: (feature: HTMLElement) => (ev: MouseEvent) => void,
    onShowHelperElement?: (
        elementData: CreateElementData,
        helperType: 'CellResizer' | 'TableInserter' | 'TableResizer' | 'TableSelector'
    ) => void,
    contentDiv?: EventTarget | null,
    anchorContainer?: HTMLElement
): TableEditorFeature | null {
    const rect = normalizeRect(table.getBoundingClientRect());

    if (!isTableTopVisible(editor, rect, contentDiv)) {
        return null;
    }

    const zoomScale = editor.getZoomScale();
    const document = table.ownerDocument;
    const createElementData = {
        tag: 'div',
        style: 'position: fixed; cursor: all-scroll; user-select: none; border: 1px solid #808080',
    };

    onShowHelperElement?.(createElementData, 'TableSelector');

    const div = createElement(createElementData, document) as HTMLDivElement;

    div.id = TABLE_SELECTOR_ID;
    div.style.width = `${TABLE_SELECTOR_LENGTH}px`;
    div.style.height = `${TABLE_SELECTOR_LENGTH}px`;

    (anchorContainer || document.body).appendChild(div);

    const context: TableSelectorContext = {
        table,
        zoomScale,
        rect,
        isRTL: getComputedStyle(table, 'direction') == 'rtl',
    };

    setDivPosition(context, div);

    const onDragEnd = (context: TableSelectorContext, event: MouseEvent): false => {
        if (event.target == div) {
            onFinishDragging(context.table);
        }
        return false;
    };

    const featureHandler = new TableSelectorFeature(
        div,
        context,
        setDivPosition,
        {
            onDragEnd,
        },
        context.zoomScale,
        getOnMouseOut
    );

    return { div, featureHandler, node: table };
}

interface TableSelectorContext {
    table: HTMLTableElement;
    zoomScale: number;
    rect: Rect | null;
    isRTL: boolean;
}

interface TableSelectorInitValue {
    event: MouseEvent;
}

class TableSelectorFeature extends DragAndDropHelper<TableSelectorContext, TableSelectorInitValue> {
    private onMouseOut: ((ev: MouseEvent) => void) | null;

    constructor(
        private div: HTMLElement,
        context: TableSelectorContext,
        onSubmit: (
            context: TableSelectorContext,
            trigger: HTMLElement,
            container?: HTMLElement
        ) => void,
        handler: DragAndDropHandler<TableSelectorContext, TableSelectorInitValue>,
        zoomScale: number,
        getOnMouseOut: (feature: HTMLElement) => (ev: MouseEvent) => void,
        forceMobile?: boolean | undefined,
        container?: HTMLElement
    ) {
        super(div, context, onSubmit, handler, zoomScale, forceMobile);
        this.onMouseOut = getOnMouseOut(div);
        div.addEventListener('mouseout', this.onMouseOut);
    }

    dispose(): void {
        super.dispose();
        if (this.onMouseOut) {
            this.div.removeEventListener('mouseout', this.onMouseOut);
        }
        this.onMouseOut = null;
    }
}

function setDivPosition(context: TableSelectorContext, trigger: HTMLElement) {
    const { rect } = context;
    if (rect) {
        trigger.style.top = `${rect.top - TABLE_SELECTOR_LENGTH}px`;
        trigger.style.left = `${rect.left - TABLE_SELECTOR_LENGTH - 2}px`;
    }
}

function isTableTopVisible(
    editor: IEditor,
    rect: Rect | null,
    contentDiv?: EventTarget | null
): boolean {
    const visibleViewport = editor.getVisibleViewport();
    if (contentDiv && safeInstanceOf(contentDiv, 'HTMLElement') && visibleViewport && rect) {
        const containerRect = normalizeRect(contentDiv.getBoundingClientRect());

        return !!containerRect && containerRect.top <= rect.top && visibleViewport.top <= rect.top;
    }

    return true;
}
