import { TriggerEvent } from './TriggerEvent';
import type { CreateContentModel } from './CreateContentModel';
import type { CreateEditorContext } from './CreateEditorContext';
import type { GetDOMSelection } from './GetDOMSelection';
import type { SetContentModel } from './SetContentModel';
import type { SetDOMSelection } from './SetDOMSelection';
import type { SwitchShadowEdit } from './SwitchShadowEdit';

/**
 * The interface for the map of core API for Content Model editor.
 * Editor can call call API from this map under EditorCore object
 */
export interface CoreApiMap {
    /**
     * Create a EditorContext object used by ContentModel API
     * @param core The EditorCore object
     */
    createEditorContext: CreateEditorContext;

    /**
     * Create Content Model from DOM tree in this editor
     * @param core The EditorCore object
     * @param option The option to customize the behavior of DOM to Content Model conversion
     */
    createContentModel: CreateContentModel;

    /**
     * Get current DOM selection from editor
     * @param core The EditorCore object
     * @param forceGetNewSelection True to force get a new range selection from editor UI, otherwise always try get from cache first
     */
    getDOMSelection: GetDOMSelection;

    /**
     * Set content with content model
     * @param core The EditorCore object
     * @param model The content model to set
     * @param option Additional options to customize the behavior of Content Model to DOM conversion
     */
    setContentModel: SetContentModel;

    /**
     * Set current DOM selection from editor. This is the replacement of core API select
     * @param core The EditorCore object
     * @param selection The selection to set
     */
    setDOMSelection: SetDOMSelection;

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
