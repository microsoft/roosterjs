import ClipboardData from './ClipboardData';
import EditorPlugin from './EditorPlugin';
import NodePosition from './NodePosition';
import { ChangeSource } from '../enum/ChangeSource';
import { ColorTransformDirection } from '../enum/ColorTransformDirection';
import { DOMEventHandler } from '../type/domEventHandler';
import { GetContentMode } from '../enum/GetContentMode';
import { InsertOption } from './InsertOption';
import { PendableFormatState, StyleBasedFormatState } from './FormatState';
import { PluginEvent } from '../event/PluginEvent';
import { PluginState } from './CorePlugins';
import { TrustedHTMLHandler } from '../type/TrustedHTMLHandler';

/**
 * Represents the core data structure of an editor
 */
export default interface EditorCore extends PluginState {
    /**
     * The content DIV element of this editor
     */
    readonly contentDiv: HTMLDivElement;

    /**
     * An array of editor plugins.
     */
    readonly plugins: EditorPlugin[];

    /**
     * Core API map of this editor
     */
    readonly api: CoreApiMap;

    /**
     * A handler to convert HTML string to a trust HTML string.
     * By default it will just return the original HTML string directly.
     * To override, pass your own trusted HTML handler to EditorOptions.trustedHTMLHandler
     */
    readonly trustedHTMLHandler: TrustedHTMLHandler;
}

/**
 * Call an editing callback with adding undo snapshots around, and trigger a ContentChanged event if change source is specified.
 * Undo snapshot will not be added if this call is nested inside another addUndoSnapshot() call.
 * @param core The EditorCore object
 * @param callback The editing callback, accepting current selection start and end position, returns an optional object used as the data field of ContentChangedEvent.
 * @param changeSource The ChangeSource string of ContentChangedEvent. @default ChangeSource.Format. Set to null to avoid triggering ContentChangedEvent
 * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complete).
 */
export type AddUndoSnapshot = (
    core: EditorCore,
    callback: (start: NodePosition, end: NodePosition) => any,
    changeSource: ChangeSource | string,
    canUndoByBackspace: boolean
) => void;

/**
 * Attach a DOM event to the editor content DIV
 * @param core The EditorCore object
 * @param eventMap A map from event name to its handler
 */
export type AttachDomEvent = (
    core: EditorCore,
    eventMap: Record<string, DOMEventHandler>
) => () => void;

/**
 * Create a DocumentFragment for paste from a ClipboardData
 * @param core The EditorCore object.
 * @param clipboardData Clipboard data retrieved from clipboard
 * @param position The position to paste to
 * @param pasteAsText True to force use plain text as the content to paste, false to choose HTML or Image if any
 * @param applyCurrentStyle True if apply format of current selection to the pasted content,
 * false to keep original format
 */
export type CreatePasteFragment = (
    core: EditorCore,
    clipboardData: ClipboardData,
    position: NodePosition,
    pasteAsText: boolean,
    applyCurrentStyle: boolean
) => DocumentFragment;

/**
 * Ensure user will type into a container element rather than into the editor content DIV directly
 * @param core The EditorCore object.
 * @param position The position that user is about to type to
 * @param keyboardEvent Optional keyboard event object
 */
export type EnsureTypeInContainer = (
    core: EditorCore,
    position: NodePosition,
    keyboardEvent?: KeyboardEvent
) => void;

/**
 * Focus to editor. If there is a cached selection range, use it as current selection
 * @param core The EditorCore object
 */
export type Focus = (core: EditorCore) => void;

/**
 * Get current editor content as HTML string
 * @param core The EditorCore object
 * @param mode specify what kind of HTML content to retrieve
 * @returns HTML string representing current editor content
 */
export type GetContent = (core: EditorCore, mode: GetContentMode) => string;

/**
 * Get current or cached selection range
 * @param core The EditorCore object
 * @param tryGetFromCache Set to true to retrieve the selection range from cache if editor doesn't own the focus now
 * @returns A Range object of the selection range
 */
export type GetSelectionRange = (core: EditorCore, tryGetFromCache: boolean) => Range;

/**
 * Get style based format state from current selection, including font name/size and colors
 * @param core The EditorCore objects
 * @param node The node to get style from
 */
export type GetStyleBasedFormatState = (core: EditorCore, node: Node) => StyleBasedFormatState;

/**
 * Get the pending format state from the cache, if it does not exist, look at DOM tree
 * @param range The selection Range
 */
export type GetPendingFormatState = (
    range: Range,
    cachedPendableFormatState: PendableFormatState,
    cachedPosition: NodePosition
) => PendableFormatState;

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
 * Restore an undo snapshot into editor
 * @param core The editor core object
 * @param step Steps to move, can be 0, positive or negative
 */
