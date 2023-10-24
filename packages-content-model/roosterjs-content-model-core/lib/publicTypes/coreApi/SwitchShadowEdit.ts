import { ContentModelEditorCore } from '../editor/ContentModelEditorCore';

/**
 * Switch the Shadow Edit mode of editor On/Off
 * @param core The EditorCore object
 * @param isOn True to switch On, False to switch Off
 */
export type SwitchShadowEdit = (core: ContentModelEditorCore, isOn: boolean) => void;
