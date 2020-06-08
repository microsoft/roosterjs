import safeInstanceOf from './safeInstanceOf';

/**
 * Check if the given object is HTMLOListElement
 * @param obj The object to check
 */
export default function isHTMLOListElement(obj: any): obj is HTMLOListElement {
    return safeInstanceOf(obj as Node, 'HTMLOListElement');
}
