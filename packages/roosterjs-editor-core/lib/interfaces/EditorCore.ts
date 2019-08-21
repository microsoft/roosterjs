import CopyPlugin from '../corePlugins/CopyPlugin';
import DOMEventPlugin from '../corePlugins/DOMEventPlugin';
import EditorPlugin from './EditorPlugin';
import EditPlugin from '../corePlugins/EditPlugin';
import FirefoxTypeAfterLink from '../corePlugins/FirefoxTypeAfterLink';
import MouseUpPlugin from '../corePlugins/MouseUpPlugin';
import TypeInContainerPlugin from '../corePlugins/TypeInContainerPlugin';
import UndoService from './UndoService';
import { CustomDataMap } from './CustomData';
import {
    ChangeSource,
    DefaultFormat,
    DarkModeOptions,
    InsertOption,
    NodePosition,
    PluginEvent,
    PluginEventType,
} from 'roosterjs-editor-types';

/**
 * An interface for editor core plugins.
 * These plugins are built-in and most of them are not able to be replaced
 */
export interface CorePlugins {
    /**
     * Edit plugin handles ContentEditFeatures
     */
    readonly edit: EditPlugin;

    /**
     * Undo plugin provides the ability to undo/redo
     */
    readonly undo: UndoService;

    /**
     * TypeInContainer plugin makes sure user is always type under a container element under editor DIV
     */
    readonly typeInContainer: TypeInContainerPlugin;

    /**
     * MouseUp plugin helps generate MouseUp event even mouse is out of editor area
     */
    readonly mouseUp: MouseUpPlugin;

    /**
     * DomEvent plugin helps handle additional DOM events such as IME composition, cut, drop.
     */
    readonly domEvent: DOMEventPlugin;

    /**
     * FirefoxTypeAfterLink plugin helps workaround a Firefox bug to allow type outside a hyperlink
     */
    readonly firefoxTypeAfterLink: FirefoxTypeAfterLink;

    /**
     * Copy plguin for handling dark mode copy.
     */
    readonly copyPlugin: CopyPlugin;
}

/**
 * Represents the core data structure of an editor
 */
export default interface EditorCore {
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
     * Plugins which will handle event via onPluginEvent() and/or willHandleEventExclusively()
     */
    readonly eventHandlerPlugins: EditorPlugin[];

    /**
     * Default format of this editor
     */
    defaultFormat: DefaultFormat;

    /**
     * Core plugin of this editor
     */
    readonly corePlugins: CorePlugins;

    /**
     * Custom data of this editor
     */
    readonly customData: CustomDataMap;

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
 * Call an editing callback with adding undo snapshots around, and trigger a ContentChanged event if change source is specified.
 * Undo snapshot will not be added if this call is nested inside another editWithUndo() call.
 * @param core The EditorCore object
 * @param callback The editing callback, accepting current selection start and end position, returns an optional object used as the data field of ContentChangedEvent.
 * @param changeSource The ChangeSource string of ContentChangedEvent. @default ChangeSource.Format. Set to null to avoid triggering ContentChangedEvent
 */
export type EditWithUndo = (
    core: EditorCore,
    callback: (start: NodePosition, end: NodePosition, snapshotBeforeCallback: string) => any,
    changeSource: ChangeSource | string
) => void;

/**
 * Focus to editor. If there is a cached selection range, use it as current selection
 * @param core The EditorCore object
 */
export type Focus = (core: EditorCore) => void;

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
 * @deprecated Use SelectRange instead
 * Select content
 * @param core The EditorCore object
 */
export type Select = (core: EditorCore, arg1: any, arg2?: any, arg3?: any, arg4?: any) => boolean;

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
     * @deprecated Use SelectRange instead
     * Select content
     * @param core The EditorCore object
     */
    select: Select;

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
     * Trigger a plugin event
     * @param core The EditorCore object
     * @param pluginEvent The event object to trigger
     * @param broadcast Set to true to skip the shouldHandleEventExclusively check
     */
    triggerEvent: TriggerEvent;
}
