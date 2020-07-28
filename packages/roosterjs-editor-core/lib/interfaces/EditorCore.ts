import EditorPlugin from './EditorPlugin';
import { CustomDataMap } from './CustomData';
import { PluginKey, PluginState } from './CorePlugins';
import {
    ChangeSource,
    ClipboardData,
    DefaultFormat,
    DarkModeOptions,
    InsertOption,
    NodePosition,
    PluginEvent,
    PluginEventType,
    StyleBasedFormatState,
} from 'roosterjs-editor-types';

/**
 * Represents the core data structure of an editor
 */
export default interface EditorCore extends PluginState<PluginKey> {
    /**
     * HTML Document object of this editor
     */
    readonly document: Document;

    /**
     * The content DIV element of this editor
     */
    readonly contentDiv: HTMLDivElement;

    /**
     * The scroll container of editor, it can be the same with contentDiv,
     * or some level of its scrollable parent.
     */
    readonly scrollContainer: HTMLElement;

    /**
     * An array of editor plugins.
     */
    readonly plugins: EditorPlugin[];

    /**
     * Default format of this editor
     */
    defaultFormat: DefaultFormat;

    /**
     * Custom data of this editor
     */
    readonly customData: CustomDataMap;

    /**
     * Core API map of this editor
     */
    readonly api: CoreApiMap;

    /**
     * The undo snapshot taken by addUndoSnapshot() before callback function is invoked.
     */
    currentUndoSnapshot: string;

    /**
     * Cached selection range of this editor
     */
    cachedSelectionRange: Range;

    /**
     * If the editor is in dark mode.
     */
    inDarkMode: boolean;

    /***
     * The dark mode options, if set.
     */
    darkModeOptions?: DarkModeOptions;
}

/**
 * Attach a DOM event to the editor content DIV
 * @param core The EditorCore object
 * @param eventName The DOM event name
 * @param pluginEventType Optional event type. When specified, editor will trigger a plugin event with this name when the DOM event is triggered
 * @param beforeDispatch Optional callback function to be invoked when the DOM event is triggered before trigger plugin event
 */
export type AttachDomEvent = (
    core: EditorCore,
    eventName: string,
    pluginEventType?: PluginEventType,
    beforeDispatch?: (event: UIEvent) => void
) => () => void;

/**
 * Create a DocumentFragment for paste from a ClipboardData
 * @param core The EditorCore object.
 * @param clipboardData Clipboard data retrieved from clipboard
 * @param position The position to paste to
 * @param pasteAsText True to force use plain text as the content to paste, false to choose HTML or Image if any
 * @param applyCurrentStyle True if apply format of current selection to the pasted content,
 * false to keep original foramt
 */
export type CreatePasteFragment = (
    core: EditorCore,
    clipboardData: ClipboardData,
    position: NodePosition,
    pasteAsText: boolean,
    applyCurrentStyle: boolean
) => DocumentFragment;

/**
 * Call an editing callback with adding undo snapshots around, and trigger a ContentChanged event if change source is specified.
 * Undo snapshot will not be added if this call is nested inside another editWithUndo() call.
 * @param core The EditorCore object
 * @param callback The editing callback, accepting current selection start and end position, returns an optional object used as the data field of ContentChangedEvent.
 * @param changeSource The ChangeSource string of ContentChangedEvent. @default ChangeSource.Format. Set to null to avoid triggering ContentChangedEvent
 * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complelte).
 */
export type EditWithUndo = (
    core: EditorCore,
    callback: (start: NodePosition, end: NodePosition, snapshotBeforeCallback: string) => any,
    changeSource: ChangeSource | string,
    canUndoByBacksapce: boolean
) => void;

/**
 * Focus to editor. If there is a cached selection range, use it as current selection
 * @param core The EditorCore object
 */
export type Focus = (core: EditorCore) => void;

/**
 * Get current editor content as HTML string
 * @param core The EditorCore object
 * @param triggerExtractContentEvent Whether trigger ExtractContentWithDom event to all plugins
 * before return. Use this parameter to remove any temporary content added by plugins.
 * @param includeSelectionMarker Set to true if need include selection marker inside the content.
 * When restore this content, editor will set the selection to the position marked by these markers.
 * This parameter will be ignored when triggerExtractContentEvent is set to true
 * @returns HTML string representing current editor content
 */
export type GetContent = (
    core: EditorCore,
    triggerExtractContentEvent: boolean,
    includeSelectionMarker: boolean
) => string;

/**
 * Get custom data related with this editor
 * @param core The EditorCore object
 * @param key Key of the custom data
 * @param getter Getter function. If custom data for the given key doesn't exist,
 * call this function to get one and store it if it is specified. Otherwise return undefined
 * @param disposer An optional disposer function to dispose this custom data when
 * dispose editor.
 */
export type GetCustomData = <T>(
    core: EditorCore,
    key: string,
    getter: () => T,
    disposer?: (value: T) => void
) => T;

/**
 * Get style based format state from current selection, including font name/size and colors
 * @param core The EditorCore objects
 * @param node The node to get style from
 */
export type GetStyleBasedFormatState = (core: EditorCore, node: Node) => StyleBasedFormatState;

/**
 * Get current or cached selection range
 * @param core The EditorCore object
 * @param tryGetFromCache Set to true to retrieve the selection range from cache if editor doesn't own the focus now
 * @returns A Range object of the selection range
 */
export type GetSelectionRange = (core: EditorCore, tryGetFromCache: boolean) => Range;

