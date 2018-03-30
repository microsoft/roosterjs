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
     * Idle event, fired when user doesn't have any input for a time period (specified in EditorOptions)
     */
    Idle,
}

export default PluginEventType;
