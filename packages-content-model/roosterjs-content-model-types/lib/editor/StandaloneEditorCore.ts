import type { PluginEvent } from '../event/PluginEvent';
import type { PluginState } from '../pluginState/PluginState';
import type { EditorPlugin } from './EditorPlugin';
import type { ClipboardData } from '../parameter/ClipboardData';
import type { PasteType } from '../enum/PasteType';
import type { DOMEventRecord } from '../parameter/DOMEventRecord';
import type { Snapshot } from '../parameter/Snapshot';
import type { EntityState } from '../parameter/FormatWithContentModelContext';
import type { DarkColorHandler } from 'roosterjs-editor-types';
import type { ContentModelDocument } from '../group/ContentModelDocument';
import type { DOMSelection } from '../selection/DOMSelection';
import type { DomToModelOption } from '../context/DomToModelOption';
import type { DomToModelSettings } from '../context/DomToModelSettings';
import type { EditorContext } from '../context/EditorContext';
import type { EditorEnvironment } from '../parameter/EditorEnvironment';
import type { ModelToDomOption } from '../context/ModelToDomOption';
import type { ModelToDomSettings, OnNodeCreated } from '../context/ModelToDomSettings';
import type { TrustedHTMLHandler } from '../parameter/TrustedHTMLHandler';
import type { Rect } from '../parameter/Rect';
import type {
    ContentModelFormatter,
    FormatWithContentModelOptions,
} from '../parameter/FormatWithContentModelOptions';

/**
 * Create a EditorContext object used by ContentModel API
 * @param core The StandaloneEditorCore object
 */
export type CreateEditorContext = (core: StandaloneEditorCore) => EditorContext;

/**
 * Create Content Model from DOM tree in this editor
 * @param core The StandaloneEditorCore object
 * @param option The option to customize the behavior of DOM to Content Model conversion
 * @param selectionOverride When passed, use this selection range instead of current selection in editor
 */
export type CreateContentModel = (
    core: StandaloneEditorCore,
    option?: DomToModelOption,
    selectionOverride?: DOMSelection
) => ContentModelDocument;

/**
 * Get current DOM selection from editor
 * @param core The StandaloneEditorCore object
 */
export type GetDOMSelection = (core: StandaloneEditorCore) => DOMSelection | null;

/**
 * Set content with content model. This is the replacement of core API getSelectionRangeEx
 * @param core The StandaloneEditorCore object
 * @param model The content model to set
 * @param option Additional options to customize the behavior of Content Model to DOM conversion
 * @param onNodeCreated An optional callback that will be called when a DOM node is created
 */
export type SetContentModel = (
    core: StandaloneEditorCore,
    model: ContentModelDocument,
    option?: ModelToDomOption,
    onNodeCreated?: OnNodeCreated
) => DOMSelection | null;

/**
 * Set current DOM selection from editor. This is the replacement of core API select
 * @param core The StandaloneEditorCore object
 * @param selection The selection to set
 * @param skipSelectionChangedEvent @param Pass true to skip triggering a SelectionChangedEvent
 */
export type SetDOMSelection = (
    core: StandaloneEditorCore,
    selection: DOMSelection | null,
    skipSelectionChangedEvent?: boolean
) => void;

/**
 * The general API to do format change with Content Model
 * It will grab a Content Model for current editor content, and invoke a callback function
 * to do format change. Then according to the return value, write back the modified content model into editor.
 * If there is cached model, it will be used and updated.
 * @param core The StandaloneEditorCore object
 * @param formatter Formatter function, see ContentModelFormatter
 * @param options More options, see FormatWithContentModelOptions
 */
export type FormatContentModel = (
    core: StandaloneEditorCore,
    formatter: ContentModelFormatter,
    options?: FormatWithContentModelOptions
) => void;

/**
 * Switch the Shadow Edit mode of editor On/Off
 * @param core The StandaloneEditorCore object
 * @param isOn True to switch On, False to switch Off
 */
export type SwitchShadowEdit = (core: StandaloneEditorCore, isOn: boolean) => void;

/**
 * Trigger a plugin event
 * @param core The StandaloneEditorCore object
 * @param pluginEvent The event object to trigger
 * @param broadcast Set to true to skip the shouldHandleEventExclusively check
 */
