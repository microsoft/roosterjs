import { NodeType } from 'roosterjs-editor-types';

/**
 * Test if a node contains another node
 * @param container The container node
 * @param contained The node to check if it is insied container
 * @param treatSameNodeAsContain When container and contained are the same node,
 * return true if this param is set to true, otherwise return false. Default value is false
 * @returns True if contained is insied container, or they are the same node when treatSameNodeAsContain is true.
 * Otherwise false.
 */
export default function contains(
    container: Node,
    contained: Node,
    treatSameNodeAsContain?: boolean
): boolean {
    if (!container || !contained) {
        return false;
    }

    if (container.nodeType != NodeType.Element) {
        return treatSameNodeAsContain && container == contained;
    }

    if (contained.nodeType == NodeType.Text) {
        contained = contained.parentNode;
        treatSameNodeAsContain = true;
    }

    return (treatSameNodeAsContain || container != contained) && container.contains(contained);
}
