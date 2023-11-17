import type {
    CompatibleColorTransformDirection,
    CompatibleGetContentMode,
} from 'roosterjs-editor-types/lib/compatibleTypes';
import type {
    ColorTransformDirection,
    ContentChangedData,
    ContentMetadata,
    DOMEventHandler,
    DarkColorHandler,
    EditorPlugin,
    GetContentMode,
    ImageSelectionRange,
    InsertOption,
    NodePosition,
    PluginEvent,
    PositionType,
    Rect,
    SelectionPath,
    SelectionRangeEx,
    StyleBasedFormatState,
    TableSelection,
    TableSelectionRange,
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
 */
export type SetDOMSelection = (core: StandaloneEditorCore, selection: DOMSelection) => void;

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
 * TODO: Remove this Core API and use setDOMSelection instead
 * Select content according to the given information.
 * There are a bunch of allowed combination of parameters. See IEditor.select for more details
 * @param core The editor core object
 * @param arg1 A DOM Range, or SelectionRangeEx, or NodePosition, or Node, or Selection Path
 * @param arg2 (optional) A NodePosition, or an offset number, or a PositionType, or a TableSelection, or null
 * @param arg3 (optional) A Node
 * @param arg4 (optional) An offset number, or a PositionType
 */
export type Select = (
    core: StandaloneEditorCore,
    arg1: Range | SelectionRangeEx | NodePosition | Node | SelectionPath | null,
    arg2?: NodePosition | number | PositionType | TableSelection | null,
    arg3?: Node,
    arg4?: number | PositionType
) => boolean;

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
 * Get current selection range
 * @param core The StandaloneEditorCore object
 * @returns A Range object of the selection range
 */
export type GetSelectionRangeEx = (core: StandaloneEditorCore) => SelectionRangeEx;

/**
 * Edit and transform color of elements between light mode and dark mode
 * @param core The StandaloneEditorCore object
 * @param rootNode The root HTML node to transform
 * @param includeSelf True to transform the root node as well, otherwise false
 * @param callback The callback function to invoke before do color transformation
 * @param direction To specify the transform direction, light to dark, or dark to light
 * @param forceTransform By default this function will only work when editor core is in dark mode.
 * Pass true to this value to force do color transformation even editor core is in light mode
 * @param fromDarkModel Whether the given content is already in dark mode
 */
export type TransformColor = (
    core: StandaloneEditorCore,
    rootNode: Node | null,
    includeSelf: boolean,
    callback: (() => void) | null,
    direction: ColorTransformDirection | CompatibleColorTransformDirection,
    forceTransform?: boolean,
    fromDarkMode?: boolean
) => void;

/**
 * Call an editing callback with adding undo snapshots around, and trigger a ContentChanged event if change source is specified.
 * Undo snapshot will not be added if this call is nested inside another addUndoSnapshot() call.
 * @param core The StandaloneEditorCore object
 * @param callback The editing callback, accepting current selection start and end position, returns an optional object used as the data field of ContentChangedEvent.
 * @param changeSource The ChangeSource string of ContentChangedEvent. @default ChangeSource.Format. Set to null to avoid triggering ContentChangedEvent
 * @param canUndoByBackspace True if this action can be undone when user press Backspace key (aka Auto Complete).
 * @param additionalData Optional parameter to provide additional data related to the ContentChanged Event.
 */
export type AddUndoSnapshot = (
    core: StandaloneEditorCore,
    callback: ((start: NodePosition | null, end: NodePosition | null) => any) | null,
    changeSource: string | null,
    canUndoByBackspace: boolean,
    additionalData?: ContentChangedData
) => void;

/**
 * Retrieves the rect of the visible viewport of the editor.
 * @param core The StandaloneEditorCore object
 */
export type GetVisibleViewport = (core: StandaloneEditorCore) => Rect | null;

/**
 * Change the editor selection to the given range
 * @param core The StandaloneEditorCore object
 * @param range The range to select
 * @param skipSameRange When set to true, do nothing if the given range is the same with current selection
 * in editor, otherwise it will always remove current selection range and set to the given one.
 * This parameter is always treated as true in Edge to avoid some weird runtime exception.
 */
export type SelectRange = (
    core: StandaloneEditorCore,
    range: Range,
    skipSameRange?: boolean
) => boolean;

/**
 * Select a table and save data of the selected range
 * @param core The StandaloneEditorCore object
 * @param image image to select
 * @returns true if successful
 */
export type SelectImage = (
    core: StandaloneEditorCore,
    image: HTMLImageElement | null
) => ImageSelectionRange | null;

/**
 * Select a table and save data of the selected range
 * @param core The StandaloneEditorCore object
 * @param table table to select
 * @param coordinates first and last cell of the selection, if this parameter is null, instead of
 * selecting, will unselect the table.
 * @returns true if successful
 */
export type SelectTable = (
    core: StandaloneEditorCore,
    table: HTMLTableElement | null,
    coordinates?: TableSelection
) => TableSelectionRange | null;

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
 * Get current or cached selection range
 * @param core The StandaloneEditorCore object
 * @param tryGetFromCache Set to true to retrieve the selection range from cache if editor doesn't own the focus now
 * @returns A Range object of the selection range
 */
export type GetSelectionRange = (
    core: StandaloneEditorCore,
    tryGetFromCache: boolean
) => Range | null;

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
    eventMap: Record<string, DOMEventHandler>
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
export type RestoreUndoSnapshot = (core: StandaloneEditorCore, step: number) => void;

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
}