export type TriggerEvent = (
    core: StandaloneEditorCore,
    pluginEvent: PluginEvent,
    broadcast: boolean
) => void;

/**
 * Add an undo snapshot to current undo snapshot stack
 * @param core The StandaloneEditorCore object
 * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complete).
 * @param entityStates @optional Entity states related to this snapshot.
 * Each entity state will cause an EntityOperation event with operation = EntityOperation.UpdateEntityState
 * when undo/redo to this snapshot
 */
export type AddUndoSnapshot = (
    core: StandaloneEditorCore,
    canUndoByBackspace: boolean,
    entityStates?: EntityState[]
) => void;

/**
 * Retrieves the rect of the visible viewport of the editor.
 * @param core The StandaloneEditorCore object
 */
export type GetVisibleViewport = (core: StandaloneEditorCore) => Rect | null;

/**
 * Check if the editor has focus now
 * @param core The StandaloneEditorCore object
 * @returns True if the editor has focus, otherwise false
 */
export type HasFocus = (core: StandaloneEditorCore) => boolean;

/**
 * Focus to editor. If there is a cached selection range, use it as current selection
 * @param core The StandaloneEditorCore object
 */
export type Focus = (core: StandaloneEditorCore) => void;

/**
 * Attach a DOM event to the editor content DIV
 * @param core The StandaloneEditorCore object
 * @param eventMap A map from event name to its handler
 */
export type AttachDomEvent = (
    core: StandaloneEditorCore,
    eventMap: Record<string, DOMEventRecord>
) => () => void;

/**
 * Restore an undo snapshot into editor
 * @param core The StandaloneEditorCore object
 * @param step Steps to move, can be 0, positive or negative
 */
export type RestoreUndoSnapshot = (core: StandaloneEditorCore, snapshot: Snapshot) => void;

/**
 * Paste into editor using a clipboardData object
 * @param core The StandaloneEditorCore object.
 * @param clipboardData Clipboard data retrieved from clipboard
 * @param pasteType Type of content to paste. @default normal
 */
export type Paste = (
    core: StandaloneEditorCore,
    clipboardData: ClipboardData,
    pasteType: PasteType
) => void;

/**
 * The interface for the map of core API for Content Model editor.
 * Editor can call call API from this map under StandaloneEditorCore object
 */
export interface StandaloneCoreApiMap {
    /**
     * Create a EditorContext object used by ContentModel API
     * @param core The StandaloneEditorCore object
     */
    createEditorContext: CreateEditorContext;

    /**
     * Create Content Model from DOM tree in this editor
     * @param core The StandaloneEditorCore object
     * @param option The option to customize the behavior of DOM to Content Model conversion
     */
    createContentModel: CreateContentModel;

    /**
     * Get current DOM selection from editor
     * @param core The StandaloneEditorCore object
     */
    getDOMSelection: GetDOMSelection;

    /**
     * Set content with content model
     * @param core The StandaloneEditorCore object
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     */
    setContentModel: SetContentModel;

    /**
     * Set current DOM selection from editor. This is the replacement of core API select
     * @param core The StandaloneEditorCore object
     * @param selection The selection to set
     * @param skipSelectionChangedEvent @param Pass true to skip triggering a SelectionChangedEvent
     */
    setDOMSelection: SetDOMSelection;

    /**
     * The general API to do format change with Content Model
     * It will grab a Content Model for current editor content, and invoke a callback function
     * to do format change. Then according to the return value, write back the modified content model into editor.
     * If there is cached model, it will be used and updated.
     * @param core The StandaloneEditorCore object
     * @param formatter Formatter function, see ContentModelFormatter
     * @param options More options, see FormatWithContentModelOptions
     */
    formatContentModel: FormatContentModel;

    /**
     * Switch the Shadow Edit mode of editor On/Off
     * @param core The StandaloneEditorCore object
     * @param isOn True to switch On, False to switch Off
     */
    switchShadowEdit: SwitchShadowEdit;

    /**
     * Retrieves the rect of the visible viewport of the editor.
     * @param core The StandaloneEditorCore object
     */
    getVisibleViewport: GetVisibleViewport;

