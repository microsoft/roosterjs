import cacheGetEventData from './cacheGetEventData';
import Editor from '../editor/Editor';
import { PluginEvent } from 'roosterjs-editor-types';

const CACHE_KEY_PREFIX = 'GET_ELEMENT_AT_CURSOR_';

/**
 * Get an HTML element at cursor from event cache if it exists.
 * If an selector is specified, return the nearest ancestor of current node
 * which matches the selector, or null if no match found in editor.
 * @param editor The editor instance
 * @param event Event object to get cached object from
 * @param selector The expected selector. If null, return the element at cursor
 * @returns The element at cursor or the nearest ancestor with the tag name is specified
 */
export default function cacheGetElementAtCursor(
    editor: Editor,
    event: PluginEvent,
    selector: string
): HTMLElement {
    return cacheGetEventData(event, CACHE_KEY_PREFIX + selector, () =>
        editor.getElementAtCursor(selector)
    );
}
