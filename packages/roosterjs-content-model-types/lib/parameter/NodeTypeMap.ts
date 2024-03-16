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
