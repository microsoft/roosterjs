import { isNodeOfType } from '../../domUtils/isNodeOfType';
import { NodePosition, NodeType } from 'roosterjs-editor-types';
import { Position, toArray } from 'roosterjs-editor-dom';
import { RegularSelection } from '../context/ModelToDomContext';

/**
 * @internal
 */
export function getSelectionPosition(selection: RegularSelection): NodePosition | undefined {
    if (!selection.currentBlockNode) {
        return undefined;
    } else if (!selection.currentSegmentNode) {
        return new Position(selection.currentBlockNode, 0);
    } else if (isNodeOfType(selection.currentSegmentNode, NodeType.Text)) {
        return new Position(
            selection.currentSegmentNode,
            selection.currentSegmentNode.nodeValue!.length
        );
    } else {
        return new Position(
            selection.currentSegmentNode.parentNode!,
            toArray(
                selection.currentSegmentNode.parentNode!.childNodes as NodeListOf<Node>
            ).indexOf(selection.currentSegmentNode!) + 1
        );
    }
}
