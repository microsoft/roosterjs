import { CreateContentModel } from './CreateContentModel';
import { CreateEditorContext } from './CreateEditorContext';
import { GetDOMSelection } from './GetDOMSelection';
import { SetContentModel } from './SetContentModel';
import { SetDOMSelection } from './SetDOMSelection';
import { SwitchShadowEdit } from './SwitchShadowEdit';

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
     * Switch the Shadow Edit mode of editor On/Off
     * @param core The EditorCore object
     * @param isOn True to switch On, False to switch Off
     */
    switchShadowEdit: SwitchShadowEdit;
}
