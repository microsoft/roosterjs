import Position from '../selection/Position';
import { PositionType, Region } from 'roosterjs-editor-types';

export default function ensureRegionContent(region: Region) {
    if (!region.rootNode.firstChild) {
        const newNode = region.rootNode.ownerDocument.createElement('BR');
        region.rootNode.appendChild(newNode);
        region.fullSelectionStart = new Position(newNode, PositionType.Begin);
        region.fullSelectionEnd = new Position(newNode, PositionType.End);
    }
}
