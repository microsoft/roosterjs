import { NodeType } from 'roosterjs-editor-types';

/**
 * @internal
 */
export interface NodeTypeMap {
    [NodeType.Attribute]: Attr;
    [NodeType.Comment]: Comment;
    [NodeType.DocumentFragment]: DocumentFragment;
    [NodeType.Document]: Document;
    [NodeType.DocumentType]: DocumentType;
    [NodeType.Element]: HTMLElement;
    [NodeType.ProcessingInstruction]: ProcessingInstruction;
    [NodeType.Text]: Text;
}

/**
 * @internal
 */
export function isNodeOfType<T extends NodeType>(
    node: Node | null | undefined,
    expectedType: T
): node is NodeTypeMap[T] {
    return !!node && node.nodeType == expectedType;
}
