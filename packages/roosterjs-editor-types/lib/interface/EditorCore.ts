import ClipboardData from './ClipboardData';
import ContentChangedData from './ContentChangedData';
import DarkColorHandler from './DarkColorHandler';
import EditorPlugin from './EditorPlugin';
import NodePosition from './NodePosition';
import Rect from './Rect';
import SelectionPath from './SelectionPath';
import TableSelection from './TableSelection';
import { ChangeSource } from '../enum/ChangeSource';
import { ColorTransformDirection } from '../enum/ColorTransformDirection';
import { ContentMetadata } from './ContentMetadata';
import { DOMEventHandler } from '../type/domEventHandler';
import { GetContentMode } from '../enum/GetContentMode';
import { ImageSelectionRange, SelectionRangeEx } from './SelectionRangeEx';
import { InsertOption } from './InsertOption';
import { PendableFormatState, StyleBasedFormatState } from './FormatState';
import { PluginEvent } from '../event/PluginEvent';
import { PluginState } from './CorePlugins';
import { PositionType } from '../enum/PositionType';
import { SizeTransformer } from '../type/SizeTransformer';
import { TableSelectionRange } from './SelectionRangeEx';
import { TrustedHTMLHandler } from '../type/TrustedHTMLHandler';
import type { CompatibleChangeSource } from '../compatibleEnum/ChangeSource';
import type { CompatibleColorTransformDirection } from '../compatibleEnum/ColorTransformDirection';
import type { CompatibleGetContentMode } from '../compatibleEnum/GetContentMode';
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
     * Original API map of this editor. Overridden core API can use API from this map to call the original version of core API.
     */
    readonly originalApi: CoreApiMap;

    /**
     * A handler to convert HTML string to a trust HTML string.
     * By default it will just return the original HTML string directly.
     * To override, pass your own trusted HTML handler to EditorOptions.trustedHTMLHandler
     */
    readonly trustedHTMLHandler: TrustedHTMLHandler;

    /*
     * Current zoom scale, default value is 1
     * When editor is put under a zoomed container, need to pass the zoom scale number using this property
     * to let editor behave correctly especially for those mouse drag/drop behaviors
     */
    zoomScale: number;

    /**
     * @deprecated Use zoomScale instead
     */
    sizeTransformer: SizeTransformer;

    /**
     * Retrieves the Visible Viewport of the editor.
     */
    getVisibleViewport: () => Rect | null;

    /**
     * Color of the border of a selectedImage. Default color: '#DB626C'
     */
    imageSelectionBorderColor?: string;

    /**
     * Dark model handler for the editor, used for variable-based solution.
     * If keep it null, editor will still use original dataset-based dark mode solution.
     */
    darkColorHandler: DarkColorHandler;
}

/**
 * Call an editing callback with adding undo snapshots around, and trigger a ContentChanged event if change source is specified.
 * Undo snapshot will not be added if this call is nested inside another addUndoSnapshot() call.
 * @param core The EditorCore object
 * @param callback The editing callback, accepting current selection start and end position, returns an optional object used as the data field of ContentChangedEvent.
 * @param changeSource The ChangeSource string of ContentChangedEvent. @default ChangeSource.Format. Set to null to avoid triggering ContentChangedEvent
 * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complete).
 * @param additionalData Optional parameter to provide additional data related to the ContentChanged Event.
 */
export type AddUndoSnapshot = (
    core: EditorCore,
    callback: ((start: NodePosition | null, end: NodePosition | null) => any) | null,
    changeSource: ChangeSource | CompatibleChangeSource | string | null,
    canUndoByBackspace: boolean,
    additionalData?: ContentChangedData
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
    position: NodePosition | null,
    pasteAsText: boolean,
    applyCurrentStyle: boolean,
    pasteAsImage: boolean
) => DocumentFragment | null;

/**
 * Ensure user will type into a container element rather than into the editor content DIV directly
 * @param core The EditorCore object.
 * @param position The position that user is about to type to
 * @param keyboardEvent Optional keyboard event object
 * @param deprecated Deprecated parameter, not used
 */
