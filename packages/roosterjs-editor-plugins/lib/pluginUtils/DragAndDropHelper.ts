import { Browser } from 'roosterjs-editor-dom/lib';
import Disposable from './Disposable';
import DragAndDropHandler from './DragAndDropHandler';

/**
 * @internal
 * Compatible mouse event names for different platform
 */
interface MouseEventNames {
    MOUSEDOWN: string;
    MOUSEMOVE: string;
    MOUSEUP: string;
}

/**
 * Generate event names based on different platforms to be compatible with desktop and mobile browsers
 */
const MOUSE_EVENT_NAMES: MouseEventNames = (() => {
    if (Browser.isMobileOrTablet) {
        return {
            MOUSEDOWN: 'touchstart',
            MOUSEMOVE: 'touchmove',
            MOUSEUP: 'touchend',
        }
    } else {
        return {
            MOUSEDOWN: 'mousedown',
            MOUSEMOVE: 'mousemove',
            MOUSEUP: 'mouseup',
        }
    }
})()


/**
 * @internal
 * A helper class to help manage drag and drop to an HTML element
 */
export default class DragAndDropHelper<TContext, TInitValue> implements Disposable {
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
        private onSubmit: (context: TContext, trigger: HTMLElement) => void,
        private handler: DragAndDropHandler<TContext, TInitValue>,
        private zoomScale: number
    ) {
        trigger.addEventListener(MOUSE_EVENT_NAMES.MOUSEDOWN, this.onMouseDown);
    }

    /**
     * Dispose this object, remove all event listeners that has been attached
     */
    dispose() {
        this.trigger.removeEventListener(MOUSE_EVENT_NAMES.MOUSEDOWN, this.onMouseDown);
        this.removeDocumentEvents();
    }

    private addDocumentEvents() {
        const doc = this.trigger.ownerDocument;
        doc.addEventListener(MOUSE_EVENT_NAMES.MOUSEMOVE, this.onMouseMove, true /*useCapture*/);
        doc.addEventListener(MOUSE_EVENT_NAMES.MOUSEUP, this.onMouseUp, true /*useCapture*/);
    }

    private removeDocumentEvents() {
        const doc = this.trigger.ownerDocument;
        doc.removeEventListener(MOUSE_EVENT_NAMES.MOUSEMOVE, this.onMouseMove, true /*useCapture*/);
        doc.removeEventListener(MOUSE_EVENT_NAMES.MOUSEUP, this.onMouseUp, true /*useCapture*/);
    }

    private getPageX(e: MouseEvent): number {
        let pageX = e.pageX;
        if (!pageX) {
            const touchEvent = e as unknown as TouchEvent;
            const touch = touchEvent.targetTouches[0];
            pageX = touch.pageX;
        }
        return pageX;
    }

    private getPageY(e: MouseEvent): number {
        let pageY = e.pageY;
        if (!pageY) {
            const touchEvent = e as unknown as TouchEvent;
            const touch = touchEvent.targetTouches[0];
            pageY = touch.pageX;
        }
        return pageY;
    }

    private onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        this.addDocumentEvents();

        this.initX = this.getPageX(e);
        this.initY = this.getPageY(e);
        this.initValue = this.handler.onDragStart?.(this.context, e);
    };

    private onMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        const deltaX = (this.getPageX(e) - this.initX) / this.zoomScale;
        const deltaY = (this.getPageY(e) - this.initY) / this.zoomScale;
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
