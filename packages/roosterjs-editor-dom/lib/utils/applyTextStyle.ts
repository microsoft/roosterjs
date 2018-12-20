import getTagOfNode from './getTagOfNode';
import Position from '../selection/Position';
import wrap from './wrap';
import { getNextLeafSibling } from './getLeafSibling';
import { NodePosition, NodeType, PositionType } from 'roosterjs-editor-types';
import { splitBalancedNodeRange } from './splitParentNode';

export default function applyTextStyle(
    container: Node,
    styler: (node: HTMLElement) => any,
    from: NodePosition = new Position(container, PositionType.Begin).normalize(),
    to: NodePosition = new Position(container, PositionType.End).normalize()
) {
    let formatNodes: Node[] = [];

    while (from && to && to.isAfter(from)) {
        let formatNode = from.node;
        let parentTag = getTagOfNode(formatNode.parentNode);

        // The code below modifies DOM. Need to get the next sibling first otherwise you won't be able to reliably get a good next sibling node
        let nextNode = getNextLeafSibling(container, formatNode);

        if (formatNode.nodeType == NodeType.Text && ['TR', 'TABLE'].indexOf(parentTag) < 0) {
            if (formatNode == to.node && !to.isAtEnd) {
                formatNode = splitTextNode(formatNode, to.offset, true /*returnFirstPart*/);
            }

            if (from.offset > 0) {
                formatNode = splitTextNode(formatNode, from.offset, false /*returnFirstPart*/);
            }

            formatNodes.push(formatNode);
        }

        from = nextNode && new Position(nextNode, PositionType.Begin);
    }

    if (formatNodes.length > 0) {
        if (formatNodes.every(node => node.parentNode == formatNodes[0].parentNode)) {
            let newNode = formatNodes.shift();
            formatNodes.forEach(node => {
                newNode.nodeValue += node.nodeValue;
                node.parentNode.removeChild(node);
            });
            formatNodes = [newNode];
        }

        formatNodes.forEach(node =>
            styler(
                getTagOfNode(node.parentNode) == 'SPAN'
                    ? splitBalancedNodeRange(node)
                    : wrap(node, 'span')
            )
        );
    }
}

function splitTextNode(textNode: Node, offset: number, returnFirstPart: boolean) {
    let firstPart = textNode.nodeValue.substr(0, offset);
    let secondPart = textNode.nodeValue.substr(offset);
    let newNode = textNode.ownerDocument.createTextNode(returnFirstPart ? firstPart : secondPart);
    textNode.nodeValue = returnFirstPart ? secondPart : firstPart;
    textNode.parentNode.insertBefore(newNode, returnFirstPart ? textNode : textNode.nextSibling);
    return newNode;
}
