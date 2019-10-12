import { Browser } from 'roosterjs-editor-dom';

/**
 * Check if Ctrl key (Windows) or Meta key (Mac) is pressed for the given Event
 * @param event A Keyboard event or Mouse event object
 * @returns True if Ctrl key is pressed on Windows or Meta key is pressed on Mac
 */
const isCtrlOrMetaPressed: (event: KeyboardEvent | MouseEvent) => boolean = Browser.isMac
    ? event => event.metaKey
    : event => event.ctrlKey;
export default isCtrlOrMetaPressed;
