import { ContentModelEditorPlugin } from './ContentModelEditorPlugin';
import { ContentModelPluginEvent } from './event/ContentModelPluginEvent';
import { ContentModelPluginStates } from './pluginState/ContentModelPluginState';
import { DOMEventHandler } from './interface/domEventHandler';
import { TrustedHTMLHandler } from './callback/TrustedHTMLHandler';
import type {
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
    changeSource: string | null,
    canUndoByBackspace: boolean
    // additionalData?: ContentChangedData
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

    // /**
    //  * Create a DocumentFragment for paste from a ClipboardData
    //  * @param core The EditorCore object.
    //  * @param clipboardData Clipboard data retrieved from clipboard
    //  * @param position The position to paste to
    //  * @param pasteAsText True to force use plain text as the content to paste, false to choose HTML or Image if any
    //  * @param applyCurrentStyle True if apply format of current selection to the pasted content,
    //  * false to keep original format
    //  */
    // createPasteFragment: CreatePasteFragment;

    // /**
    //  * Ensure user will type into a container element rather than into the editor content DIV directly
    //  * @param core The EditorCore object.
    //  * @param position The position that user is about to type to
    //  * @param keyboardEvent Optional keyboard event object
    //  * @param deprecated Deprecated parameter, not used
    //  */
    // ensureTypeInContainer: EnsureTypeInContainer;

    // /**
    //  * Focus to editor. If there is a cached selection range, use it as current selection
    //  * @param core The EditorCore object
    //  */
    // focus: Focus;

    // /**
    //  * Get current editor content as HTML string
    //  * @param core The EditorCore object
    //  * @param mode specify what kind of HTML content to retrieve
    //  * @returns HTML string representing current editor content
    //  */
    // getContent: GetContent;

    // /**
    //  * Get current or cached selection range
    //  * @param core The EditorCore object
    //  * @param tryGetFromCache Set to true to retrieve the selection range from cache if editor doesn't own the focus now
    //  * @returns A Range object of the selection range
    //  */
    // getSelectionRange: GetSelectionRange;

    // /**
    //  * Get current or cached selection range
    //  * @param core The EditorCore object
    //  * @param tryGetFromCache Set to true to retrieve the selection range from cache if editor doesn't own the focus now
    //  * @returns A Range object of the selection range
    //  */
    // getSelectionRangeEx: GetSelectionRangeEx;

    // /**
    //  * Get style based format state from current selection, including font name/size and colors
    //  * @param core The EditorCore objects
    //  * @param node The node to get style from
    //  */
    // getStyleBasedFormatState: GetStyleBasedFormatState;

    // /**
    //  * Get the pendable format such as underline and bold
    //  * @param core The EditorCore object
    //  *@param forceGetStateFromDOM If set to true, will force get the format state from DOM tree.
    //  * @return The pending format state of editor.
    //  */
    // getPendableFormatState: GetPendableFormatState;

    // /**
    //  * Check if the editor has focus now
    //  * @param core The EditorCore object
    //  * @returns True if the editor has focus, otherwise false
    //  */
    // hasFocus: HasFocus;

    // /**
    //  * Insert a DOM node into editor content
    //  * @param core The EditorCore object. No op if null.
    //  * @param option An insert option object to specify how to insert the node
    //  */
    // insertNode: InsertNode;

    /**
     * Restore an undo snapshot into editor
     * @param core The editor core object
     * @param step Steps to move, can be 0, positive or negative
     */
    restoreUndoSnapshot: RestoreUndoSnapshot;

    // /**
    //  * Select content according to the given information.
    //  * There are a bunch of allowed combination of parameters. See IEditor.select for more details
    //  * @param core The editor core object
    //  * @param arg1 A DOM Range, or SelectionRangeEx, or NodePosition, or Node, or Selection Path
    //  * @param arg2 (optional) A NodePosition, or an offset number, or a PositionType, or a TableSelection, or null
    //  * @param arg3 (optional) A Node
    //  * @param arg4 (optional) An offset number, or a PositionType
    //  */
    // select: Select;

    // /**
    //  * Change the editor selection to the given range
    //  * @param core The EditorCore object
    //  * @param range The range to select
    //  * @param skipSameRange When set to true, do nothing if the given range is the same with current selection
    //  * in editor, otherwise it will always remove current selection range and set to the given one.
    //  * This parameter is always treated as true in Edge to avoid some weird runtime exception.
    //  */
    // selectRange: SelectRange;

    // /**
    //  * Set HTML content to this editor. All existing content will be replaced. A ContentChanged event will be triggered
    //  * if triggerContentChangedEvent is set to true
    //  * @param core The EditorCore object
    //  * @param content HTML content to set in
    //  * @param triggerContentChangedEvent True to trigger a ContentChanged event. Default value is true
    //  */
    // setContent: SetContent;

    /**
     * Switch the Shadow Edit mode of editor On/Off
     * @param core The EditorCore object
     * @param isOn True to switch On, False to switch Off
     */
    switchShadowEdit: SwitchShadowEdit;

    // /**
    //  * Edit and transform color of elements between light mode and dark mode
    //  * @param core The EditorCore object
    //  * @param rootNode The root HTML element to transform
    //  * @param includeSelf True to transform the root node as well, otherwise false
    //  * @param callback The callback function to invoke before do color transformation
    //  * @param direction To specify the transform direction, light to dark, or dark to light
    //  * @param forceTransform By default this function will only work when editor core is in dark mode.
    //  * Pass true to this value to force do color transformation even editor core is in light mode
    //  * @param fromDarkModel Whether the given content is already in dark mode
    //  */
    // transformColor: TransformColor;

    /**
     * Trigger a plugin event
     * @param core The EditorCore object
     * @param pluginEvent The event object to trigger
     * @param broadcast Set to true to skip the shouldHandleEventExclusively check
     */
    triggerEvent: TriggerEvent;

    // /**
    //  * Select a table and save data of the selected range
    //  * @param core The EditorCore object
    //  * @param table table to select
    //  * @param coordinates first and last cell of the selection, if this parameter is null, instead of
    //  * selecting, will unselect the table.
    //  * @param shouldAddStyles Whether need to update the style elements
    //  * @returns true if successful
    //  */
    // selectTable: SelectTable;

    // /**
    //  * Select a image and save data of the selected range
    //  * @param core The EditorCore object
    //  * @param image image to select
    //  * @param imageId the id of the image element
    //  * @returns true if successful
    //  */
    // selectImage: SelectImage;
}

