import type { CoreEditorCore } from '../editor/CoreEditorCore';

/**
 * Switch the Shadow Edit mode of editor On/Off
 * @param core The CoreEditorCore object
 * @param isOn True to switch On, False to switch Off
 */
export type SwitchShadowEdit = (core: CoreEditorCore, isOn: boolean) => void;