    /**
     * Check if the editor has focus now
     * @param core The StandaloneEditorCore object
     * @returns True if the editor has focus, otherwise false
     */
    hasFocus: HasFocus;

    /**
     * Focus to editor. If there is a cached selection range, use it as current selection
     * @param core The StandaloneEditorCore object
     */
    focus: Focus;

    /**
     * Add an undo snapshot to current undo snapshot stack
     * @param core The StandaloneEditorCore object
     * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complete).
     * @param entityStates @optional Entity states related to this snapshot.
     * Each entity state will cause an EntityOperation event with operation = EntityOperation.UpdateEntityState
     * when undo/redo to this snapshot
     */
    addUndoSnapshot: AddUndoSnapshot;

    /**
     * Restore an undo snapshot into editor
     * @param core The editor core object
     * @param step Steps to move, can be 0, positive or negative
     */
    restoreUndoSnapshot: RestoreUndoSnapshot;

    /**
     * Attach a DOM event to the editor content DIV
     * @param core The StandaloneEditorCore object
     * @param eventMap A map from event name to its handler
     */
    attachDomEvent: AttachDomEvent;

    /**
     * Trigger a plugin event
     * @param core The StandaloneEditorCore object
     * @param pluginEvent The event object to trigger
     * @param broadcast Set to true to skip the shouldHandleEventExclusively check
     */
    triggerEvent: TriggerEvent;

    /**
     * Paste into editor using a clipboardData object
     * @param editor The editor to paste content into
     * @param clipboardData Clipboard data retrieved from clipboard
     * @param pasteType Type of content to paste. @default normal
     */
    paste: Paste;
}

/**
 * Represents the core data structure of a Content Model editor
 */
export interface StandaloneEditorCore extends PluginState {
    /**
     * The content DIV element of this editor
     */
    readonly contentDiv: HTMLDivElement;

    /**
     * Core API map of this editor
     */
    readonly api: StandaloneCoreApiMap;

    /**
     * Original API map of this editor. Overridden core API can use API from this map to call the original version of core API.
     */
    readonly originalApi: StandaloneCoreApiMap;

    /**
     * An array of editor plugins.
     */
    readonly plugins: EditorPlugin[];

    /**
     * Settings used by DOM to Content Model conversion
     */
    readonly domToModelSettings: ContentModelSettings<DomToModelOption, DomToModelSettings>;

    /**
     * Settings used by Content Model to DOM conversion
     */
    readonly modelToDomSettings: ContentModelSettings<ModelToDomOption, ModelToDomSettings>;

    /**
     * Editor running environment
     */
    readonly environment: EditorEnvironment;

    /**
     * Dark model handler for the editor, used for variable-based solution.
     * If keep it null, editor will still use original dataset-based dark mode solution.
     */
    readonly darkColorHandler: DarkColorHandler;

    /**
     * A handler to convert HTML string to a trust HTML string.
     * By default it will just return the original HTML string directly.
     * To override, pass your own trusted HTML handler to EditorOptions.trustedHTMLHandler
     */
    readonly trustedHTMLHandler: TrustedHTMLHandler;

    /**
     * A callback to be invoked when any exception is thrown during disposing editor
     * @param plugin The plugin that causes exception
     * @param error The error object we got
     */
    readonly disposeErrorHandler?: (plugin: EditorPlugin, error: Error) => void;

    /**
     * @deprecated Will be removed soon.
     * Current zoom scale, default value is 1
     * When editor is put under a zoomed container, need to pass the zoom scale number using this property
     * to let editor behave correctly especially for those mouse drag/drop behaviors
     */
    zoomScale: number;
}

/**
 * Default DOM and Content Model conversion settings for an editor
 */
export interface ContentModelSettings<OptionType, ConfigType> {
    /**
     * Built in options used by editor
     */
    builtIn: OptionType;

    /**
     * Customize options passed in from Editor Options, used for overwrite default option.
     * This will also be used by copy/paste
     */
    customized: OptionType;

    /**
     * Configuration calculated from default and customized options.
     * This is a cached object so that we don't need to cache it every time when we use Content Model
     */
    calculated: ConfigType;
}
