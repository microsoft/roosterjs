import getComputedStyle from './getComputedStyle';
import { NodeType } from 'roosterjs-editor-types';

// Checks if the node is a block like element. Block like element are usually those P, DIV, LI, TD etc.
// TODO: should inline-block be considered as block?
// Other block like style to consider: table-caption, table-header-group, table-footer-group etc.
export default function isBlockElement(node: Node): boolean {
    if (node && node.nodeType == NodeType.Element) {
        let displayStyle = getComputedStyle(node, 'display');
        return (
            displayStyle == 'block' || displayStyle == 'list-item' || displayStyle == 'table-cell'
        );
    }

    return false;
}
