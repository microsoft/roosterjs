import safeInstanceOf from './safeInstanceOf';

/**
 * Check if the given object is HTMLElement
 * @param obj The object to check
 */
export default function isHTMLElement(obj: any): obj is HTMLElement {
    return safeInstanceOf(obj as Node, 'HTMLElement');
}
