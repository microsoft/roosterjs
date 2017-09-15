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
    let adjustedContainer = container;
    let adjustedOffset = offset;

    if (adjustedContainer.nodeType == NodeType.Element && adjustedContainer.hasChildNodes()) {
        if (offset < adjustedContainer.childNodes.length) {
            // offset points to a child node that exists
            adjustedContainer = container.childNodes[offset];
            adjustedOffset = NodeBoundary.Begin;
        } else {
            // offset points to end of container
            adjustedContainer = container.childNodes[offset - 1];
            adjustedOffset =
                adjustedContainer.nodeType == NodeType.Text
                    ? adjustedContainer.nodeValue.length
                    : NodeBoundary.End;
        }
    }

    // Even we have an adjusted container, it does not mean it is a leaf
    // Still need to do the check, and adjust a bit further to last or first child
    // depending on what offset says
    if (adjustedContainer.hasChildNodes()) {
        if (adjustedOffset == 0) {
            while (adjustedContainer.firstChild) {
                adjustedContainer = adjustedContainer.firstChild;
            }
        } else {
            // adjustedOffset == 1 meaning end of node
            while (adjustedContainer.lastChild) {
                adjustedContainer = adjustedContainer.lastChild;
                adjustedOffset =
                    adjustedContainer.nodeType == NodeType.Text
                        ? adjustedContainer.nodeValue.length
                        : NodeBoundary.End;
            }
        }
    }

    return { containerNode: adjustedContainer, offset: adjustedOffset };
}
