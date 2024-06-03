import { INHERITABLE_PROPERTIES } from 'roosterjs-editor-types';
import type { StringMap } from 'roosterjs-editor-types';

/**
 * Get inheritable CSS style values from the given element
 * @param element The element to get style from
 */
export default function getInheritableStyles(element: HTMLElement | null): StringMap {
    const win = element && element.ownerDocument && element.ownerDocument.defaultView;
    const styles = win && element && win.getComputedStyle(element);
    const result: StringMap = {};
    INHERITABLE_PROPERTIES.forEach(
        name => (result[name] = (styles && styles.getPropertyValue(name)) || '')
    );
    return result;
}
