import createRange from './createRange';
import { NodeType, SelectionPath, TrustedHTMLHandler } from 'roosterjs-editor-types';

const LastCommentRegex = /<!--([^-]+)-->$/;

/**
 * Restore inner Html of a root element from given html string. If the string contains selection path,
 * remove the selection path and return a range represented by the path
 * @param root The root element
 * @param html The html to restore
 * @returns A selection range if the html contains a valid selection path, otherwise null
 */
export default function setHtmlWithSelectionPath(
    rootNode: HTMLElement,
    html: string,
    trustedHTMLHandler?: TrustedHTMLHandler
): Range {
    if (!rootNode) {
        return null;
    }

    html = html || '';
    const lastComment = LastCommentRegex.exec(html);
    rootNode.innerHTML = trustedHTMLHandler?.(html) || html;
    const path = getSelectionPath(rootNode, lastComment?.[1]);

    return path && createRange(rootNode, path.start, path.end);
}

function getSelectionPath(root: HTMLElement, alternativeComment: string): SelectionPath {
    let pathCommentValue: string = '';
    let pathCommentNode: Node = null;
    let path: SelectionPath = null;
    if (root.lastChild?.nodeType == NodeType.Comment) {
        pathCommentNode = root.lastChild;
        pathCommentValue = pathCommentNode.nodeValue;
    } else {
        pathCommentValue = alternativeComment;
    }

    if (pathCommentValue) {
        try {
            path = JSON.parse(pathCommentValue) as SelectionPath;
            if (path && path.start?.length > 0 && path.end?.length > 0) {
                if (pathCommentNode) {
                    root.removeChild(pathCommentNode);
                }
            } else {
                path = null;
            }
        } catch {}
    }

    return path;
}