export type RestoreUndoSnapshot = (core: EditorCore, step: number) => void;

/**
 * Change the editor selection to the given range
 * @param core The EditorCore object
 * @param range The range to select
 * @param skipSameRange When set to true, do nothing if the given range is the same with current selection
 * in editor, otherwise it will always remove current selection range and set to the given one.
 * This parameter is always treated as true in Edge to avoid some weird runtime exception.
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
 * Switch the Shadow Edit mode of editor On/Off
 * @param core The EditorCore object
 * @param isOn True to switch On, False to switch Off
 */
export type SwitchShadowEdit = (core: EditorCore, isOn: boolean) => void;

/**
 * Edit and transform color of elements between light mode and dark mode
 * @param core The EditorCore object
 * @param rootNode The root HTML node to transform
 * @param includeSelf True to transform the root node as well, otherwise false
 * @param callback The callback function to invoke before do color transformation
 * @param direction To specify the transform direction, light to dark, or dark to light
 */
export type TransformColor = (
    core: EditorCore,
    rootNode: Node,
    includeSelf: boolean,
    callback: () => void,
    direction: ColorTransformDirection
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
     * Call an editing callback with adding undo snapshots around, and trigger a ContentChanged event if change source is specified.
     * Undo snapshot will not be added if this call is nested inside another addUndoSnapshot() call.
     * @param core The EditorCore object
     * @param callback The editing callback, accepting current selection start and end position, returns an optional object used as the data field of ContentChangedEvent.
     * @param changeSource The ChangeSource string of ContentChangedEvent. @default ChangeSource.Format. Set to null to avoid triggering ContentChangedEvent
     * @param canUndoByBackspace True if this action can be undone when user presses Backspace key (aka Auto Complete).
     */
    addUndoSnapshot: AddUndoSnapshot;

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
     * false to keep original format
     */
    createPasteFragment: CreatePasteFragment;

    /**
     * Ensure user will type into a container element rather than into the editor content DIV directly
     * @param core The EditorCore object.
     * @param position The position that user is about to type to
     * @param keyboardEvent Optional keyboard event object
     */
    ensureTypeInContainer: EnsureTypeInContainer;

    /**
     * Focus to editor. If there is a cached selection range, use it as current selection
     * @param core The EditorCore object
     */
    focus: Focus;

    /**
     * Get current editor content as HTML string
     * @param core The EditorCore object
     * @param mode specify what kind of HTML content to retrieve
     * @returns HTML string representing current editor content
     */
    getContent: GetContent;

    /**
     * Get current or cached selection range
     * @param core The EditorCore object
     * @param tryGetFromCache Set to true to retrieve the selection range from cache if editor doesn't own the focus now
     * @returns A Range object of the selection range
     */
    getSelectionRange: GetSelectionRange;

    /**
     * Get style based format state from current selection, including font name/size and colors
     * @param core The EditorCore objects
     * @param node The node to get style from
     */
    getStyleBasedFormatState: GetStyleBasedFormatState;

    /**
     * Get style based format state from current selection, including font name/size and colors
     * @param core The EditorCore objects
     * @param node The node to get style from
     */
    getPendingFormatState: GetPendingFormatState;

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
     * Restore an undo snapshot into editor
     * @param core The editor core object
     * @param step Steps to move, can be 0, positive or negative
     */
    restoreUndoSnapshot: RestoreUndoSnapshot;

    /**
     * Change the editor selection to the given range
     * @param core The EditorCore object
     * @param range The range to select
     * @param skipSameRange When set to true, do nothing if the given range is the same with current selection
     * in editor, otherwise it will always remove current selection range and set to the given one.
     * This parameter is always treated as true in Edge to avoid some weird runtime exception.
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
     * Switch the Shadow Edit mode of editor On/Off
     * @param core The EditorCore object
     * @param isOn True to switch On, False to switch Off
     */
    switchShadowEdit: SwitchShadowEdit;

    /**
     * Edit and transform color of elements between light mode and dark mode
     * @param core The EditorCore object
     * @param rootNode The root HTML element to transform
     * @param includeSelf True to transform the root node as well, otherwise false
     * @param callback The callback function to invoke before do color transformation
     * @param direction To specify the transform direction, light to dark, or dark to light
     */
    transformColor: TransformColor;

    /**
     * Trigger a plugin event
     * @param core The EditorCore object
     * @param pluginEvent The event object to trigger
     * @param broadcast Set to true to skip the shouldHandleEventExclusively check
     */
    triggerEvent: TriggerEvent;
}
