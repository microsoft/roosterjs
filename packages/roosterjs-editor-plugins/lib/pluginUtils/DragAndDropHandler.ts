/**
 * @internal
 * Drag and drop handler interface, used for implementing a handler object and pass into DragAndDropHelper class
 */
export default interface DragAndDropHandler<TContext, TInitValue> {
    /**
     * A callback that will be called when user starts to drag (mouse down event from the trigger element)
     * @param context The context object that was passed into DragAndDropHelper from its constructor. We can use
     * this object to communicate between caller code and this handler
     * @param event The mouse event that triggers this callback
     * @returns An optional object, which will be passed into onDragging and onDragEnd callback. It normally used
     * for passing an initial state of the target object
     */
    onDragStart?: (context: TContext, event: MouseEvent) => TInitValue;

    /**
     * A callback that will be called when user moves mouse and drag the trigger element.
     * @param context The context object that was passed into DragAndDropHelper from its constructor. We can use
     * this object to communicate between caller code and this handler.If an object is used as context, here it will
     * be the same object that passed into constructor of DragAndDropHelper class. Inside this callback you can change
     * its sub value so that caller can get the changed result.
     * @param event The mouse event that triggers this callback
     * @param initValue The initial value that is returned from onDragStart callback. It normally used
     * for passing an initial state of the target object
     * @param deltaX x delta value. It equals to current event.pageX - initial pageX (captured when mousedown happens)
     * @param deltaY y delta value. It equals to current event.pageY - initial pageY (captured when mousedown happens)
     * @returns Whether the onSubmit callback passed into constructor of DragAndDropHelper class should be invoked.
     * Returns true will invoke the onSubmit callback, it means this is a meaningful dragging action, something (mostly
     * under context object) has been changed, and caller should handle this change. Otherwise, return false.
     */
    onDragging?: (
        context: TContext,
        event: MouseEvent,
        initValue: TInitValue,
        deltaX: number,
        deltaY: number
    ) => boolean;

    /**
     * A callback that will be called when user stops dragging the trigger element.
     * @param context The context object that was passed into DragAndDropHelper from its constructor. We can use
     * this object to communicate between caller code and this handler.If an object is used as context, here it will
     * be the same object that passed into constructor of DragAndDropHelper class. Inside this callback you can change
     * its sub value so that caller can get the changed result.
     * @param event The mouse event that triggers this callback
     * @param initValue The initial value that is returned from onDragStart callback. It normally used
     * for passing an initial state of the target object
     * @returns Whether the onSubmit callback passed into constructor of DragAndDropHelper class should be invoked.
     * Returns true will invoke the onSubmit callback, it means this is a meaningful dragging action, something (mostly
     * under context object) has been changed, and caller should handle this change. Otherwise, return false.
     */
    onDragEnd?: (
        context: TContext,
        event: MouseEvent,
        initValue: TInitValue | undefined
    ) => boolean;
}
