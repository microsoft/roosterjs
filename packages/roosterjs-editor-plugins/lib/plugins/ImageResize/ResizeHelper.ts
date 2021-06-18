/**
 * @internal
 */
export type ResizeCallback<TContext> = (
    context: TContext,
    deltaX: number,
    deltaY: number,
    event: MouseEvent
) => void;

/**
 * @internal
 */
export default class ResizeHelper<TContext> {
    private initX: number;
    private initY: number;

    constructor(
        private trigger: HTMLElement,
        private context: TContext,
        private onResizeBegin: ResizeCallback<TContext>,
        private onResize: ResizeCallback<TContext>,
        private onResizeEnd: ResizeCallback<TContext>
    ) {
        trigger.addEventListener('mousedown', this.onMouseDown);
    }

    dispose() {
        this.trigger.removeEventListener('mousedown', this.onMouseDown);
    }

    getContext(): TContext {
        return this.context;
    }

    private onMouseDown = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const doc = this.trigger.ownerDocument;
        doc.addEventListener('mousemove', this.onMouseMove, true /*useCapture*/);
        doc.addEventListener('mouseup', this.onMouseUp, true /*useCapture*/);

        this.initX = e.pageX;
        this.initY = e.pageY;
        this.onResizeBegin?.(this.context, 0, 0, e);
    };

    private onMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        this.onResize?.(this.context, e.pageX - this.initX, e.pageY - this.initY, e);
    };

    private onMouseUp = (e: MouseEvent) => {
        e.preventDefault();

        const doc = this.trigger.ownerDocument;
        doc.removeEventListener('mousemove', this.onMouseMove, true /*useCapture*/);
        doc.removeEventListener('mouseup', this.onMouseUp, true /*useCapture*/);

        this.onResizeEnd?.(this.context, e.pageX - this.initX, e.pageY - this.initY, e);
    };
}
