/**
 * Editor plugin event type
 */
export type ContentModelPluginEventType =
    | 'keyDown'
    | 'keyUp'
    | 'input'
    | 'compositionEnd'
    | 'mouseDown'
    | 'mouseUp'
    | 'contentChanged'
    | 'beforeCutCopy'
    | 'beforePaste'
    | 'editorReady'
    | 'beforeDispose'
    | 'scroll'
    | 'entityOperation'
    | 'contextMenu'
    | 'enteredShadowEdit'
    | 'leavingShadowEdit'
    | 'editImage'
    | 'zoomChanged'
    | 'selectionChanged'
    | 'beforeKeyboardEditing';
