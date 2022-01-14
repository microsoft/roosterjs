import DragAndDropHandler from './DragAndDropHandler';

function defaultTransformer(deltaX: number, deltaY: number) {
    return {
        deltaX,
        deltaY,
    };
}
/**
 * @internal
 * A helper class to help manage drag and drop to an HTML element
 */
export default class DragAndDropHelper<TContext, TInitValue> {
    private initX: number;
    private initY: number;
    private initValue: TInitValue;

    /**
     * Create a new instance of DragAndDropHelper class
     * @param trigger The trigger element. When user start drag on this element,
     * events will be fired to the handler object
     * @param context Context object that will be passed to handler function when event is fired,
     * so that the handler object knows which element it is triggered from.
     * @param onSubmit A callback that will be invoked when event handler in handler object returns true
     * @param handler The event handler object, see DragAndDropHandler interface for more information
     */
    constructor(
        private trigger: HTMLElement,
        private context: TContext,
        private onSubmit: (context: TContext) => void,
        private handler: DragAndDropHandler<TContext, TInitValue>,
        private sizeTransformer?: (
            deltaX: number,
            deltaY: number
        ) => { deltaX: number; deltaY: number }
    ) {
        trigger.addEventListener('mousedown', this.onMouseDown);
    }

    /**
     * Dispose this object, remove all event listeners that has been attached
     */
    dispose() {
        this.trigger.removeEventListener('mousedown', this.onMouseDown);
        this.removeDocumentEvents();
    }

    private addDocumentEvents() {
        const doc = this.trigger.ownerDocument;
        doc.addEventListener('mousemove', this.onMouseMove, true /*useCapture*/);
        doc.addEventListener('mouseup', this.onMouseUp, true /*useCapture*/);
    }

    private removeDocumentEvents() {
        const doc = this.trigger.ownerDocument;
        doc.removeEventListener('mousemove', this.onMouseMove, true /*useCapture*/);
        doc.removeEventListener('mouseup', this.onMouseUp, true /*useCapture*/);
    }

    private onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this.addDocumentEvents();

        this.initX = e.pageX;
        this.initY = e.pageY;
        this.initValue = this.handler.onDragStart?.(this.context, e);
    };

    private onMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        const initDeltaX = e.pageX - this.initX;
        const initDeltaY = e.pageY - this.initY;
        const { deltaX, deltaY } = (this.sizeTransformer || defaultTransformer)(
            initDeltaX,
            initDeltaY
        );
        if (this.handler.onDragging?.(this.context, e, this.initValue, deltaX, deltaY)) {
            this.onSubmit?.(this.context);
        }
    };

    private onMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        this.removeDocumentEvents();

        if (this.handler.onDragEnd?.(this.context, e, this.initValue)) {
            this.onSubmit?.(this.context);
        }
    };
}
