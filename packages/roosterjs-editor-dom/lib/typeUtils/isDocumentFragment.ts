import safeInstanceOf from './safeInstanceOf';

/**
 * Check if the given object is DocumentFragment
 * @param obj The object to check
 */
export default function isDocumentFragment(obj: any): obj is DocumentFragment {
    return safeInstanceOf(obj as Node, 'DocumentFragment');
}
