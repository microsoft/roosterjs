import { ChangeSource, ContentChangedData } from './event/ContentModelContentChangedEvent';
import { ContentModelEditorPlugin } from './ContentModelEditorPlugin';
import { ContentModelPluginEvent } from './event/ContentModelPluginEvent';
import { ContentModelPluginState } from './ContentModelCorePlugins';
import { PluginEventType } from './event/PluginEventType';
import type { EditorEnvironment } from './IContentModelEditor';
import type {
    ColorManager,
    ContentModelDocument,
    DOMSelection,
    DomToModelOption,
    DomToModelSettings,
    EditorContext,
    ModelToDomOption,
    ModelToDomSettings,
    OnNodeCreated,
} from 'roosterjs-content-model-types';

/**
 * A handler type to convert HTML string to a trust HTML string
 */
export type TrustedHTMLHandler = (html: string) => string;

/**
 * Handler function type of DOM event
 */
export type DOMEventHandlerFunction<E = Event> = (event: E) => void;

/**
 * DOM event handler object with mapped plugin event type and handler function
 */
export interface DOMEventHandlerObject {
    /**
     * Type of plugin event. The DOM event will be mapped with this plugin event type
     */
    pluginEventType: PluginEventType | null;

    /**
     * Handler function. Besides the mapped plugin event type, this function will also be triggered
     * when correlated DOM event is fired
     */
    beforeDispatch: DOMEventHandlerFunction | null;
}

/**
 * Combined event handler type with all 3 possibilities
 */
export type DOMEventHandler<E = Event> =
    | PluginEventType
    | DOMEventHandlerFunction<E>
    | DOMEventHandlerObject;

/**
 * Create a EditorContext object used by ContentModel API
 * @param core The ContentModelEditorCore object
 */
export type CreateEditorContext = (core: ContentModelEditorCore) => EditorContext;

/**
 * Create Content Model from DOM tree in this editor
 * @param core The ContentModelEditorCore object
 * @param option The option to customize the behavior of DOM to Content Model conversion
 * @param selectionOverride When passed, use this selection range instead of current selection in editor
 */
export type CreateContentModel = (
    core: ContentModelEditorCore,
    option?: DomToModelOption,
    selectionOverride?: DOMSelection
) => ContentModelDocument;

/**
 * Get current DOM selection from editor
 * @param core The ContentModelEditorCore object
 */
export type GetDOMSelection = (core: ContentModelEditorCore) => DOMSelection | null;

/**
 * Set content with content model. This is the replacement of core API getSelectionRangeEx
 * @param core The ContentModelEditorCore object
 * @param model The content model to set
 * @param option Additional options to customize the behavior of Content Model to DOM conversion
 * @param onNodeCreated An optional callback that will be called when a DOM node is created
 */
export type SetContentModel = (
    core: ContentModelEditorCore,
    model: ContentModelDocument,
    option?: ModelToDomOption,
    onNodeCreated?: OnNodeCreated
) => DOMSelection | null;

/**
 * Set current DOM selection from editor. This is the replacement of core API select
 * @param core The ContentModelEditorCore object
 * @param selection The selection to set
 */
export type SetDOMSelection = (core: ContentModelEditorCore, selection: DOMSelection) => void;

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
    core: ContentModelEditorCore,
    callback: (() => any) | null,
    changeSource: ChangeSource | string | null,
    canUndoByBackspace: boolean,
    additionalData?: ContentChangedData
) => void;

/**
 * Attach a DOM event to the editor content DIV
 * @param core The EditorCore object
 * @param eventMap A map from event name to its handler
 */
export type AttachDomEvent = (
    core: ContentModelEditorCore,
    eventMap: Record<string, DOMEventHandler>
) => () => void;

/**
 * Focus to editor. If there is a cached selection range, use it as current selection
 * @param core The EditorCore object
 */
export type Focus = (core: ContentModelEditorCore) => void;

/**
 * Check if the editor has focus now
 * @param core The EditorCore object
 * @returns True if the editor has focus, otherwise false
 */
export type HasFocus = (core: ContentModelEditorCore) => boolean;

/**
 * Restore an undo snapshot into editor
 * @param core The editor core object
 * @param step Steps to move, can be 0, positive or negative
 */
export type RestoreUndoSnapshot = (core: ContentModelEditorCore, step: number) => void;

/**
 * Switch the Shadow Edit mode of editor On/Off
 * @param core The EditorCore object
 * @param isOn True to switch On, False to switch Off
 */
