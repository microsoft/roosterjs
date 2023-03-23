import Disposable from './Disposable';
import DragAndDropHandler from './DragAndDropHandler';
import { Browser } from 'roosterjs-editor-dom';

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
interface MouseEventInfo extends MouseEventMoves {
    getPageXY: (e: MouseEvent) => number[];
}

/**
 * @internal
 * Compatible mouse event names for different platform
 */
interface TouchEventInfo extends MouseEventMoves {
    getPageXY: (e: TouchEvent) => number[];
}

/**
 * Generate event names and getXY function based on different platforms to be compatible with desktop and mobile browsers
 */
const MOUSE_EVENT_INFO_DESKTOP: MouseEventInfo = (() => {
    return {
        MOUSEDOWN: 'mousedown',
        MOUSEMOVE: 'mousemove',
        MOUSEUP: 'mouseup',
        getPageXY: getMouseEventPageXY,
    };
})();

const MOUSE_EVENT_INFO_MOBILE: TouchEventInfo = (() => {
    return {
        MOUSEDOWN: 'touchstart',
        MOUSEMOVE: 'touchmove',
        MOUSEUP: 'touchend',
        getPageXY: getTouchEventPageXY,
    };
})();

function getMouseEventPageXY(e: MouseEvent): [number, number] {
    return [e.pageX, e.pageY];
}

function getTouchEventPageXY(e: TouchEvent): [number, number] {
    let pageX = 0;
    let pageY = 0;
    if (e.targetTouches && e.targetTouches.length > 0) {
        const touch = e.targetTouches[0];
        pageX = touch.pageX;
        pageY = touch.pageY;
    }
    return [pageX, pageY];
}

/**
 * @internal
 * A helper class to help manage drag and drop to an HTML element
 */
export default class DragAndDropHelper<TContext, TInitValue> implements Disposable {
    private initX: number = 0;
    private initY: number = 0;
    private initValue: TInitValue | undefined = undefined;
    private dndMouse: MouseEventInfo | TouchEventInfo;

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
     */
    constructor(
        private trigger: HTMLElement,
        private context: TContext,
        private onSubmit: (context: TContext, trigger: HTMLElement) => void,
        private handler: DragAndDropHandler<TContext, TInitValue>,
        private zoomScale: number,
        forceMobile?: boolean
    ) {
        this.dndMouse =
            forceMobile || Browser.isMobileOrTablet
                ? MOUSE_EVENT_INFO_MOBILE
                : MOUSE_EVENT_INFO_DESKTOP;
        trigger.addEventListener(this.dndMouse.MOUSEDOWN, this.onMouseDown);
    }

    /**
     * Dispose this object, remove all event listeners that has been attached
     */
    dispose() {
        this.trigger.removeEventListener(this.dndMouse.MOUSEDOWN, this.onMouseDown);
        this.removeDocumentEvents();
    }

    public get mouseType(): string {
        return this.dndMouse == MOUSE_EVENT_INFO_MOBILE ? 'touch' : 'mouse';
    }

    private addDocumentEvents() {
        const doc = this.trigger.ownerDocument;
        doc.addEventListener(this.dndMouse.MOUSEMOVE, this.onMouseMove, true /*useCapture*/);
        doc.addEventListener(this.dndMouse.MOUSEUP, this.onMouseUp, true /*useCapture*/);
    }

    private removeDocumentEvents() {
        const doc = this.trigger.ownerDocument;
        doc.removeEventListener(this.dndMouse.MOUSEMOVE, this.onMouseMove, true /*useCapture*/);
        doc.removeEventListener(this.dndMouse.MOUSEUP, this.onMouseUp, true /*useCapture*/);
    }

    private onMouseDown = (e: Event) => {
        e.preventDefault();
        e.stopPropagation();
        this.addDocumentEvents();
        [this.initX, this.initY] = this.dndMouse.getPageXY(e as MouseEvent & TouchEvent);
        this.initValue = this.handler.onDragStart?.(this.context, e as MouseEvent);
    };

    private onMouseMove = (e: Event) => {
        e.preventDefault();
        const [pageX, pageY] = this.dndMouse.getPageXY(e as MouseEvent & TouchEvent);
        const deltaX = (pageX - this.initX) / this.zoomScale;
        const deltaY = (pageY - this.initY) / this.zoomScale;
        if (
            this.initValue &&
            this.handler.onDragging?.(this.context, e as MouseEvent, this.initValue, deltaX, deltaY)
        ) {
            this.onSubmit?.(this.context, this.trigger);
        }
    };

    private onMouseUp = (e: Event) => {
        e.preventDefault();
        this.removeDocumentEvents();
        if (this.handler.onDragEnd?.(this.context, e as MouseEvent, this.initValue)) {
            this.onSubmit?.(this.context, this.trigger);
        }
    };
}
