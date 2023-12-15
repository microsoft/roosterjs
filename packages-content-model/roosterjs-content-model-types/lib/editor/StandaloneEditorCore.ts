import type { DOMEventRecord } from '../parameter/DOMEventRecord';
import type { Snapshot } from '../parameter/Snapshot';
import type { EntityState } from '../parameter/FormatWithContentModelContext';
import type { CompatibleGetContentMode } from 'roosterjs-editor-types/lib/compatibleTypes';
import type {
    ContentMetadata,
    DarkColorHandler,
    EditorPlugin,
    GetContentMode,
    InsertOption,
    NodePosition,
    PluginEvent,
    Rect,
    StyleBasedFormatState,
    TrustedHTMLHandler,
} from 'roosterjs-editor-types';
import type { ContentModelDocument } from '../group/ContentModelDocument';
import type {
    StandaloneEditorCorePluginState,
    UnportedCorePluginState,
} from '../pluginState/StandaloneEditorPluginState';
import type { DOMSelection } from '../selection/DOMSelection';
import type { DomToModelOption } from '../context/DomToModelOption';
import type { DomToModelSettings } from '../context/DomToModelSettings';
import type { EditorContext } from '../context/EditorContext';
import type { EditorEnvironment } from '../parameter/EditorEnvironment';
import type { ModelToDomOption } from '../context/ModelToDomOption';
import type { ModelToDomSettings, OnNodeCreated } from '../context/ModelToDomSettings';
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
 * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
 * if triggerContentChangedEvent is set to true
 * @param core The StandaloneEditorCore object
 * @param content HTML content to set in
 * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
 */
export type SetContent = (
    core: StandaloneEditorCore,
    content: string,
    triggerContentChangedEvent: boolean,
    metadata?: ContentMetadata
) => void;

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
 * Insert a DOM node into editor content
 * @param core The StandaloneEditorCore object. No op if null.
 * @param option An insert option object to specify how to insert the node
 */
export type InsertNode = (
    core: StandaloneEditorCore,
    node: Node,
    option: InsertOption | null
) => boolean;

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
 * Get current editor content as HTML string
 * @param core The StandaloneEditorCore object
 * @param mode specify what kind of HTML content to retrieve
 * @returns HTML string representing current editor content
 */
export type GetContent = (
    core: StandaloneEditorCore,
    mode: GetContentMode | CompatibleGetContentMode
) => string;

/**
 * Get style based format state from current selection, including font name/size and colors
 * @param core The StandaloneEditorCore objects
 * @param node The node to get style from
 */
export type GetStyleBasedFormatState = (
    core: StandaloneEditorCore,
    node: Node | null
) => StyleBasedFormatState;

/**
 * Restore an undo snapshot into editor
 * @param core The StandaloneEditorCore object
 * @param step Steps to move, can be 0, positive or negative
 */
export type RestoreUndoSnapshot = (core: StandaloneEditorCore, snapshot: Snapshot) => void;

/**
 * Ensure user will type into a container element rather than into the editor content DIV directly
 * @param core The StandaloneEditorCore object.
 * @param position The position that user is about to type to
 * @param keyboardEvent Optional keyboard event object
 * @param deprecated Deprecated parameter, not used
 */
export type EnsureTypeInContainer = (
    core: StandaloneEditorCore,
    position: NodePosition,
    keyboardEvent?: KeyboardEvent,
    deprecated?: boolean
) => void;

/**
 * Temp interface
 * TODO: Port other core API
 */
export interface PortedCoreApiMap {
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
}

/**
 * Temp interface
 * TODO: Port these core API
 */
export interface UnportedCoreApiMap {
    /**
     * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
     * if triggerContentChangedEvent is set to true
     * @param core The StandaloneEditorCore object
     * @param content HTML content to set in
     * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
     */
    setContent: SetContent;

    /**
     * Insert a DOM node into editor content
     * @param core The StandaloneEditorCore object. No op if null.
     * @param option An insert option object to specify how to insert the node
     */
    insertNode: InsertNode;

    /**
     * Get current editor content as HTML string
     * @param core The StandaloneEditorCore object
     * @param mode specify what kind of HTML content to retrieve
     * @returns HTML string representing current editor content
     */
    getContent: GetContent;

    /**
     * Get style based format state from current selection, including font name/size and colors
     * @param core The StandaloneEditorCore objects
     * @param node The node to get style from
     */
    getStyleBasedFormatState: GetStyleBasedFormatState;

    /**
     * Ensure user will type into a container element rather than into the editor content DIV directly
     * @param core The EditorCore object.
     * @param position The position that user is about to type to
     * @param keyboardEvent Optional keyboard event object
     * @param deprecated Deprecated parameter, not used
     */
    ensureTypeInContainer: EnsureTypeInContainer;
}

/**
 * The interface for the map of core API for Content Model editor.
 * Editor can call call API from this map under StandaloneEditorCore object
 */
export interface StandaloneCoreApiMap extends PortedCoreApiMap, UnportedCoreApiMap {}

/**
 * Represents the core data structure of a Content Model editor
 */
export interface StandaloneEditorCore
    extends StandaloneEditorCorePluginState,
        UnportedCorePluginState,
        StandaloneEditorDefaultSettings {
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
}

/**
 * Default DOM and Content Model conversion settings for an editor
 */
export interface StandaloneEditorDefaultSettings {
    /**
     * Default DOM to Content Model options
     */
    defaultDomToModelOptions: (DomToModelOption | undefined)[];

    /**
     * Default Content Model to DOM options
     */
    defaultModelToDomOptions: (ModelToDomOption | undefined)[];

    /**
     * Default DOM to Content Model config, calculated from defaultDomToModelOptions,
     * will be used for creating content model if there is no other customized options
     */
    defaultDomToModelConfig: DomToModelSettings;

    /**
     * Default Content Model to DOM config, calculated from defaultModelToDomOptions,
     * will be used for setting content model if there is no other customized options
     */
    defaultModelToDomConfig: ModelToDomSettings;
}
