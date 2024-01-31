import createElement from '../../../pluginUtils/CreateElement/createElement';
import DragAndDropHelper from '../../../pluginUtils/DragAndDrop/DragAndDropHelper';
import normalizeRect from '../../../pluginUtils/Rect/normalizeRect';
import type DragAndDropHandler from '../../../pluginUtils/DragAndDrop/DragAndDropHandler';
import type { IStandaloneEditor, Rect } from 'roosterjs-content-model-types';
import type TableEditorFeature from './TableEditorFeature';

const TABLE_MOVER_LENGTH = 12;
const TABLE_MOVER_ID = '_Table_Mover';

/**
 * @internal
 * Contains the function to select whole table
 * Moving behavior not implemented yet
 */
export default function createTableMover(
    table: HTMLTableElement,
    editor: IStandaloneEditor,
    isRTL: boolean,
    onFinishDragging: (table: HTMLTableElement) => void,
    getOnMouseOut: (feature: HTMLElement) => (ev: MouseEvent) => void,
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
        style:
            'background-color: red; position: fixed; cursor: all-scroll; user-select: none; border: 1px solid #808080',
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
        getOnMouseOut
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
    private onMouseOut: ((ev: MouseEvent) => void) | null;

    constructor(
        private div: HTMLElement,
        context: TableMoverContext,
        onSubmit: (
            context: TableMoverContext,
            trigger: HTMLElement,
            container?: HTMLElement
        ) => void,
        handler: DragAndDropHandler<TableMoverContext, TableMoverInitValue>,
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

function setDivPosition(context: TableMoverContext, trigger: HTMLElement) {
    const { rect } = context;
    if (rect) {
        trigger.style.top = `${rect.top - TABLE_MOVER_LENGTH}px`;
        trigger.style.left = `${rect.left - TABLE_MOVER_LENGTH - 2}px`;
    }
}

function isTableTopVisible(
    editor: IStandaloneEditor,
    rect: Rect | null,
    contentDiv?: EventTarget | null
): boolean {
    const visibleViewport = editor.getVisibleViewport();
    if (contentDiv instanceof HTMLElement && visibleViewport && rect) {
        const containerRect = normalizeRect(contentDiv.getBoundingClientRect());

        return !!containerRect && containerRect.top <= rect.top && visibleViewport.top <= rect.top;
    }

    return true;
}
