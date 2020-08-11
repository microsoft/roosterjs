import safeInstanceOf from './safeInstanceOf';

/**
 * Check if the given object is Node
 * @param obj The object to check
 */
export default function isNode(obj: any): obj is Node {
    return safeInstanceOf(obj as Node, 'Node');
}
