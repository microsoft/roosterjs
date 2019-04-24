const CTRL_CHARCODE = 'Control';
const ALT_CHARCODE = 'Alt';
const META_CHARCODE = 'Meta';

// Returns true when the event was fired from a modifier key, otherwise false
export default function isModifierKey(event: KeyboardEvent): boolean {
    const isCtrlKey = event.ctrlKey || event.key === CTRL_CHARCODE;
    const isAltKey = event.altKey || event.key === ALT_CHARCODE;
    const isMetaKey = event.metaKey || event.key === META_CHARCODE;

    return isCtrlKey || isAltKey || isMetaKey;
}
