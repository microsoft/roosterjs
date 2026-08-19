import type { Disposable } from '../Disposable';
import type { DragAndDropEvent, DragAndDropHandler } from './DragAndDropHandler';

/**
 * @internal
 */
interface MouseEventMoves {
    MOUSEDOWN: string;
    MOUSEMOVE: string;
    MOUSEUP: string;
}

/**
 * @internal
 */
interface DragEventInfo extends MouseEventMoves {
    normalizeEvent: (event: Event) => DragAndDropEvent;
}

/**
 * Generate event names and getXY function based on different platforms to be compatible with desktop and mobile browsers
 */
const MOUSE_EVENT_INFO_DESKTOP: DragEventInfo = (() => {
    return {
        MOUSEDOWN: 'mousedown',
        MOUSEMOVE: 'mousemove',
        MOUSEUP: 'mouseup',
        normalizeEvent: normalizeMouseEvent,
    };
})();

const MOUSE_EVENT_INFO_MOBILE: DragEventInfo = (() => {
    return {
        MOUSEDOWN: 'touchstart',
        MOUSEMOVE: 'touchmove',
        MOUSEUP: 'touchend',
        normalizeEvent: normalizeTouchEvent,
    };
})();

function normalizeMouseEvent(event: Event): DragAndDropEvent {
    const mouseEvent = event as MouseEvent;

    return {
        clientX: mouseEvent.clientX,
        clientY: mouseEvent.clientY,
        pageX: mouseEvent.pageX,
        pageY: mouseEvent.pageY,
        target: mouseEvent.target,
        shiftKey: mouseEvent.shiftKey,
        altKey: mouseEvent.altKey,
    };
}

function normalizeTouchEvent(event: Event): DragAndDropEvent {
    const touchEvent = event as TouchEvent;
    const touch = touchEvent.targetTouches?.[0] ?? touchEvent.changedTouches?.[0];
    const clientX = touch?.clientX ?? 0;
    const clientY = touch?.clientY ?? 0;
    const document = touchEvent.view?.document ?? (event.target as Node | null)?.ownerDocument;

    return {
        clientX,
        clientY,
        pageX: touch?.pageX ?? 0,
        pageY: touch?.pageY ?? 0,
        target: touch ? document?.elementFromPoint(clientX, clientY) ?? event.target : event.target,
        shiftKey: false,
        altKey: false,
    };
}

/**
 * @internal
 * A helper class to help manage drag and drop to an HTML element
 */
export class DragAndDropHelper<TContext, TInitValue> implements Disposable {
    private initX: number = 0;
    private initY: number = 0;
    private initValue: TInitValue | undefined = undefined;
    private dndMouse: DragEventInfo = MOUSE_EVENT_INFO_DESKTOP;
    private readonly dndMouseList: DragEventInfo[];
    private readonly originalTouchAction: string;

    /**
     * Create a new instance of DragAndDropHelper class
     * @param trigger The trigger element. When user start drag on this element,
     * events will be fired to the handler object
     * @param context Context object that will be passed to handler function when event is fired,
     * so that the handler object knows which element it is triggered from.
     * @param onSubmit A callback that will be invoked when event handler in handler object returns true
     * @param handler The event handler object, see DragAndDropHandler interface for more information
     * @param zoomScale The zoom scale of the editor
     * @param forceMobile A boolean to force the use of touch controls for the helper
     * @param isTouchSupported Whether the current browser supports touch input
     */
    constructor(
        private trigger: HTMLElement,
        private context: TContext,
        private onSubmit: (context: TContext, trigger: HTMLElement) => void,
        private handler: DragAndDropHandler<TContext, TInitValue>,
        private zoomScale: number,
        forceMobile?: boolean,
        isTouchSupported?: boolean
    ) {
        this.dndMouseList = forceMobile
            ? [MOUSE_EVENT_INFO_MOBILE]
            : isTouchSupported
            ? [MOUSE_EVENT_INFO_DESKTOP, MOUSE_EVENT_INFO_MOBILE]
            : [MOUSE_EVENT_INFO_DESKTOP];
        this.dndMouse = this.dndMouseList[0];
        this.originalTouchAction = trigger.style.touchAction;
        if (this.dndMouseList.indexOf(MOUSE_EVENT_INFO_MOBILE) >= 0) {
            trigger.style.touchAction = 'none';
        }
        this.dndMouseList.forEach(eventInfo =>
            trigger.addEventListener(eventInfo.MOUSEDOWN, this.onMouseDown, { passive: false })
        );
    }

    /**
     * Dispose this object, remove all event listeners that has been attached
     */
    dispose() {
        this.dndMouseList.forEach(eventInfo =>
            this.trigger.removeEventListener(eventInfo.MOUSEDOWN, this.onMouseDown)
        );
        this.trigger.style.touchAction = this.originalTouchAction;
        this.removeDocumentEvents();
    }

    public get mouseType(): string {
        return this.dndMouse == MOUSE_EVENT_INFO_MOBILE ? 'touch' : 'mouse';
    }

    private addDocumentEvents() {
        const doc = this.trigger.ownerDocument;
        doc.addEventListener(this.dndMouse.MOUSEMOVE, this.onMouseMove, {
            capture: true,
            passive: false,
        });
        doc.addEventListener(this.dndMouse.MOUSEUP, this.onMouseUp, {
            capture: true,
            passive: false,
        });
    }

    private removeDocumentEvents() {
        const doc = this.trigger.ownerDocument;
        doc.removeEventListener(this.dndMouse.MOUSEMOVE, this.onMouseMove, true /*useCapture*/);
        doc.removeEventListener(this.dndMouse.MOUSEUP, this.onMouseUp, true /*useCapture*/);
    }

    private onMouseDown = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        this.dndMouse =
            e.type == MOUSE_EVENT_INFO_MOBILE.MOUSEDOWN
                ? MOUSE_EVENT_INFO_MOBILE
                : MOUSE_EVENT_INFO_DESKTOP;
        this.addDocumentEvents();
        const event = this.dndMouse.normalizeEvent(e);
        [this.initX, this.initY] = [event.pageX, event.pageY];
        this.initValue = this.handler.onDragStart?.(this.context, event);
    };

    private onMouseMove = (e: Event) => {
        e.preventDefault();
        const event = this.dndMouse.normalizeEvent(e);
        const deltaX = (event.pageX - this.initX) / this.zoomScale;
        const deltaY = (event.pageY - this.initY) / this.zoomScale;
        if (
            this.initValue &&
            this.handler.onDragging?.(this.context, event, this.initValue, deltaX, deltaY)
        ) {
            this.onSubmit?.(this.context, this.trigger);
        }
    };

    private onMouseUp = (e: Event) => {
        e.preventDefault();
        this.removeDocumentEvents();
        if (
            this.handler.onDragEnd?.(this.context, this.dndMouse.normalizeEvent(e), this.initValue)
        ) {
            this.onSubmit?.(this.context, this.trigger);
        }
    };
}
