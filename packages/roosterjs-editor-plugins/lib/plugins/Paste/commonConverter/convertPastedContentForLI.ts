import {
    changeElementTag,
    getTagOfNode,
    toArray,
    wrap,
    safeInstanceOf,
} from 'roosterjs-editor-dom';

/**
 * @internal
 * Convert content copied from Teams to be well-formed
 */
export default function convertPastedContentForLI(fragment: DocumentFragment) {
    // Sometimes it is possible that we get LI nodes directly under DIV.
    // In that case we need to convert DIV to UL. It is also possible to be OL, but we don't know it.
    // So always assume it is UL here, and later user can change it.
    if (isPureLiNode(fragment)) {
        wrap(toArray(fragment.childNodes), 'UL');
    } else if (isPureLiNode(fragment.firstChild)) {
        changeElementTag(fragment.firstChild as HTMLElement, 'UL');
    }
}

function isPureLiNode(node: Node) {
    return (
        node &&
        !node.nextSibling &&
        ['OL', 'UL', 'MENU'].indexOf(getTagOfNode(node)) < 0 &&
        toArray(node.childNodes).every(
            childNode =>
                (safeInstanceOf(childNode, 'Text') && !childNode.nodeValue?.trim()) ||
                getTagOfNode(childNode) == 'LI'
        )
    );
}
