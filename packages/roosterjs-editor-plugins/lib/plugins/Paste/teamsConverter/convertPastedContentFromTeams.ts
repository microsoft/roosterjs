import { changeElementTag, getTagOfNode, toArray } from 'roosterjs-editor-dom';

/**
 * @internal
 * Convert content copied from Teams to be well-formed
 */
export default function convertPastedContentFromTeams(fragment: DocumentFragment) {
    const firstChild = fragment.firstChild;

    // When copy from Teams, it is possible that we get LI nodes directly under DIV.
    // In that case we need to convert DIV to UL. It is also possible to be OL, but we don't know it.
    // So always assume it is UL here, and later user can change it.
    if (
        firstChild &&
        !firstChild.nextSibling &&
        getTagOfNode(firstChild) == 'DIV' &&
        !toArray(firstChild.childNodes).some(node => getTagOfNode(node) != 'LI')
    ) {
        changeElementTag(firstChild as HTMLElement, 'UL');
    }
}
