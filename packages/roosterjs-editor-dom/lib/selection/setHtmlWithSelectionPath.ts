import createRange from './createRange';
import { NodeType, SelectionPath } from 'roosterjs-editor-types';

/**
 * Restore inner Html of a root element from given html string. If the string contains selection path,
 * remove the selection path and return a range represented by the path
 * @param root The root element
 * @param html The html to restore
 * @returns A selection range if the html contains a valid selection path, otherwise null
 */
export default function setHtmlWithSelectionPath(rootNode: HTMLElement, html: string): Range {
    rootNode.innerHTML = html || '';
    let path: SelectionPath = null;
    let pathComment = rootNode.lastChild;

    try {
        path =
            pathComment &&
            pathComment.nodeType == NodeType.Comment &&
            (JSON.parse(pathComment.nodeValue) as SelectionPath);
        if (path && path.end && path.end.length > 0 && path.start && path.start.length > 0) {
            rootNode.removeChild(pathComment);
        } else {
            path = null;
        }
    } catch {}

    return path && createRange(rootNode, path.start, path.end);
}