/**
 * Represents the core data structure of a Content Model editor
 */
export interface ContentModelEditorCore extends ContentModelPluginStates {
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

    /**
     * The content DIV element of this editor
     */
    readonly contentDiv: HTMLDivElement;

    /**
     * An array of editor plugins.
     */
    readonly plugins: ContentModelEditorPlugin[];

    /**
     * A handler to convert HTML string to a trust HTML string.
     * By default it will just return the original HTML string directly.
     * To override, pass your own trusted HTML handler to EditorOptions.trustedHTMLHandler
     */
    readonly trustedHTMLHandler: TrustedHTMLHandler;

    // /*
    //  * Current zoom scale, default value is 1
    //  * When editor is put under a zoomed container, need to pass the zoom scale number using this property
    //  * to let editor behave correctly especially for those mouse drag/drop behaviors
    //  */
    // zoomScale: number;

    // /**
    //  * Retrieves the Visible Viewport of the editor.
    //  */
    // getVisibleViewport: () => Rect | null;

    // /**
    //  * Color of the border of a selectedImage. Default color: '#DB626C'
    //  */
    // imageSelectionBorderColor?: string;

    /**
     * Dark model handler for the editor, used for variable-based solution.
     * If keep it null, editor will still use original dataset-based dark mode solution.
     */
    darkColorHandler: DarkColorHandler;
}
