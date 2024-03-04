/**
 * A type map from node type number to its type declaration. This is used by utility function isNodeOfType()
 */
export interface NodeTypeMap {
    /**
     * Attribute node
     */
    ATTRIBUTE_NODE: Attr;

    /**
     * Comment node
     */
    COMMENT_NODE: Comment;

    /**
     * DocumentFragment node
     */
    DOCUMENT_FRAGMENT_NODE: DocumentFragment;

    /**
     * Document node
     */
    DOCUMENT_NODE: Document;

    /**
     * DocumentType node
     */
    DOCUMENT_TYPE_NODE: DocumentType;

    /**
     * HTMLElement node
     */
    ELEMENT_NODE: HTMLElement;

    /**
     * ProcessingInstruction node
     */
    PROCESSING_INSTRUCTION_NODE: ProcessingInstruction;

    /**
     * Text node
     */
    TEXT_NODE: Text;
}

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