export type SwitchShadowEdit = (core: ContentModelEditorCore, isOn: boolean) => void;

/**
 * Trigger a plugin event
 * @param core The EditorCore object
 * @param pluginEvent The event object to trigger
 * @param broadcast Set to true to skip the shouldHandleEventExclusively check
 */
export type TriggerEvent = (
    core: ContentModelEditorCore,
    pluginEvent: ContentModelPluginEvent,
    broadcast: boolean
) => void;

/**
 * The interface for the map of core API for Content Model editor.
 * Editor can call call API from this map under ContentModelEditorCore object
 */
export interface ContentModelCoreApiMap {
    /**
     * Create a EditorContext object used by ContentModel API
     * @param core The ContentModelEditorCore object
     */
    createEditorContext: CreateEditorContext;

    /**
     * Create Content Model from DOM tree in this editor
     * @param core The ContentModelEditorCore object
     * @param option The option to customize the behavior of DOM to Content Model conversion
     */
    createContentModel: CreateContentModel;

    /**
     * Get current DOM selection from editor
     * @param core The ContentModelEditorCore object
     */
    getDOMSelection: GetDOMSelection;

    /**
     * Set content with content model
     * @param core The ContentModelEditorCore object
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     */
    setContentModel: SetContentModel;

    /**
     * Set current DOM selection from editor. This is the replacement of core API select
     * @param core The ContentModelEditorCore object
     * @param selection The selection to set
     */
    setDOMSelection: SetDOMSelection;

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
     * Focus to editor. If there is a cached selection range, use it as current selection
     * @param core The EditorCore object
     */
    focus: Focus;

    /**
     * Check if the editor has focus now
     * @param core The EditorCore object
     * @returns True if the editor has focus, otherwise false
     */
    hasFocus: HasFocus;

    /**
     * Restore an undo snapshot into editor
     * @param core The editor core object
     * @param step Steps to move, can be 0, positive or negative
     */
    restoreUndoSnapshot: RestoreUndoSnapshot;

    /**
     * Switch the Shadow Edit mode of editor On/Off
     * @param core The EditorCore object
     * @param isOn True to switch On, False to switch Off
     */
    switchShadowEdit: SwitchShadowEdit;

    /**
     * Trigger a plugin event
     * @param core The EditorCore object
     * @param pluginEvent The event object to trigger
     * @param broadcast Set to true to skip the shouldHandleEventExclusively check
     */
    triggerEvent: TriggerEvent;
}

/**
 * Represents the core data structure of a Content Model editor
 */
export interface ContentModelEditorCore extends ContentModelPluginState {
    /**
     * The content DIV element of this editor
     */
    readonly contentDiv: HTMLDivElement;

    /**
     * An array of editor plugins.
     */
    readonly plugins: ContentModelEditorPlugin[];

    /**
     * Core API map of this editor
     */
    readonly api: ContentModelCoreApiMap;

    /**
     * Original API map of this editor. Overridden core API can use API from this map to call the original version of core API.
     */
    readonly originalApi: ContentModelCoreApiMap;

    /**
     * Default DOM to Content Model options
     */
    readonly defaultDomToModelOptions: (DomToModelOption | undefined)[];

    /**
     * Default Content Model to DOM options
     */
    readonly defaultModelToDomOptions: (ModelToDomOption | undefined)[];

    /**
     * Default DOM to Content Model config, calculated from defaultDomToModelOptions,
     * will be used for creating content model if there is no other customized options
     */
    readonly defaultDomToModelConfig: DomToModelSettings;

    /**
     * Default Content Model to DOM config, calculated from defaultModelToDomOptions,
     * will be used for setting content model if there is no other customized options
     */
    readonly defaultModelToDomConfig: ModelToDomSettings;

    /**
     * Editor running environment
     */
    readonly environment: EditorEnvironment;

    /**
     * A handler to convert HTML string to a trust HTML string.
     * By default it will just return the original HTML string directly.
     * To override, pass your own trusted HTML handler to EditorOptions.trustedHTMLHandler
     */
    readonly trustedHTMLHandler: TrustedHTMLHandler;

    /**
     * Dark model handler for the editor, used for variable-based solution.
     * If keep it null, editor will still use original dataset-based dark mode solution.
     */
    readonly darkColorHandler: ColorManager;

    /**
     * A callback to be invoked when any exception is thrown during disposing editor
     * @param plugin The plugin that causes exception
     * @param error The error object we got
     */
    readonly disposeErrorHandler?: (plugin: ContentModelEditorPlugin, error: Error) => void;
}
