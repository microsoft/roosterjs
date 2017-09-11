// Editor plugin event type
const enum PluginEventType {
    // HTML KeyDown event
    KeyDown,

    // HTML KeyPress event
    KeyPress,

    // HTML KeyUp event
    KeyUp,

    // HTML CompositionEnd event
    CompositionEnd,

    // HTML MouseUp event
    MouseUp,

    // Content changed event
    ContentChanged,

    // HTML MouseOver event
    MouseOver,

    // HTML MouseOut event
    MouseOut,

    // HTML Paste event
    Paste,

    // HTML Copy event
    Copy,

    // Extract Content event
    // This event is triggered when getContent() is called with triggerExtractContentEvent = true
    // Plugin can handle this event to remove the UI only markups to return clean HTML
    ExtractContent,
}

export default PluginEventType;
