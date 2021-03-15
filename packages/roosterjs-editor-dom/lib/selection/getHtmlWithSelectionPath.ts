import getInnerHTML from '../utils/getInnerHTML';
import getSelectionPath from './getSelectionPath';
import getTagOfNode from '../utils/getTagOfNode';
import queryElements from '../utils/queryElements';

/**
 * Get inner Html of a root node with a selection path which can be used for restore selection.
 * The result string can be used by setHtmlWithSelectionPath() to restore the HTML and selection.
 * @param rootNode Root node to get inner Html from
 * @param range The range of selection. If pass null, no selection path will be added
 * @returns Inner HTML of the root node, followed by HTML comment contains selection path if the given range is valid
 */
export default function getHtmlWithSelectionPath(
    rootNode: HTMLElement | DocumentFragment,
    range: Range
): string {
    if (!rootNode) {
        return '';
    }

    const { startContainer, endContainer, startOffset, endOffset } = range || {};
    let isDOMChanged = false;

    queryElements(rootNode, 'table', table => {
        let tbody: HTMLTableSectionElement = null;

        for (let child = table.firstChild; child; child = child.nextSibling) {
            if (getTagOfNode(child) == 'TR') {
                if (!tbody) {
                    tbody = table.ownerDocument.createElement('tbody');
                    table.insertBefore(tbody, child);
                }

                tbody.appendChild(child);
                child = tbody;

                isDOMChanged = true;
            } else {
                tbody = null;
            }
        }
    });

    if (range && isDOMChanged) {
        try {
            range.setStart(startContainer, startOffset);
            range.setEnd(endContainer, endOffset);
        } catch {}
    }

    const content = getInnerHTML(rootNode);
    const selectionPath = range && getSelectionPath(rootNode, range);

    return selectionPath ? `${content}<!--${JSON.stringify(selectionPath)}-->` : content;
}
