// Represent a point in editor DOM. The reason why we come up with this
// is for selection at node boundary, depending on the state of browser, you may
// get different representation of the point from selection.startContainer/startOffset
// i.e. <div>{text1}<sel>{text2}<div>, browser could return you a startContainer/startOffset
// pair of div/1, or text1/0. This is hard to do point to point comparision.
// This EditorPoint is essentially a normalized version of startContainer/startOffset where
// we ensure the container node always points to lowest node in DOM tree. In this case, it will be text0
// In summary:
// containerNode: the lowest node in dom tree
// offset = NodeBoundary.Begin: begin of the node
// offset = NodeBoudnary.End: end of node for non-textual node
// offset = offset into text node for text node
/**
 * @deprecated
 */
export const enum NodeBoundary {
    Begin = 0,
    End = 1,
}

interface EditorPoint {
    containerNode: Node;
    offset: NodeBoundary | number;
}

export default EditorPoint;
