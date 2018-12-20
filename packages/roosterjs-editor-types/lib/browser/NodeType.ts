/**
 * The is essentially an enum represents the type of the node
 * https://developer.mozilla.org/en-US/docs/Web/API/Node/nodeType
 * Values not listed here are deprecated.
 */
const enum NodeType {
    /**
     * An Element node such as <p> or <div>.
     */
    Element = 1,

    /**
     * The actual Text of Element or Attr.
     */
    Text = 3,

    /**
     * A ProcessingInstruction of an XML document such as <?xml-stylesheet ... ?> declaration.
     */
    ProcessingInstruction = 7,

    /**
     * A Comment node.
     */
    Comment = 8,

    /**
     * A Document node.
     */
    Document = 9,

    /**
     * A DocumentType node e.g. <!DOCTYPE html> for HTML5 documents.
     */
    DocumentType = 10,

    /**
     * A DocumentFragment node.
     */
    DocumentFragment = 11,
}

export default NodeType;
