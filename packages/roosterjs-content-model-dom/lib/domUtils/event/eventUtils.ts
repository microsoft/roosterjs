const CTRL_CHAR_CODE = 'Control';
const ALT_CHAR_CODE = 'Alt';
const META_CHAR_CODE = 'Meta';

const CursorMovingKeys = new Set<string>([
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'Home',
    'End',
    'PageUp',
    'PageDown',
]);

/**
 * Returns true when the event was fired from a modifier key, otherwise false
 * @param event The keyboard event object
 */
export function isModifierKey(event: KeyboardEvent): boolean {
    const isCtrlKey = event.ctrlKey || event.key === CTRL_CHAR_CODE;
    const isAltKey = event.altKey || event.key === ALT_CHAR_CODE;
    const isMetaKey = event.metaKey || event.key === META_CHAR_CODE;

    return isCtrlKey || isAltKey || isMetaKey;
}

/**
 * Returns true when the event was fired from a key that produces a character value, otherwise false
 * This detection is not 100% accurate. event.key is not fully supported by all browsers, and in some browsers (e.g. IE),
 * event.key is longer than 1 for num pad input. But here we just want to improve performance as much as possible.
 * So if we missed some case here it is still acceptable.
 * @param event The keyboard event object
 */
export function isCharacterValue(event: KeyboardEvent): boolean {
    return !isModifierKey(event) && !!event.key && event.key.length == 1;
}

/**
 * Returns true if the given event is a cursor moving event (Left, Right, Up, Down, Home, End, Page Up, Page Down).
 * This does not check modifier keys (Ctrl, Alt, Meta). So if there are modifier keys pressed, it can still return true if one of the modifier key is pressed
 * @param event The keyboard event to check
 */
export function isCursorMovingKey(event: KeyboardEvent): boolean {
    return CursorMovingKeys.has(event.key);
}
