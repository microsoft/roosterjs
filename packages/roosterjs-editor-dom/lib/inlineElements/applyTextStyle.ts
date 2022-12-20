import getTagOfNode from '../utils/getTagOfNode';
import Position from '../selection/Position';
import splitTextNode from '../utils/splitTextNode';
import wrap from '../utils/wrap';
import { getNextLeafSibling } from '../utils/getLeafSibling';
import { NodePosition, NodeType, PositionType } from 'roosterjs-editor-types';
import { splitBalancedNodeRange } from '../utils/splitParentNode';
import safeInstanceOf from '../utils/safeInstanceOf';

const STYLET_AGS = 'SPAN,B,I,U,EM,STRONG,STRIKE,S,SMALL,SUP,SUB'.split(',');

/**
 * Apply style using a styler function to the given container node in the given range
 * @param container The container node to apply style to
 * @param styler The styler function
 * @param fromPosition From position
 * @param toPosition To position
 */
export default function applyTextStyle(
    container: Node,
    styler: (node: HTMLElement, isInnerNode?: boolean) => any,
    from: NodePosition = new Position(container, PositionType.Begin).normalize(),
    to: NodePosition = new Position(container, PositionType.End).normalize()
) {
    let formatNodes: Node[] = [];
    let fromPosition: NodePosition | null = from;
    let toPosition: NodePosition | null = to;

    while (fromPosition && toPosition && toPosition.isAfter(fromPosition)) {
        let formatNode = fromPosition.node;
        let parentTag = getTagOfNode(formatNode.parentNode);

        // The code below modifies DOM. Need to get the next sibling first otherwise you won't be able to reliably get a good next sibling node
        let nextNode = getNextLeafSibling(container, formatNode);

        if (formatNode.nodeType == NodeType.Text && ['TR', 'TABLE'].indexOf(parentTag) < 0) {
            if (formatNode == toPosition.node && !toPosition.isAtEnd) {
                formatNode = splitTextNode(
                    <Text>formatNode,
                    toPosition.offset,
                    true /*returnFirstPart*/
                );
            }

            if (fromPosition.offset > 0) {
                formatNode = splitTextNode(
                    <Text>formatNode,
                    fromPosition.offset,
                    false /*returnFirstPart*/
                );
            }

            formatNodes.push(formatNode);
        }

        fromPosition = nextNode && new Position(nextNode, PositionType.Begin);
    }

    if (formatNodes.length > 0) {
        if (formatNodes.every(node => node.parentNode == formatNodes[0].parentNode)) {
            let newNode = formatNodes.shift()!;
            formatNodes.forEach(node => {
                const newNodeValue = (newNode.nodeValue || '') + (node.nodeValue || '');
                newNode.nodeValue = newNodeValue;
                node.parentNode?.removeChild(node);
            });
            formatNodes = [newNode];
        }

        formatNodes.forEach(startingNode => {
            // When apply style within style tags like B/I/U/..., we split the tag and apply outside them
            // So that the inner style tag such as U, STRIKE can inherit the style we added
            let node: Node | null = startingNode;
            while (
                node &&
                getTagOfNode(node) != 'SPAN' &&
                STYLET_AGS.indexOf(getTagOfNode(node.parentNode)) >= 0
            ) {
                callStylerWithInnerNode(node, styler);
                node = splitBalancedNodeRange(node);
            }

            if (node && getTagOfNode(node) != 'SPAN') {
                callStylerWithInnerNode(node, styler);
                node = wrap(node, 'SPAN');
            }

            if (safeInstanceOf(node, 'HTMLElement')) {
                styler(node);
            }
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
