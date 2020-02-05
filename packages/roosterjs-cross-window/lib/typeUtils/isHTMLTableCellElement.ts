import safeInstanceOf from './safeInstanceOf';

/**
 * Check if the given object is HTMLTableCellElement
 * @param obj The object to check
 */
export default function isHTMLTableCellElement(obj: any): obj is HTMLTableCellElement {
    return safeInstanceOf(obj as Node, 'HTMLTableCellElement');
}
