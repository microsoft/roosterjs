import type { NodeType } from 'roosterjs-editor-types';

/**
 * A type map from node type number to its type declaration. This is used by utility function isNodeOfType()
 */
export interface NodeTypeMap {
    /**
     * Attribute node
     */
    [NodeType.Attribute]: Attr;

    /**
     * Comment node
     */
    [NodeType.Comment]: Comment;

    /**
     * DocumentFragment node
     */
    [NodeType.DocumentFragment]: DocumentFragment;

    /**
     * Document node
     */
    [NodeType.Document]: Document;

    /**
     * DocumentType node
     */
    [NodeType.DocumentType]: DocumentType;

    /**
     * HTMLElement node
     */
    [NodeType.Element]: HTMLElement;
    /**
     * ProcessingInstruction node
     */
    [NodeType.ProcessingInstruction]: ProcessingInstruction;

    /**
     * Text node
     */
    [NodeType.Text]: Text;
}

/**
 * Type checker for Node. Return true if it of the specified node type
 * @param node The node to check
 * @param expectedType The type to check
 */
export function isNodeOfType<T extends NodeType>(
    node: Node | null | undefined,
    expectedType: T
): node is NodeTypeMap[T] {
    return !!node && node.nodeType == expectedType;
}