/**
 * Check if the editor has focus now
 * @param core The EditorCore object
 * @returns True if the editor has focus, otherwise false
 */
export type HasFocus = (core: EditorCore) => boolean;

/**
 * Insert a DOM node into editor content
 * @param core The EditorCore object. No op if null.
 * @param option An insert option object to specify how to insert the node
 */
export type InsertNode = (core: EditorCore, node: Node, option: InsertOption) => boolean;

/**
 * Change the editor selection to the given range
 * @param core The EditorCore object
 * @param range The range to select
 * @param skipSameRange When set to true, do nothing if the given range is the same with current selection
 * in editor, otherwise it will always remove current selection ranage and set to the given one.
 * This parameter is always treat as true in Edge to avoid some weird runtime exception.
 */
export type SelectRange = (core: EditorCore, range: Range, skipSameRange?: boolean) => boolean;

/**
 * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
 * if triggerContentChangedEvent is set to true
 * @param core The EditorCore object
 * @param content HTML content to set in
 * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
 */
export type SetContent = (
    core: EditorCore,
    content: string,
    triggerContentChangedEvent: boolean
) => void;

/**
 * Trigger a plugin event
 * @param core The EditorCore object
 * @param pluginEvent The event object to trigger
 * @param broadcast Set to true to skip the shouldHandleEventExclusively check
 */
export type TriggerEvent = (core: EditorCore, pluginEvent: PluginEvent, broadcast: boolean) => void;

export interface CoreApiMap {
    /**
     * Attach a DOM event to the editor content DIV
     * @param core The EditorCore object
     * @param eventName The DOM event name
     * @param pluginEventType Optional event type. When specified, editor will trigger a plugin event with this name when the DOM event is triggered
     * @param beforeDispatch Optional callback function to be invoked when the DOM event is triggered before trigger plugin event
     */
    attachDomEvent: AttachDomEvent;

    /**
     * Create a DocumentFragment for paste from a ClipboardData
     * @param core The EditorCore object.
     * @param clipboardData Clipboard data retrieved from clipboard
     * @param position The position to paste to
     * @param pasteAsText True to force use plain text as the content to paste, false to choose HTML or Image if any
     * @param applyCurrentStyle True if apply format of current selection to the pasted content,
     * false to keep original foramt
     */
    createPasteFragment: CreatePasteFragment;

    /**
     * Call an editing callback with adding undo snapshots around, and trigger a ContentChanged event if change source is specified.
     * Undo snapshot will not be added if this call is nested inside another editWithUndo() call.
     * @param core The EditorCore object
     * @param callback The editing callback, accepting current selection start and end position, returns an optional object used as the data field of ContentChangedEvent.
     * @param changeSource The ChangeSource string of ContentChangedEvent. @default ChangeSource.Format. Set to null to avoid triggering ContentChangedEvent
     * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complelte).
     */
    editWithUndo: EditWithUndo;

    /**
     * Focus to editor. If there is a cached selection range, use it as current selection
     * @param core The EditorCore object
     */
    focus: Focus;

    /**
     * Get current editor content as HTML string
     * @param core The EditorCore object
     * @param triggerExtractContentEvent Whether trigger ExtractContentWithDom event to all plugins
     * before return. Use this parameter to remove any temporary content added by plugins.
     * @param includeSelectionMarker Set to true if need include selection marker inside the content.
     * When restore this content, editor will set the selection to the position marked by these markers.
     * This parameter will be ignored when triggerExtractContentEvent is set to true
     * @returns HTML string representing current editor content
     */
    getContent: GetContent;

    /**
     * Get custom data related with this editor
     * @param core The EditorCore object
     * @param key Key of the custom data
     * @param getter Getter function. If custom data for the given key doesn't exist,
     * call this function to get one and store it.
     * @param disposer An optional disposer function to dispose this custom data when
     * dispose editor.
     */
    getCustomData: GetCustomData;

    /**
     * Get style based format state from current selection, including font name/size and colors
     * @param core The EditorCore objects
     * @param node The node to get style from
     */
    getStyleBasedFormatState: GetStyleBasedFormatState;

    /**
     * Get current or cached selection range
     * @param core The EditorCore object
     * @param tryGetFromCache Set to true to retrieve the selection range from cache if editor doesn't own the focus now
     * @returns A Range object of the selection range
     */
    getSelectionRange: GetSelectionRange;

    /**
     * Check if the editor has focus now
     * @param core The EditorCore object
     * @returns True if the editor has focus, otherwise false
     */
    hasFocus: HasFocus;

    /**
     * Insert a DOM node into editor content
     * @param core The EditorCore object. No op if null.
     * @param option An insert option object to specify how to insert the node
     */
    insertNode: InsertNode;

    /**
     * Change the editor selection to the given range
     * @param core The EditorCore object
     * @param range The range to select
     * @param skipSameRange When set to true, do nothing if the given range is the same with current selection
     * in editor, otherwise it will always remove current selection ranage and set to the given one.
     * This parameter is always treat as true in Edge to avoid some weird runtime exception.
     */
    selectRange: SelectRange;

    /**
     * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
     * if triggerContentChangedEvent is set to true
     * @param core The EditorCore object
     * @param content HTML content to set in
     * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
     */
    setContent: SetContent;

    /**
     * Trigger a plugin event
     * @param core The EditorCore object
     * @param pluginEvent The event object to trigger
     * @param broadcast Set to true to skip the shouldHandleEventExclusively check
     */
    triggerEvent: TriggerEvent;
}
