import getTagOfNode from './getTagOfNode';
import Position from '../selection/Position';
import splitTextNode from './splitTextNode';
import wrap from './wrap';
import { getNextLeafSibling } from './getLeafSibling';
import { NodePosition, NodeType, PositionType } from 'roosterjs-editor-types';
import { splitBalancedNodeRange } from './splitParentNode';

const STYLETAGS = 'SPAN,B,I,U,EM,STRONG,STRIKE,S,SMALL'.split(',');

/**
 * Apply style using a styler function to the given container node in the given range
 * @param container The container node to apply style to
 * @param styler The styler function
 * @param from From position
 * @param to To position
 */
export default function applyTextStyle(
    container: Node,
    styler: (node: HTMLElement, isInnerNode?: boolean) => any,
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
                formatNode = splitTextNode(<Text>formatNode, to.offset, true /*returnFirstPart*/);
            }

            if (from.offset > 0) {
                formatNode = splitTextNode(
                    <Text>formatNode,
                    from.offset,
                    false /*returnFirstPart*/
                );
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

        formatNodes.forEach(node => {
            // When apply style within style tags like B/I/U/..., we split the tag and apply outside them
            // So that the inner style tag such as U, STRIKE can inherit the style we added
            while (
                getTagOfNode(node) != 'SPAN' &&
                STYLETAGS.indexOf(getTagOfNode(node.parentNode)) >= 0
            ) {
                callStylerWithInnerNode(node, styler);
                node = splitBalancedNodeRange(node);
            }

            if (getTagOfNode(node) != 'SPAN') {
                callStylerWithInnerNode(node, styler);
                node = wrap(node, 'SPAN');
            }
            styler(<HTMLElement>node);
        });
    }
}

function callStylerWithInnerNode(
    node: Node,
    styler: (node: HTMLElement, isInnerNode?: boolean) => any
) {
    if (node && node.nodeType == NodeType.Element) {
        styler(node as HTMLElement, true /*isInnerNode*/);
    }
}
