import { TransformColor } from '../coreApi/TransformColor';
import type { AddUndoSnapshot } from '../coreApi/AddUndoSnapshot';
import type { AttachDomEvent } from '../coreApi/AttachDomEvent';
import type { CreateContentModel } from '../coreApi/CreateContentModel';
import type { CreateEditorContext } from '../coreApi/CreateEditorContext';
import type { Focus } from '../coreApi/Focus';
import type { GetDOMSelection } from '../coreApi/GetDOMSelection';
import type { HasFocus } from '../coreApi/HasFocus';
import type { RestoreUndoSnapshot } from '../coreApi/RestoreUndoSnapshot';
import type { SetContentModel } from '../coreApi/SetContentModel';
import type { SetDOMSelection } from '../coreApi/SetDOMSelection';
import type { SwitchShadowEdit } from '../coreApi/SwitchShadowEdit';
import type { TriggerEvent } from '../coreApi/TriggerEvent';

/**
 * @internal
 * The interface for the map of core API.
 * Editor can call call API from this map under EditorCore object
 */
export interface CoreEditorApiMap {
    /**
     * Create Content Model from DOM tree in this editor
     * @param core The CoreEditorCore object
     * @param option The option to customize the behavior of DOM to Content Model conversion
     */
    createContentModel: CreateContentModel;

    /**
     * Create a EditorContext object used by ContentModel API
     * @param core The CoreEditorCore object
     */
    createEditorContext: CreateEditorContext;

    /**
     * Get current DOM selection from editor
     * @param core The CoreEditorCore object
     */
    getDOMSelection: GetDOMSelection;

    /**
     * Set content with content model
     * @param core The CoreEditorCore object
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     */
    setContentModel: SetContentModel;

    /**
     * Set current DOM selection from editor. This is the replacement of core API select
     * @param core The CoreEditorCore object
     * @param selection The selection to set
     */
    setDOMSelection: SetDOMSelection;

    /**
     * Switch the Shadow Edit mode of editor On/Off
     * @param core The CoreEditorCore object
     * @param isOn True to switch On, False to switch Off
     */
    switchShadowEdit: SwitchShadowEdit;

    /**
     * Trigger a plugin event
     * @param core The CoreEditorCore object
     * @param pluginEvent The event object to trigger
     * @param broadcast Set to true to skip the shouldHandleEventExclusively check
     */
    triggerEvent: TriggerEvent;

    /**
     * Call an editing callback with adding undo snapshots around, and trigger a ContentChanged event if change source is specified.
     * Undo snapshot will not be added if this call is nested inside another addUndoSnapshot() call.
     * @param core The CoreEditorCore object
     * @param callback The editing callback, accepting current selection start and end position, returns an optional object used as the data field of ContentChangedEvent.
     * @param changeSource The ChangeSource string of ContentChangedEvent. @default ChangeSource.Format. Set to null to avoid triggering ContentChangedEvent
     * @param canUndoByBackspace True if this action can be undone when user presses Backspace key (aka Auto Complete).
     */
    addUndoSnapshot: AddUndoSnapshot;

    /**
     * Attach a DOM event to the editor content DIV
     * @param core The CoreEditorCore object
     * @param eventName The DOM event name
     * @param pluginEventType Optional event type. When specified, editor will trigger a plugin event with this name when the DOM event is triggered
     * @param beforeDispatch Optional callback function to be invoked when the DOM event is triggered before trigger plugin event
     */
    attachDomEvent: AttachDomEvent;

    /**
     * Focus to editor. If there is a cached selection range, use it as current selection
     * @param core The CoreEditorCore object
     */
    focus: Focus;

    /**
     * Check if the editor has focus now
     * @param core The CoreEditorCore object
     * @returns True if the editor has focus, otherwise false
     */
    hasFocus: HasFocus;

    /**
     * Restore an undo snapshot into editor
     * @param core The CoreEditorCore object
     * @param step Steps to move, can be 0, positive or negative
     */
    restoreUndoSnapshot: RestoreUndoSnapshot;

    /**
     * Edit and transform color of elements between light mode and dark mode
     * @param core The CoreEditorCore object
     * @param rootNode The root HTML node to transform
     * @param includeSelf True to transform the root node as well, otherwise false
     * @param toDark To specify the transform direction, true means light to dark, false means dark to light
     */
    transformColor: TransformColor;
}
