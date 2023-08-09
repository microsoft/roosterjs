import { EditorPlugin2 } from './EditorPlugin2';
import { PluginEvent2 } from './PluginEvent2';
import {
    ChangeSource,
    ContentChangedData,
    DarkColorHandler,
    NodePosition,
    PositionType,
    SelectionPath,
    SelectionRangeEx,
    TableSelection,
} from 'roosterjs-editor-types';
import {
    ContentModelDocument,
    ContentModelSegmentFormat,
    DomToModelOption,
    EditorContext,
    ModelToDomOption,
} from 'roosterjs-content-model-types';

/**
 * Create a EditorContext object used by ContentModel API
 * @param core The ContentModelEditorCore object
 */
export type CreateEditorContext = (core: ContentModelEditor2Core) => EditorContext;

/**
 * Create Content Model from DOM tree in this editor
 * @param core The ContentModelEditorCore object
 * @param option The option to customize the behavior of DOM to Content Model conversion
 */
export type CreateContentModel = (
    core: ContentModelEditor2Core,
    option?: DomToModelOption
) => ContentModelDocument;

/**
 * Set content with content model
 * @param core The ContentModelEditorCore object
 * @param model The content model to set
 * @param option Additional options to customize the behavior of Content Model to DOM conversion
 */
export type SetContentModel = (
    core: ContentModelEditor2Core,
    model: ContentModelDocument,
    option?: ModelToDomOption
) => void;

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
    core: ContentModelEditor2Core,
    callback: ((start: NodePosition | null, end: NodePosition | null) => any) | null,
    changeSource: ChangeSource | string | null,
    canUndoByBackspace: boolean,
    additionalData?: ContentChangedData
) => void;

/**
 * Focus to editor. If there is a cached selection range, use it as current selection
 * @param core The EditorCore object
 */
export type Focus = (core: ContentModelEditor2Core) => void;

/**
 * Get current selection range
 * @param core The EditorCore object
 * @returns A Range object of the selection range
 */
export type GetSelectionRangeEx = (core: ContentModelEditor2Core) => SelectionRangeEx;

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
    core: ContentModelEditor2Core,
    arg1: Range | SelectionRangeEx | NodePosition | Node | SelectionPath | null,
    arg2?: NodePosition | number | PositionType | TableSelection | null,
    arg3?: Node,
    arg4?: number | PositionType
) => boolean;

/**
 * Trigger a plugin event
 * @param core The EditorCore object
 * @param pluginEvent The event object to trigger
 * @param broadcast Set to true to skip the shouldHandleEventExclusively check
 */
export type TriggerEvent = (
    core: ContentModelEditor2Core,
    pluginEvent: PluginEvent2,
    broadcast: boolean
) => void;

export interface ContentModelEditor2CoreApi {
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
     * Focus to editor. If there is a cached selection range, use it as current selection
     * @param core The EditorCore object
     */
    focus: Focus;

    /**
     * Get current or cached selection range
     * @param core The EditorCore object
     * @param tryGetFromCache Set to true to retrieve the selection range from cache if editor doesn't own the focus now
     * @returns A Range object of the selection range
     */
    getSelectionRangeEx: GetSelectionRangeEx;

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
     * @param core The EditorCore object
     * @param pluginEvent The event object to trigger
     * @param broadcast Set to true to skip the shouldHandleEventExclusively check
     */
    triggerEvent: TriggerEvent;

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
     * Set content with content model
     * @param core The ContentModelEditorCore object
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     */
    setContentModel: SetContentModel;
}

export interface ContentModelEditor2Core {
    /**
     * The content DIV element of this editor
     */
    readonly contentDiv: HTMLDivElement;

    /**
     * Core API map of this editor
     */
    api: ContentModelEditor2CoreApi;

    /**
     * When reuse Content Model is allowed, we cache the Content Model object here after created
     */
    cachedModel?: ContentModelDocument;

    /**
     * Cached selection range ex. This range only exist when cached model exists and it has selection
     */
    cachedRangeEx?: SelectionRangeEx;

    /**
     * Default DOM to Content Model options
     */
    defaultDomToModelOptions: DomToModelOption;

    /**
     * Default Content Model to DOM options
     */
    defaultModelToDomOptions: ModelToDomOption;

    /**
     * Default format used by Content Model. This is calculated from lifecycle.defaultFormat
     */
    defaultFormat: ContentModelSegmentFormat;

    /**
     * Dark model handler for the editor, used for variable-based solution.
     * If keep it null, editor will still use original dataset-based dark mode solution.
     */
    darkColorHandler: DarkColorHandler;

    isInShadowEdit?: boolean;

    plugins: EditorPlugin2[];
}
