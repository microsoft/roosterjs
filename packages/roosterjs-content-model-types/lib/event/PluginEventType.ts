/**
 * Type of plugin events
 */
export type PluginEventType =
    /**
     * HTML KeyDown event
     */
    | 'keyDown'

    /**
     * HTML KeyPress event
     */
    | 'keyPress'

    /**
     * HTML KeyUp event
     */
    | 'keyUp'

    /**
     * HTML Input / TextInput event
     */
    | 'input'

    /**
     * HTML CompositionEnd event
     */
    | 'compositionEnd'

    /**
     * HTML MouseDown event
     */
    | 'mouseDown'

    /**
     * HTML MouseUp event
     */
    | 'mouseUp'

    /**
     * Content changed event
     */
    | 'contentChanged'

    /**
     * Extract Content with a DOM tree event
     * This event is triggered when getContent() is called with triggerExtractContentEvent = true
     * Plugin can handle this event to remove the UI only markups to return clean HTML
     * by operating on a cloned DOM tree
     */
    | 'extractContentWithDom'

    /**
     * Before Paste event, provide a chance to change copied content
     */
    | 'beforeCutCopy'

    /**
     * Before Paste event, provide a chance to change paste content
     */
    | 'beforePaste'

    /**
     * Let plugin know editor is ready now
     */
    | 'editorReady'

    /**
     * Let plugin know editor is about to dispose
     */
    | 'beforeDispose'

    /**
     * Scroll event triggered by scroll container
     */
    | 'scroll'

    /**
     * Operating on an entity. See enum EntityOperation for more details about each operation
     */
    | 'entityOperation'

    /**
     * HTML ContextMenu event
     */
    | 'contextMenu'

    /**
     * Editor has entered shadow edit mode
     */
    | 'enteredShadowEdit'

    /**
     * Editor is about to leave shadow edit mode
     */
    | 'leavingShadowEdit'

    /**
     * Content of image is being changed from client side
     */
    | 'editImage'

    /**
     * Content of editor is about to be cleared by SetContent API, handle this event to cache anything you need
     * before it is gone
     */
    | 'beforeSetContent'

    /**
     * Zoom scale value is changed, triggered by Editor.setZoomScale() when set a different scale number
     */
    | 'zoomChanged'

    /**
     * Rewrite result information from Content Model
     */
    | 'rewriteFromModel'

    /**
     * EXPERIMENTAL FEATURE
     * Editor changed the selection.
     */
    | 'selectionChanged'

    /**
     * EXPERIMENTAL FEATURE
     * The logical root changed
     */
    | 'logicalRootChanged'

    /**
     * EXPERIMENTAL FEATURE
     * Editor content is about to be changed by keyboard event.
     * This is only used by Content Model editing
     */
    | 'beforeKeyboardEditing'

    /**
     * The logical root is about to change
     * This event is used to clean up any features from the old logical root
     * before the new logical root is set.
     */
    | 'beforeLogicalRootChange'

    /**
     * Before an undo snapshot is added to the undo stack.
     * This event is used to give plugins a chance to add additional state to the snapshot.
     */
    | 'beforeAddUndoSnapshot';
