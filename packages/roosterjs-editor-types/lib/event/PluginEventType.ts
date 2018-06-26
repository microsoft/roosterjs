/**
 * Editor plugin event type
 */
const enum PluginEventType {
    /**
     * HTML KeyDown event
     */
    KeyDown,

    /**
     * HTML KeyPress event
     */
    KeyPress,

    /**
     * HTML KeyUp event
     */
    KeyUp,

    /**
     * HTML CompositionEnd event
     */
    CompositionEnd,

    /**
     * HTML MouseDown event
     */
    MouseDown,

    /**
     * HTML MouseUp event
     */
    MouseUp,

    /**
     * Content changed event
     */
    ContentChanged,

    /**
     * Extract Content event
     * This event is triggered when getContent() is called with triggerExtractContentEvent = true
     * Plugin can handle this event to remove the UI only markups to return clean HTML
     */
    ExtractContent,

    /**
     * Before Paste event, provide a chance to change paste content
     */
    BeforePaste,

    /**
     * @deprecated
     */
    Idle,

    /**
     * Let plugin know editor is ready now
     */
    EditorReady,

    /**
     * Let plugin know editor is about to dispose
     */
    BeforeDispose,
}

export default PluginEventType;
