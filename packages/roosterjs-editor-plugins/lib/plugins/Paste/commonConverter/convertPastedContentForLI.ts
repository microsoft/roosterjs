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
    } else if (
        safeInstanceOf(fragment.firstChild, 'HTMLElement') &&
        isPureLiNode(fragment.firstChild)
    ) {
        changeElementTag(fragment.firstChild as HTMLElement, 'UL');
    }
}

function isPureLiNode(node: ParentNode & Node) {
    if (node && !node.nextSibling && ['OL', 'UL', 'MENU'].indexOf(getTagOfNode(node)) < 0) {
        let hasLi = false;
        if (
            toArray(node.childNodes).every(childNode => {
                if (safeInstanceOf(childNode, 'Text') && !childNode.nodeValue?.trim()) {
                    return true;
                } else if (getTagOfNode(childNode) == 'LI') {
                    hasLi = true;
                    return true;
                } else {
                    return false;
                }
            }) &&
            hasLi
        ) {
            return true;
        }
    }
    return false;
}
