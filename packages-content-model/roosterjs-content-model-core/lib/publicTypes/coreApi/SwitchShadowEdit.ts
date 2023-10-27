import type { EditorCore } from '../editor/EditorCore';

/**
 * Switch the Shadow Edit mode of editor On/Off
 * @param core The EditorCore object
 * @param isOn True to switch On, False to switch Off
 */
export type SwitchShadowEdit = (core: EditorCore, isOn: boolean) => void;
