import { NodeType } from 'roosterjs-editor-types';

/**
 * Test if a node contains another node
 * @param container The container node
 * @param contained The node to check if it is inside container
 * @param treatSameNodeAsContain When container and contained are the same node,
 * return true if this param is set to true, otherwise return false. Default value is false
 * @returns True if contained is insied container, or they are the same node when treatSameNodeAsContain is true.
 * Otherwise false.
 */
export default function contains(
    container: Node,
    contained: Node,
    treatSameNodeAsContain?: boolean
): boolean;

/**
 * Test if a node contains a given range
 * @param container The container node
 * @param contained The range to check if it is inside container
 * @returns True if contained is insied container, otherwise false
 */
export default function contains(container: Node, contained: Range): boolean;

export default function contains(
    container: Node,
    contained: Node | Range,
    treatSameNodeAsContain?: boolean
): boolean {
    if (!container || !contained) {
        return false;
    }

    if (treatSameNodeAsContain && container == contained) {
        return true;
    }

    if (!(contained instanceof Node)) {
        contained = contained && contained.commonAncestorContainer;
        treatSameNodeAsContain = true;
    }

    if (contained && contained.nodeType == NodeType.Text) {
        contained = contained.parentNode;
        treatSameNodeAsContain = true;
    }

    if (container.nodeType != NodeType.Element) {
        return !!treatSameNodeAsContain && container == contained;
    }

    return !!(treatSameNodeAsContain || container != contained) && container.contains(contained);
}