export type EnsureTypeInContainer = (
    core: EditorCore,
    position: NodePosition,
    keyboardEvent?: KeyboardEvent,
    deprecated?: boolean
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
export type GetContent = (
    core: EditorCore,
    mode: GetContentMode | CompatibleGetContentMode
) => string;

/**
 * Get current or cached selection range
 * @param core The EditorCore object
 * @param tryGetFromCache Set to true to retrieve the selection range from cache if editor doesn't own the focus now
 * @returns A Range object of the selection range
 */
export type GetSelectionRange = (core: EditorCore, tryGetFromCache: boolean) => Range | null;

/**
 * Get current selection range
 * @param core The EditorCore object
 * @returns A Range object of the selection range
 */
export type GetSelectionRangeEx = (core: EditorCore) => SelectionRangeEx;

/**
 * Get style based format state from current selection, including font name/size and colors
 * @param core The EditorCore objects
 * @param node The node to get style from
 */
export type GetStyleBasedFormatState = (
    core: EditorCore,
    node: Node | null
) => StyleBasedFormatState;

/**
 * Get the pendable format such as underline and bold
 * @param core The EditorCore object
 * @param forceGetStateFromDOM If set to true, will force get the format state from DOM tree.
 * @return The pending format state of editor.
 */
export type GetPendableFormatState = (
    core: EditorCore,
    forceGetStateFromDOM: boolean
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
export type InsertNode = (core: EditorCore, node: Node, option: InsertOption | null) => boolean;

/**
 * Restore an undo snapshot into editor
 * @param core The editor core object
 * @param step Steps to move, can be 0, positive or negative
 */
export type RestoreUndoSnapshot = (core: EditorCore, step: number) => void;

/**
 * Select content according to the given information.
 * There are a bunch of allowed combination of parameters. See IEditor.select for more details
 * @param core The editor core object
 * @param arg1 A DOM Range, or SelectionRangeEx, or NodePosition, or Node, or Selection Path
 * @param arg2 (optional) A NodePosition, or an offset number, or a PositionType, or a TableSelection, or null
 * @param arg3 (optional) A Node
 * @param arg4 (optional) An offset number, or a PositionType
 */
export type Select = (
    core: EditorCore,
    arg1: Range | SelectionRangeEx | NodePosition | Node | SelectionPath | null,
    arg2?: NodePosition | number | PositionType | TableSelection | null,
    arg3?: Node,
    arg4?: number | PositionType
) => boolean;

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
    triggerContentChangedEvent: boolean,
    metadata?: ContentMetadata
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
 * @param forceTransform By default this function will only work when editor core is in dark mode.
 * Pass true to this value to force do color transformation even editor core is in light mode
 * @param fromDarkModel Whether the given content is already in dark mode
 */
export type TransformColor = (
    core: EditorCore,
    rootNode: Node | null,
    includeSelf: boolean,
    callback: (() => void) | null,
    direction: ColorTransformDirection | CompatibleColorTransformDirection,
    forceTransform?: boolean,
    fromDarkMode?: boolean
) => void;

/**
 * Trigger a plugin event
 * @param core The EditorCore object
 * @param pluginEvent The event object to trigger
 * @param broadcast Set to true to skip the shouldHandleEventExclusively check
 */
export type TriggerEvent = (core: EditorCore, pluginEvent: PluginEvent, broadcast: boolean) => void;

/**
 * Select a table and save data of the selected range
 * @param core The EditorCore object
 * @param table table to select
 * @param coordinates first and last cell of the selection, if this parameter is null, instead of
 * selecting, will unselect the table.
 * @returns true if successful
 */
export type SelectTable = (
    core: EditorCore,
    table: HTMLTableElement | null,
    coordinates?: TableSelection
) => TableSelectionRange | null;

/**
 * Select a table and save data of the selected range
 * @param core The EditorCore object
 * @param image image to select
 * @returns true if successful
 */
export type SelectImage = (
    core: EditorCore,
    image: HTMLImageElement | null
) => ImageSelectionRange | null;

/**
 * The interface for the map of core API.
 * Editor can call call API from this map under EditorCore object
 */
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
     * @param deprecated Deprecated parameter, not used
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
     * Get current or cached selection range
     * @param core The EditorCore object
     * @param tryGetFromCache Set to true to retrieve the selection range from cache if editor doesn't own the focus now
     * @returns A Range object of the selection range
     */
    getSelectionRangeEx: GetSelectionRangeEx;

    /**
     * Get style based format state from current selection, including font name/size and colors
     * @param core The EditorCore objects
     * @param node The node to get style from
     */
    getStyleBasedFormatState: GetStyleBasedFormatState;

    /**
     * Get the pendable format such as underline and bold
     * @param core The EditorCore object
     *@param forceGetStateFromDOM If set to true, will force get the format state from DOM tree.
     * @return The pending format state of editor.
     */
    getPendableFormatState: GetPendableFormatState;

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
     * Select content according to the given information.
     * There are a bunch of allowed combination of parameters. See IEditor.select for more details
     * @param core The editor core object
     * @param arg1 A DOM Range, or SelectionRangeEx, or NodePosition, or Node, or Selection Path
     * @param arg2 (optional) A NodePosition, or an offset number, or a PositionType, or a TableSelection, or null
     * @param arg3 (optional) A Node
     * @param arg4 (optional) An offset number, or a PositionType
     */
    select: Select;

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
     * @param forceTransform By default this function will only work when editor core is in dark mode.
     * Pass true to this value to force do color transformation even editor core is in light mode
     * @param fromDarkModel Whether the given content is already in dark mode
     */
    transformColor: TransformColor;

    /**
     * Trigger a plugin event
     * @param core The EditorCore object
     * @param pluginEvent The event object to trigger
     * @param broadcast Set to true to skip the shouldHandleEventExclusively check
     */
    triggerEvent: TriggerEvent;

    /**
     * Select a table and save data of the selected range
     * @param core The EditorCore object
     * @param table table to select
     * @param coordinates first and last cell of the selection, if this parameter is null, instead of
     * selecting, will unselect the table.
     * @param shouldAddStyles Whether need to update the style elements
     * @returns true if successful
     */
    selectTable: SelectTable;

    /**
     * Select a image and save data of the selected range
     * @param core The EditorCore object
     * @param image image to select
     * @param imageId the id of the image element
     * @returns true if successful
     */
    selectImage: SelectImage;
}
