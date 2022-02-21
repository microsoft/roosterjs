import isModifierKey from './isModifierKey';

/**
 * Returns true when the event was fired from a key that produces a character value, otherwise false
 * This detection is not 100% accurate. event.key is not fully supported by all browsers, and in some browsers (e.g. IE),
 * event.key is longer than 1 for num pad input. But here we just want to improve performance as much as possible.
 * So if we missed some case here it is still acceptable.
 * @param event The keyboard event object
 */
export default function isCharacterValue(event: KeyboardEvent): boolean {
    return !isModifierKey(event) && !!event.key && event.key.length == 1;
}
