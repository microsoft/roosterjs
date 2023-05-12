/**
 * Editor plugin event type
 */
export const enum PluginEventType {
    /**
     * HTML KeyDown event
     */
    KeyDown = 0,

    /**
     * HTML KeyPress event
     */
    KeyPress = 1,

    /**
     * HTML KeyUp event
     */
    KeyUp = 2,

    /**
     * HTML Input / TextInput event
     */
    Input = 3,

    /**
     * HTML CompositionEnd event
     */
    CompositionEnd = 4,

    /**
     * HTML MouseDown event
     */
    MouseDown = 5,

    /**
     * HTML MouseUp event
     */
    MouseUp = 6,

    /**
     * Content changed event
     */
    ContentChanged = 7,

    /**
     * Extract Content with a DOM tree event
     * This event is triggered when getContent() is called with triggerExtractContentEvent = true
     * Plugin can handle this event to remove the UI only markups to return clean HTML
     * by operating on a cloned DOM tree
     */
    ExtractContentWithDom = 8,

    /**
     * Before Paste event, provide a chance to change copied content
     */
    BeforeCutCopy = 9,

    /**
     * Before Paste event, provide a chance to change paste content
     */
    BeforePaste = 10,

    /**
     * Let plugin know editor is ready now
     */
    EditorReady = 11,

    /**
     * Let plugin know editor is about to dispose
     */
    BeforeDispose = 12,

    /**
     * Pending format state (bold, italic, underline, ... with collapsed selection) is changed
     */
    PendingFormatStateChanged = 13,

    /**
     * Scroll event triggered by scroll container
     */
    Scroll = 14,

    /**
     * Operating on an entity. See enum EntityOperation for more details about each operation
     */
    EntityOperation = 15,

    /**
     * HTML ContextMenu event
     */
    ContextMenu = 16,

    /**
     * Editor has entered shadow edit mode
     */
    EnteredShadowEdit = 17,

    /**
     * Editor is about to leave shadow edit mode
     */
    LeavingShadowEdit = 18,

    /**
     * Content of image is being changed from client side
     */
    EditImage = 19,

    /**
     * Content of editor is about to be cleared by SetContent API, handle this event to cache anything you need
     * before it is gone
     */
    BeforeSetContent = 20,

    /**
     * Zoom scale value is changed, triggered by Editor.setZoomScale() when set a different scale number
     */
    ZoomChanged = 21,

    /**
     * EXPERIMENTAL FEATURE
     * Editor changed the selection.
     */
    SelectionChanged = 22,

    /**
     * EXPERIMENTAL FEATURE
     * Editor content is about to be changed by keyboard event.
     * This is only used by Content Model editing
     */
    BeforeKeyboardEditing = 23,
}
