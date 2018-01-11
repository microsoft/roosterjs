import { EditorPoint, NodeBoundary, NodeType } from 'roosterjs-editor-types';

// The browser returned point (StartContainer/EndContainer as in Selection range) can be a container with offset pointing to a child
// in the container. This is bad when we do point to point comparison. This function normalizes to the point to closest leaf node.
// End goal of normalization:
// 1) The editor point has a container points to a leaf node (it can be a text node, or an element that has 0 child
// 2) offet of the new editor point means:
// offset = NodeBoundary.Begin: begin of the node
// offset = NodeBoundary.End: end of node for non-textual node (leaf element type node)
// offset = offset into text node: text node
export default function normalizeEditorPoint(container: Node, offset: number): EditorPoint {
    let childCount: number;
    while (
        container.nodeType == NodeType.Element &&
        (childCount = container.childNodes.length) > 0
    ) {
        let isAtEnd = offset >= childCount;
        let childContainer = isAtEnd ? container.lastChild : container.childNodes[offset];
        if (childContainer.nodeType == NodeType.Element) {
            container = childContainer;
            offset = isAtEnd
                ? Math.max(childContainer.childNodes.length, NodeBoundary.End)
                : NodeBoundary.Begin;
        } else if (childContainer.nodeType == NodeType.Text) {
            container = childContainer;
            offset = isAtEnd ? (<Text>childContainer).data.length : NodeBoundary.Begin;
            break;
        } else {
            break;
        }
    }

    return { containerNode: container, offset: offset };
}
