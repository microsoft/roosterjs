import { CreateContentModel } from '../coreApi/CreateContentModel';
import { CreateEditorContext } from '../coreApi/CreateEditorContext';
import { GetDOMSelection } from '../coreApi/GetDOMSelection';
import { SetContentModel } from '../coreApi/SetContentModel';
import { SetDOMSelection } from '../coreApi/SetDOMSelection';
import { SwitchShadowEdit } from '../coreApi/SwitchShadowEdit';
import { TriggerEvent } from '../coreApi/TriggerEvent';

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
}
