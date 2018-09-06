import CorePlugin from './CorePlugin';
import EditorPlugin from './EditorPlugin';
import UndoService from './UndoService';
import {
    ChangeSource,
    DefaultFormat,
    InsertOption,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';
import { Position } from 'roosterjs-editor-dom';

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
     * Core plugin of this editor
     */
    readonly corePlugin: CorePlugin;

    /**
     * Undo service of this editor
     */
    readonly undo: UndoService;

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
     * Core API map of this editor
     */
    readonly api: CoreApiMap;

    /**
     * Core API map of this editor with default values (not overridable)
     */
    readonly defaultApi: CoreApiMap;

    /**
     * The undo snapshot taken by addUndoSnapshot() before callback function is invoked.
     */
    currentUndoSnapshot: string;

    /**
     * Cached selection range of this editor
     */
    cachedSelectionRange: Range;
}

export default EditorCore;

export type AttachDomEvent = (
    core: EditorCore,
    eventName: string,
    pluginEventType?: PluginEventType,
    beforeDispatch?: (event: UIEvent) => void
) => () => void;
export type EditWithUndo = (
    core: EditorCore,
    callback: (start: Position, end: Position, snapshotBeforeCallback: string) => any,
    changeSource: ChangeSource | string
) => void;
export type Focus = (core: EditorCore) => void;
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
     * @param changeSource The ChangeSource string of ContentChangedEvent. @default ChangeSource.Format. Set to null to avoid triggering ContentChangedEvent
     */
    editWithUndo: EditWithUndo;

    /**
     * Focus to editor. If there is a cached selection range, use it as current selection
     * @param core The EditorCore object
     */
    focus: Focus;

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
