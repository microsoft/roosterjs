import safeInstanceOf from './safeInstanceOf';

/**
 * Check if the given object is HTMLTableElement
 * @param obj The object to check
 */
export default function isHTMLTableElement(obj: any): obj is HTMLTableElement {
    return safeInstanceOf(obj as Node, 'HTMLTableElement');
}
