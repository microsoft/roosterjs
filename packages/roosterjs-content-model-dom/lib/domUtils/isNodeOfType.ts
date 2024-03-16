import type { NodeTypeMap } from 'roosterjs-content-model-types';

/**
 * Type checker for Node. Return true if it of the specified node type
 * @param node The node to check
 * @param expectedType The type to check
 */
export function isNodeOfType<T extends keyof NodeTypeMap>(
    node: Node | null | undefined,
    expectedType: T
): node is NodeTypeMap[T] {
    return !!node && node.nodeType == Node[expectedType];
}
