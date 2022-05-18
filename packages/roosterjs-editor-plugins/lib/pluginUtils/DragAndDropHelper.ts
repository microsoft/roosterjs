import Disposable from './Disposable';
import DragAndDropHandler from './DragAndDropHandler';

interface MouseEventNames {
    mousedown: string;
    mousemove: string;
    mouseup: string;
}

/**
 * @internal
 * A helper class to help manage drag and drop to an HTML element
 */
export default class DragAndDropHelper<TContext, TInitValue> implements Disposable {
    private initX: number;
    private initY: number;
    private initValue: TInitValue;
    private eventNames: MouseEventNames; // Used to be compatible with desktop and mobile browsers

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
        private onSubmit: (context: TContext, trigger: HTMLElement) => void,
        private handler: DragAndDropHandler<TContext, TInitValue>,
        private zoomScale: number,
        isMobile: boolean = false
    ) {
        this.eventNames = DragAndDropHelper.getMouseEventNames(isMobile);
        trigger.addEventListener(this.eventNames.mousedown, this.onMouseDown);
    }

    /**
     * Generate event names based on different platforms
     */
    static getMouseEventNames(isMobile: boolean): MouseEventNames {
        if (isMobile) {
            return {
                mousedown: 'touchstart',
                mousemove: 'touchmove',
                mouseup: 'touchmove',
            }
        } else {
            return {
                mousedown: 'mousedown',
                mousemove: 'mousemove',
                mouseup: 'mouseup',
            }
        }
    }

    /**
     * Dispose this object, remove all event listeners that has been attached
     */
    dispose() {
        this.trigger.removeEventListener(this.eventNames.mousedown, this.onMouseDown);
        this.removeDocumentEvents();
    }

    private addDocumentEvents() {
        const doc = this.trigger.ownerDocument;
        doc.addEventListener(this.eventNames.mousemove, this.onMouseMove, true /*useCapture*/);
        doc.addEventListener(this.eventNames.mouseup, this.onMouseUp, true /*useCapture*/);
    }

    private removeDocumentEvents() {
        const doc = this.trigger.ownerDocument;
        doc.removeEventListener(this.eventNames.mousemove, this.onMouseMove, true /*useCapture*/);
        doc.removeEventListener(this.eventNames.mouseup, this.onMouseUp, true /*useCapture*/);
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
        const deltaX = (e.pageX - this.initX) / this.zoomScale;
        const deltaY = (e.pageY - this.initY) / this.zoomScale;
        if (this.handler.onDragging?.(this.context, e, this.initValue, deltaX, deltaY)) {
            this.onSubmit?.(this.context, this.trigger);
        }
    };

    private onMouseUp = (e: MouseEvent) => {
        e.preventDefault();
        this.removeDocumentEvents();

        if (this.handler.onDragEnd?.(this.context, e, this.initValue)) {
            this.onSubmit?.(this.context, this.trigger);
        }
    };
}