/**
 * Temp interface
 * TODO: Port these core API
 */
export interface UnportedCoreApiMap {
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
     * Trigger a plugin event
     * @param core The StandaloneEditorCore object
     * @param pluginEvent The event object to trigger
     * @param broadcast Set to true to skip the shouldHandleEventExclusively check
     */
    triggerEvent: TriggerEvent;

    /**
     * Get current or cached selection range
     * @param core The StandaloneEditorCore object
     * @param tryGetFromCache Set to true to retrieve the selection range from cache if editor doesn't own the focus now
     * @returns A Range object of the selection range
     */
    getSelectionRangeEx: GetSelectionRangeEx;

    /**
     * Edit and transform color of elements between light mode and dark mode
     * @param core The StandaloneEditorCore object
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
     * Call an editing callback with adding undo snapshots around, and trigger a ContentChanged event if change source is specified.
     * Undo snapshot will not be added if this call is nested inside another addUndoSnapshot() call.
     * @param core The StandaloneEditorCore object
     * @param callback The editing callback, accepting current selection start and end position, returns an optional object used as the data field of ContentChangedEvent.
     * @param changeSource The ChangeSource string of ContentChangedEvent. @default ChangeSource.Format. Set to null to avoid triggering ContentChangedEvent
     * @param canUndoByBackspace True if this action can be undone when user presses Backspace key (aka Auto Complete).
     */
    addUndoSnapshot: AddUndoSnapshot;

    /**
     * Change the editor selection to the given range
     * @param core The StandaloneEditorCore object
     * @param range The range to select
     * @param skipSameRange When set to true, do nothing if the given range is the same with current selection
     * in editor, otherwise it will always remove current selection range and set to the given one.
     * This parameter is always treated as true in Edge to avoid some weird runtime exception.
     */
    selectRange: SelectRange;

    /**
     * Select a image and save data of the selected range
     * @param core The StandaloneEditorCore object
     * @param image image to select
     * @param imageId the id of the image element
     * @returns true if successful
     */
    selectImage: SelectImage;

    /**
     * Select a table and save data of the selected range
     * @param core The StandaloneEditorCore object
     * @param table table to select
     * @param coordinates first and last cell of the selection, if this parameter is null, instead of
     * selecting, will unselect the table.
     * @param shouldAddStyles Whether need to update the style elements
     * @returns true if successful
     */
    selectTable: SelectTable;

    /**
     * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
     * if triggerContentChangedEvent is set to true
     * @param core The StandaloneEditorCore object
     * @param content HTML content to set in
     * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
     */
    setContent: SetContent;

    /**
     * Get current or cached selection range
     * @param core The StandaloneEditorCore object
     * @param tryGetFromCache Set to true to retrieve the selection range from cache if editor doesn't own the focus now
     * @returns A Range object of the selection range
     */
    getSelectionRange: GetSelectionRange;

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
     * Insert a DOM node into editor content
     * @param core The StandaloneEditorCore object. No op if null.
     * @param option An insert option object to specify how to insert the node
     */
    insertNode: InsertNode;

    /**
     * Attach a DOM event to the editor content DIV
     * @param core The StandaloneEditorCore object
     * @param eventName The DOM event name
     * @param pluginEventType Optional event type. When specified, editor will trigger a plugin event with this name when the DOM event is triggered
     * @param beforeDispatch Optional callback function to be invoked when the DOM event is triggered before trigger plugin event
     */
    attachDomEvent: AttachDomEvent;

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
     * Restore an undo snapshot into editor
     * @param core The editor core object
     * @param step Steps to move, can be 0, positive or negative
     */
    restoreUndoSnapshot: RestoreUndoSnapshot;

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
     * Color of the border of a selectedImage. Default color: '#DB626C'
     */
    readonly imageSelectionBorderColor?: string;

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
