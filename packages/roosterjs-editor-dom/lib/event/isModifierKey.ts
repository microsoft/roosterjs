const CTRL_CHAR_CODE = 'Control';
const ALT_CHAR_CODE = 'Alt';
const META_CHAR_CODE = 'Meta';

/**
 * Returns true when the event was fired from a modifier key, otherwise false
 * @param event The keyboard event object
 */
export default function isModifierKey(event: KeyboardEvent): boolean {
    const isCtrlKey = event.ctrlKey || event.key === CTRL_CHAR_CODE;
    const isAltKey = event.altKey || event.key === ALT_CHAR_CODE;
    const isMetaKey = event.metaKey || event.key === META_CHAR_CODE;

    return isCtrlKey || isAltKey || isMetaKey;
}
