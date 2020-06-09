import safeInstanceOf from './safeInstanceOf';

/**
 * Check if the given object is Range
 * @param obj The object to check
 */
export default function isRange(obj: any): obj is Range {
    return safeInstanceOf(obj as Node, 'Range');
}
