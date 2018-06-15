import EditorPlugin from '../editor/EditorPlugin';
import UndoService from '../editor/UndoService';
import {
    ChangeSource,
    ContentScope,
    ContentPosition,
    DefaultFormat,
    InsertOption,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import { ContentTraverser, Position } from 'roosterjs-editor-dom';

/**
 * Represents the core data structure of an editor
 */
interface EditorCore {
    /**
     * HTML Document object of this editor
     */
    readonly document: Document;

    /**
     * The content DIV element of this editor
     */
    readonly contentDiv: HTMLDivElement;

    /**
     * An array of editor plugins.
     */
    readonly plugins: EditorPlugin[];

    /**
     * Default format of this editor
     */
    readonly defaultFormat: DefaultFormat;

    /**
     * Undo service of this editor
     */
    readonly undo: UndoService;

    /**
     * Whether adding undo snapshot is suspended
     */
    suspendUndo: boolean;

    /**
     * Custom data of this editor
     */
    readonly customData: {
        [Key: string]: {
            value: any;
            disposer: (value: any) => void;
        };
    };

    /**
     * Cached selection range of this editor
     */
    cachedSelectionRange: Range;

    /**
     * Interval handle of idle loop
     */
    idleLoopHandle: number;

    /**
     * Whether next idle event should be ignored
     */
    ignoreIdleEvent: boolean;

    /**
     * Core API map of this editor
     */
    readonly api: CoreApiMap;

    /**
     * A cached undo snapshot before auto complete, it will be restored into editor when a BackSpace key is pressed before other event is fired
     */
    snapshotBeforeAutoComplete: string;
}

export default EditorCore;

export type ApplyInlineStyle = (core: EditorCore, styler: (element: HTMLElement) => void) => void;
export type AttachDomEvent = (
    core: EditorCore,
    eventName: string,
    pluginEventType?: PluginEventType,
    beforeDispatch?: (event: UIEvent) => void
) => () => void;
export type EditWithUndo = (
    core: EditorCore,
    callback: (start: Position, end: Position) => any,
    changeSource: ChangeSource | string,
    addUndoSnapshotBeforeAction: boolean
) => void;
export type Focus = (core: EditorCore) => void;
export type GetContentTraverser = (
    core: EditorCore,
    scope: ContentScope,
    position?: ContentPosition
) => ContentTraverser;
export type GetCustomData = <T>(
    core: EditorCore,
    key: string,
    getter: () => T,
    disposer?: (value: T) => void
) => T;
export type GetSelectionRange = (core: EditorCore, tryGetFromCache: boolean) => Range;
export type HasFocus = (core: EditorCore) => boolean;
export type InsertNode = (core: EditorCore, node: Node, option: InsertOption) => boolean;
export type Select = (core: EditorCore, arg1: any, arg2?: any, arg3?: any, arg4?: any) => boolean;
export type TriggerEvent = (core: EditorCore, pluginEvent: PluginEvent, broadcast: boolean) => void;

export interface CoreApiMap {
    applyInlineStyle: ApplyInlineStyle;

    /**
     * Attach a DOM event to the editor content DIV
     * @param core The EditorCore object
     * @param eventName The DOM event name
     * @param pluginEventType Optional event type. When specified, editor will trigger a plugin event with this name when the DOM event is triggered
     * @param beforeDispatch Optional callback function to be invoked when the DOM event is triggered before trigger plugin event
     */
    attachDomEvent: AttachDomEvent;

    /**
     * Call an editing callback with adding undo snapshots around, and trigger a ContentChanged event if change source is specified.
     * Undo snapshot will not be added if this call is nested inside another editWithUndo() call.
     * @param core The EditorCore object
     * @param callback The editing callback, accepting current selection start and end position, returns an optional object used as the data field of ContentChangedEvent.
     * @param changeSource The ChangeSource string of ContentChangedEvent. @default is ChangeSource.Format. Set to null to avoid triggering ContentChangedEvent
     */
    editWithUndo: EditWithUndo;

    /**
     * Focus to editor. If there is a cached selection range, use it as current selection
     * @param core The EditorCore object
     */
    focus: Focus;

    /**
     * Get a ContentTraverser object from this editor using the give parameters
     * @param core The EditorCore object
     * @param scope The traversing scope
     * @param position ContentPosition, this is used when scope is set to ContentScope.Block
     * @returns a ContentTraverser object
     */
    getContentTraverser: GetContentTraverser;

    /**
     * Get a custom data from this editor using specified key.
     * @param core The EditorCore object
     * @param key A unique key of this custom data
     * @param getter Getter function of this custom data. If will be called when first time retrieve this data
     * @param disposer Optional disposer function. It will be called when editor is disposing
     * @returns The custom data specified by key
     */
    getCustomData: GetCustomData;

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
     * Select content
     * @param core The EditorCore object
     */
    select: Select;

    /**
     * Trigger a plugin event
     * @param core The EditorCore object
     * @param pluginEvent The event object to trigger
     * @param broadcast Set to true to skip the shouldHandleEventExclusively check
     */
    triggerEvent: TriggerEvent;
}
