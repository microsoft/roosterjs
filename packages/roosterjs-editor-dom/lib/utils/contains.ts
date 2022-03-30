import safeInstanceOf from './safeInstanceOf';
import { NodeType } from 'roosterjs-editor-types';

/**
 * Test if a node contains another node
 * @param container The container node
 * @param contained The node to check if it is inside container
 * @param treatSameNodeAsContain When container and contained are the same node,
 * return true if this param is set to true, otherwise return false. Default value is false
 * @returns True if contained is inside container, or they are the same node when treatSameNodeAsContain is true.
 * Otherwise false.
 */
export default function contains(
    container: Node | null | undefined,
    contained: Node | null | undefined,
    treatSameNodeAsContain?: boolean
): boolean;

/**
 * Test if a node contains a given range
 * @param container The container node
 * @param contained The range to check if it is inside container
 * @returns True if contained is inside container, otherwise false
 */
export default function contains(
    container: Node | null | undefined,
    contained: Range | null | undefined
): boolean;

export default function contains(
    container: Node | null | undefined,
    contained: Node | Range | null | undefined,
    treatSameNodeAsContain?: boolean
): boolean {
    if (!container || !contained) {
        return false;
    }

    if (treatSameNodeAsContain && container == contained) {
        return true;
    }

    if (safeInstanceOf(contained, 'Range')) {
        contained = contained && contained.commonAncestorContainer;
        treatSameNodeAsContain = true;
    }

    if (contained && contained.nodeType == NodeType.Text) {
        contained = contained.parentNode;
        treatSameNodeAsContain = true;
    }

    if (container.nodeType != NodeType.Element && container.nodeType != NodeType.DocumentFragment) {
        return !!treatSameNodeAsContain && container == contained;
    }

    return (
        !!(treatSameNodeAsContain || container != contained) &&
        internalContains(container, contained)
    );
}

function internalContains(container: Node, contained: Node | null): boolean {
    if (container.contains) {
        return container.contains(contained);
    } else {
        while (contained) {
            if (contained == container) {
                return true;
            }

            contained = contained.parentNode;
        }

        return false;
    }
}
